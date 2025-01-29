import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import { NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import User from "@/models/User";
import clientPromise from "@/libs/mongo";
import mongoose from "mongoose";
import Workspace from "@/models/Workspace";
import { routeWrapper } from "@/libs/routeWrapper";

export const POST = routeWrapper(POSTHandler, "/api/workspace/tutorial");

async function POSTHandler(request: Request) {
	const session = await getServerSession(authOptions);

	const body = await request.json();

	if (!["workspace", "invitation", "application"].includes(body.pageOpened)) {
		return NextResponse.json({ error: "pageOpened inválido" }, { status: 400 });
	}

	await connectMongo();

	const user = await User.findById(session?.user?.id);

	const workspace = await Workspace.findById(body.workspaceId);

	if (!workspace) {
		return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
	}

	if (user?.pagesOpened?.find((el: any) => el.name == body.pageOpened)) {
		return NextResponse.json(
			{ error: "pageOpened already added" },
			{ status: 400 },
		);
	}

	const isAdminOrOwner =
		workspace?.owner.toString() == user?._id ||
		workspace.members.find(
			(member: any) => member.userId == user?._id && member.role == "admin",
		);

	if (!isAdminOrOwner) {
		return NextResponse.json(
			{ error: "You don't have permission to open this page." },
			{ status: 400 },
		);
	}

	if (!workspace?.tutorial) {
		workspace.tutorial = [];
	}

	workspace?.tutorial?.push({
		name: body.pageOpened,
	});

	await workspace.save();

	return NextResponse.json(workspace);
}
