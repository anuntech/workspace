import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import { NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import Workspace from "@/models/Workspace";
import mongoose from "mongoose";
import { isValidEmoji } from "@/libs/icons";
import { routeWrapper } from "@/libs/routeWrapper";

export const POST = routeWrapper(POSTHandler, "/api/workspace");

async function POSTHandler(request: Request) {
	const session = await getServerSession(authOptions);
	const body = await request.json();

	await connectMongo();

	if (!isValidEmoji(body.icon.value)) {
		return NextResponse.json({ error: "Invalid emoji" }, { status: 400 });
	}

	if (body.icon.type != "emoji" && body.icon.type != "image") {
		return NextResponse.json({ error: "Invalid icon type" }, { status: 400 });
	}

	const userWorkspace = await Workspace.find({ owner: session.user.id });

	if (userWorkspace.length >= 20) {
		return NextResponse.json(
			{ error: "Você não pode criar mais de 20 workspaces" },
			{ status: 400 },
		);
	}

	const user = new Workspace({
		name: body.name,
		icon: body.icon,
		owner: new mongoose.Types.ObjectId(session.user.id),
	});

	await user.save();

	return NextResponse.json(user, { status: 201 });
}

export const GET = routeWrapper(GETHandler, "/api/workspace");

async function GETHandler(request: Request) {
	const session = await getServerSession(authOptions);

	if (!session) {
		return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
	}

	await connectMongo();

	const user = await Workspace.find({ owner: session.user.id });
	const memberWorkspace = await Workspace.find({
		members: {
			$elemMatch: {
				memberId: session.user.id,
			},
		},
	});

	return NextResponse.json([...user, ...memberWorkspace]);
}

export const PATCH = routeWrapper(PATCHHandler, "/api/workspace");

async function PATCHHandler(request: Request) {
	const session = await getServerSession(authOptions);

	if (!session) {
		return NextResponse.json(
			{ error: "User not authenticated" },
			{ status: 401 },
		);
	}

	await connectMongo();

	const body = await request.json();

	const workspace = await Workspace.findById(body.id);

	if (!workspace) {
		return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
	}

	const admin =
		workspace.members.find(
			(val) => val.memberId.toString() === session.user.id.toString(),
		)?.role == "admin";
	const owner = workspace.owner.toString() == session.user.id.toString();

	if (!admin && !owner) {
		return NextResponse.json(
			{ error: "You are not authorized to perform this action" },
			{ status: 403 },
		);
	}

	const updatedWorkspace = await Workspace.findByIdAndUpdate(body.id, body, {
		new: true,
		runValidators: true,
	});

	return NextResponse.json(updatedWorkspace);
}
