import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import { NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import Workspace from "@/models/Workspace";
import MyApplications from "@/models/MyApplications";
import { routeWrapper } from "@/libs/routeWrapper";
import mongoose from "mongoose";

export const DELETE = routeWrapper(
	DELETEHandler,
	"/api/workspace/[workspaceId]",
);

async function DELETEHandler(
	request: Request,
	{ params }: { params: { workspaceId: string; memberId: string } },
) {
	const session = await getServerSession(authOptions);

	const { workspaceId } = params;

	if (!workspaceId) {
		return NextResponse.json(
			{ error: "Invalid workspace ID" },
			{ status: 400 },
		);
	}

	await connectMongo();

	const workspace = await Workspace.findById(workspaceId);

	if (!workspace) {
		return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
	}

	if (workspace.owner.toString() !== session.user.id) {
		return NextResponse.json(
			{ error: "You do not have permission to remove this workspace" },
			{ status: 403 },
		);
	}

	const deleted = await Workspace.deleteOne({ _id: workspaceId });
	await MyApplications.deleteMany({ workspaceId: workspaceId });

	return NextResponse.json(deleted, { status: 200 });
}

export const GET = routeWrapper(GETHandler, "/api/workspace/[workspaceId]");

async function GETHandler(
	request: Request,
	{ params }: { params: { workspaceId: string; memberId: string } },
) {
	const session = await getServerSession(authOptions);

	const { workspaceId } = params;

	if (!workspaceId) {
		return NextResponse.json(
			{ error: "Invalid workspace ID" },
			{ status: 400 },
		);
	}

	await connectMongo();

	const workspace = await Workspace.findById(workspaceId);

	if (!workspace) {
		return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
	}

	if (
		workspace.owner.toString() != session.user.id &&
		!workspace.members.find(
			(member) => member.memberId.toString() == session.user.id,
		)
	) {
		return NextResponse.json(
			{ error: "You do not have permission to get this workspace" },
			{ status: 403 },
		);
	}

	return NextResponse.json(workspace, { status: 200 });
}
