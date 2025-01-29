import connectMongo from "@/libs/mongoose";
import { authOptions } from "@/libs/next-auth";
import User from "@/models/User";
import Workspace from "@/models/Workspace";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { routeWrapper } from "@/libs/routeWrapper";

export const POST = routeWrapper(POSTHandler, "/api/workspace/transfer-owner");

async function POSTHandler(request: Request) {
	const session = await getServerSession(authOptions);

	await connectMongo();

	const { workspaceId, userId } = await request.json();
	const user = await User.findById(new mongoose.Types.ObjectId(userId));

	if (!user) {
		return NextResponse.json({ error: "User not found" }, { status: 404 });
	}

	const worksPace = await Workspace.findById(
		new mongoose.Types.ObjectId(workspaceId),
	);

	if (!worksPace) {
		return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
	}

	if (worksPace.owner.toString() !== session.user.id) {
		return NextResponse.json(
			{ error: "You do not have permission to transfer this workspace" },
			{ status: 403 },
		);
	}

	const removeMember = Workspace.findByIdAndUpdate(workspaceId, {
		$pull: {
			members: {
				memberId: new mongoose.Types.ObjectId(userId),
			},
		},
	});
	const updateOwner = worksPace.updateOne({ $set: { owner: user._id } });
	const moveOwnerToAdmin = Workspace.findByIdAndUpdate(workspaceId, {
		$push: {
			members: {
				memberId: new mongoose.Types.ObjectId(session.user.id),
				role: "admin",
			},
		},
	});

	await Promise.all([removeMember, updateOwner, moveOwnerToAdmin]);

	return NextResponse.json(user);
}
