import connectMongo from "@/libs/mongoose";
import { authOptions } from "@/libs/next-auth";
import { routeWrapper } from "@/libs/routeWrapper";
import User from "@/models/User";
import Workspace from "@/models/Workspace";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export const GET = routeWrapper(GETHandler, "/api/workspace/members/[id]");

async function GETHandler(
	request: Request,
	{ params }: { params: { id: string } },
) {
	const session = await getServerSession(authOptions);

	await connectMongo();

	const { id } = params;

	const worksPace = await Workspace.findById(new mongoose.Types.ObjectId(id));

	if (!worksPace) {
		return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
	}

	const users = await User.find({
		_id: { $in: worksPace.members?.map((member) => member.memberId) },
	}).select("name email image icon");

	const membersWithRoles = worksPace.members.map((member) => {
		const user = users.find(
			(u) => u._id.toString() === member.memberId.toString(),
		);
		return {
			...user?.toObject(),
			role: member.role,
		};
	});

	return NextResponse.json(membersWithRoles);
}
