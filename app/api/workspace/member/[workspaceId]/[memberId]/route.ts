import connectMongo from "@/libs/mongoose";
import { authOptions } from "@/libs/next-auth";
import { routeWrapper } from "@/libs/routeWrapper";
import User from "@/models/User";
import Workspace from "@/models/Workspace";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { getAuthorizationToInviteUser } from "@/app/api/workspace/invite/_utils/get-authorization-to-invite-user";

export const DELETE = routeWrapper(
	DELETEHandler,
	"/api/workspace/member/[workspaceId]/[memberId]",
);

async function DELETEHandler(
	request: Request,
	{ params }: { params: { workspaceId: string; memberId: string } },
) {
	const session = await getServerSession(authOptions);

	await connectMongo();

	const { workspaceId, memberId } = params;

	const worksPace = await Workspace.findById(
		new mongoose.Types.ObjectId(workspaceId),
	);

	if (!worksPace) {
		return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
	}

	const isAuthorizedToInviteUser = getAuthorizationToInviteUser(
		worksPace,
		session,
	);

	if (!isAuthorizedToInviteUser) {
		return NextResponse.json(
			{ error: "You do not have permission to remove this member" },
			{ status: 403 },
		);
	}

	const newWorkspace = await Workspace.findByIdAndUpdate(workspaceId, {
		$pull: {
			members: {
				memberId: new mongoose.Types.ObjectId(memberId),
			},
		},
	});

	return NextResponse.json(newWorkspace, { status: 200 });
}

export const PATCH = routeWrapper(
	PATCHHandler,
	"/api/workspace/member/[workspaceId]/[memberId]",
);

async function PATCHHandler(
	request: Request,
	{ params }: { params: { workspaceId: string; memberId: string } },
) {
	const session = await getServerSession(authOptions);

	await connectMongo();

	const { workspaceId, memberId } = params;

	const worksPace = await Workspace.findById(
		new mongoose.Types.ObjectId(workspaceId),
	);

	if (!worksPace) {
		return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
	}

	const memberRole = worksPace.members.find(
		(member) => member.memberId.toString() === session.user.id.toString(),
	)?.role;

	if (
		worksPace.owner.toString() !== session.user.id &&
		memberRole !== "admin"
	) {
		return NextResponse.json(
			{ error: "You do not have permission to update this workspace" },
			{ status: 403 },
		);
	}

	const member = worksPace.members.find(
		(member) => member.memberId.toString() === memberId,
	);

	if (!member) {
		return NextResponse.json({ error: "Member not found" }, { status: 404 });
	}

	const body = await request.json();

	if (!["admin", "member"].includes(body.role)) {
		return NextResponse.json(
			{ error: "Role must be admin or member" },
			{ status: 400 },
		);
	}

	const updatedMember = await Workspace.findOneAndUpdate(
		{ _id: workspaceId, "members.memberId": memberId },
		{
			$set: {
				"members.$.role": body.role,
			},
		},
		{ new: true },
	);

	return NextResponse.json(updatedMember, { status: 200 });
}
