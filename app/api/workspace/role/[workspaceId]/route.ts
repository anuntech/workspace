import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import { NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import Workspace from "@/models/Workspace";
import { routeWrapper } from "@/libs/routeWrapper";

export const GET = routeWrapper(
	GETHandler,
	"/api/workspace/role/[workspaceId]",
);

async function GETHandler(
	request: Request,
	{ params }: { params: { workspaceId: string } },
) {
	const session = await getServerSession(authOptions);

	const { workspaceId } = params;

	await connectMongo();

	const workspace = await Workspace.findById(workspaceId);

	if (!workspace) {
		return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
	}

	if (workspace.owner.toString() == session.user.id.toString()) {
		return NextResponse.json({ role: "owner" }, { status: 200 });
	}

	const user = workspace.members.find(
		(member: any) => member.memberId.toString() == session.user.id.toString(),
	);

	if (!user) {
		return NextResponse.json(
			{ error: "You are not a member of this workspace" },
			{ status: 403 },
		);
	}

	return NextResponse.json({ role: user.role }, { status: 200 });
}
