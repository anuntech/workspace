import connectMongo from "@/libs/mongoose";
import { authOptions } from "@/libs/next-auth";
import { verifyWorkspaceInviteToken } from "@/libs/workspace-invite";
import Workspace from "@/models/Workspace";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { routeWrapper } from "@/libs/routeWrapper";

export const GET = routeWrapper(
	GETHandler,
	"/api/workspace/get-invite-data/[invite]",
);

async function GETHandler(
	request: Request,
	{ params }: { params: { invite: string } },
) {
	const session = await getServerSession(authOptions);

	await connectMongo();

	const { invite } = params;

	const data = verifyWorkspaceInviteToken(invite) as any;

	if (!data) {
		return NextResponse.json({ error: "Invalid token" }, { status: 400 });
	}

	const workspace = await Workspace.findById(data.workspaceId);

	return NextResponse.json({ ...data, name: workspace.name });
}
