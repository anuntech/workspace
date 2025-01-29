import connectMongo from "@/libs/mongoose";
import { authOptions } from "@/libs/next-auth";
import Notifications from "@/models/Notification";
import User from "@/models/User";
import Workspace from "@/models/Workspace";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { routeWrapper } from "@/libs/routeWrapper";

export const POST = routeWrapper(POSTHandler, "/api/workspace/invite/refuse");

async function POSTHandler(request: Request) {
	const session = await getServerSession(authOptions);

	await connectMongo();

	const data = await request.json();

	const worksPace = await Workspace.findById(data.workspaceId);
	if (!worksPace) {
		return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
	}

	const notification = await Notifications.findById(data.notificationId);
	if (!notification) {
		return NextResponse.json(
			{ error: "Notification not found" },
			{ status: 404 },
		);
	}

	const user = await User.findById(session.user.id);
	if (!user) {
		return NextResponse.json({ error: "User not found" }, { status: 404 });
	}

	if (!worksPace.invitedMembersEmail.map((a) => a.email).includes(user.email)) {
		return NextResponse.json(
			{ error: "You are not invited to this workspace" },
			{ status: 403 },
		);
	}

	await Workspace.findByIdAndUpdate(data.workspaceId, {
		$pull: {
			invitedMembersEmail: { email: user.email },
		},
	});

	notification.state = "refused";

	notification.save();

	return NextResponse.json(user);
}
