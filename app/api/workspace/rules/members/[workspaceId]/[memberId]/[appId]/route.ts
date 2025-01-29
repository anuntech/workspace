import connectMongo from "@/libs/mongoose";
import { authOptions } from "@/libs/next-auth";
import Workspace from "@/models/Workspace";
import Applications from "@/models/Applications";
import User from "@/models/User";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { routeWrapper } from "@/libs/routeWrapper";

export const DELETE = routeWrapper(
	DELETEHandler,
	"/api/workspace/rules/members/[workspaceId]/[memberId]/[appId]",
);

async function DELETEHandler(
	request: Request,
	{
		params,
	}: {
		params: {
			workspaceId: string;
			memberId: string;
			appId: string;
		};
	},
) {
	const session = await getServerSession(authOptions);

	await connectMongo();

	const { workspaceId, memberId, appId } = params;

	if (!workspaceId || !memberId || !appId) {
		return NextResponse.json(
			{ error: "{workspaceId, memberId, appId} must be provided" },
			{ status: 400 },
		);
	}

	const user = await User.findById(session.user.id);
	if (!user) {
		return NextResponse.json({ error: "User not found" }, { status: 404 });
	}

	const workspace = await Workspace.findById(workspaceId);
	if (!workspace) {
		return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
	}

	const isAuthorAllowed =
		user.id.toString() === workspace.owner.toString() ||
		workspace.members.find((m) => m.memberId.toString() === user.id.toString())
			?.role === "admin";

	if (!isAuthorAllowed) {
		return NextResponse.json(
			{ error: "You are not allowed to remove this app from this workspace" },
			{ status: 403 },
		);
	}

	const app = await Applications.findById(appId);
	if (!app) {
		return NextResponse.json({ error: "App not found" }, { status: 404 });
	}

	const isMember = workspace.members.find(
		(m) => m.memberId.toString() === memberId.toString(),
	);

	if (!isMember) {
		return NextResponse.json(
			{ error: "This member is not part of this workspace" },
			{ status: 403 },
		);
	}

	const allowedMemberApp = workspace.rules.allowedMemberApps.find(
		(a) => a.appId.toString() === app.id.toString(),
	);

	if (!allowedMemberApp) {
		return NextResponse.json(
			{ error: "This app is not assigned to this workspace" },
			{ status: 404 },
		);
	}

	// Check if the member exists in the app's members list
	const memberIndex = allowedMemberApp.members.findIndex(
		(m) => m.memberId.toString() === memberId.toString(),
	);

	if (memberIndex === -1) {
		return NextResponse.json(
			{ error: "This member does not have access to this app" },
			{ status: 404 },
		);
	}

	// Remove the member from the app's member list
	allowedMemberApp.members.splice(memberIndex, 1);

	await workspace.save();

	return NextResponse.json({ message: "Member removed successfully" });
}
