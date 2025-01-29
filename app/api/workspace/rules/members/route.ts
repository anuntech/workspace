import connectMongo from "@/libs/mongoose";
import { authOptions } from "@/libs/next-auth";
import Applications from "@/models/Applications";
import MyApplications from "@/models/MyApplications";
import User from "@/models/User";
import Workspace from "@/models/Workspace";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { routeWrapper } from "@/libs/routeWrapper";

export const POST = routeWrapper(POSTHandler, "/api/workspace/rules/members");

async function POSTHandler(request: Request) {
	const session = await getServerSession(authOptions);

	await connectMongo();

	const { workspaceId, memberId, appId } = await request.json();
	if (!workspaceId || !memberId || !appId) {
		return NextResponse.json(
			{ error: "{workspaceId memberId appId} need to be provided" },
			{ status: 404 },
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
		user.id.toString() == workspace.owner.toString() ||
		workspace.members.find((m) => m.memberId.toString() == user.id.toString())
			.role == "admin";

	if (!isAuthorAllowed) {
		return NextResponse.json(
			{ error: "You are not allowed to add this app to this workspace" },
			{ status: 403 },
		);
	}

	const member = await User.findById(memberId);

	if (!member) {
		return NextResponse.json({ error: "Member not found" }, { status: 404 });
	}

	const app = await Applications.findById(appId);

	if (!app) {
		return NextResponse.json({ error: "App not found" }, { status: 404 });
	}

	const isMember = workspace.members.find(
		(m) => m.memberId.toString() == memberId.toString(),
	);

	if (!isMember) {
		return NextResponse.json(
			{ error: "You are not a member of this workspace" },
			{ status: 403 },
		);
	}

	const alreadyExists = workspace.rules.allowedMemberApps.find(
		(a) => a.appId == app.id,
	);
	if (
		alreadyExists &&
		alreadyExists.members.find(
			(m) => m.memberId.toString() == member.id.toString(),
		)
	) {
		return NextResponse.json(
			{ error: "This member already have access to this app" },
			{
				status: 403,
			},
		);
	}

	const myApplications = await MyApplications.findOne({
		workspaceId: workspace.id,
	});

	const isWorkspaceAllowed = myApplications?.allowedApplicationsId.includes(
		app.id,
	);

	if (!isWorkspaceAllowed) {
		return NextResponse.json(
			{ error: "You are not allowed to add this app to this workspace" },
			{ status: 403 },
		);
	}

	const isThereAllowedMemberApps = workspace.rules.allowedMemberApps.find(
		(a) => a.appId.toString() == app.id.toString(),
	);
	if (!isThereAllowedMemberApps) {
		workspace.rules.allowedMemberApps.push({
			appId: app._id,
			members: [
				{
					memberId: member.id,
				},
			],
		});
	} else {
		isThereAllowedMemberApps.members.push({
			memberId: member.id,
		});
	}

	await workspace.save();

	return NextResponse.json(workspace);
}
