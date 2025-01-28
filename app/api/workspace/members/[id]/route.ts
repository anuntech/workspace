import connectMongo from "@/libs/mongoose";
import { authOptions } from "@/libs/next-auth";
import User from "@/models/User";
import Workspace from "@/models/Workspace";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(
	request: Request,
	{ params }: { params: { id: string } },
) {
	try {
		const session = await getServerSession(authOptions);

		await connectMongo();

		const { id } = params;

		const worksPace = await Workspace.findById(new mongoose.Types.ObjectId(id));

		if (!worksPace) {
			return NextResponse.json(
				{ error: "Workspace not found" },
				{ status: 404 },
			);
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
	} catch (e) {
		console.error(e);
		return NextResponse.json({ error: e?.message }, { status: 500 });
	}
}
