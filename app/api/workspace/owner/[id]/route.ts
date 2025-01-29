import connectMongo from "@/libs/mongoose";
import { authOptions } from "@/libs/next-auth";
import { routeWrapper } from "@/libs/routeWrapper";
import User from "@/models/User";
import Workspace from "@/models/Workspace";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export const GET = routeWrapper(GETHandler, "/api/workspace/owner/[id]");

async function GETHandler(
	request: Request,
	{ params }: { params: { id: string } },
) {
	await getServerSession(authOptions);

	await connectMongo();

	const { id } = params;

	const worksPace = await Workspace.findById(new mongoose.Types.ObjectId(id));

	if (!worksPace) {
		return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
	}

	const user = await User.findOne({
		_id: worksPace.owner,
	});

	return NextResponse.json(user);
}
