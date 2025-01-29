import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import { NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import Notifications from "@/models/Notification";
import { routeWrapper } from "@/libs/routeWrapper";

export const POST = routeWrapper(
	POSTHandler,
	"/api/user/notifications/mark-as-read",
);

async function POSTHandler(request: Request) {
	const session = await getServerSession(authOptions);
	await connectMongo();

	const result = await Notifications.updateMany(
		{
			userId: session.user.id,
		},
		{
			isNew: false,
		},
	);

	return NextResponse.json({ updatedCount: result.matchedCount });
}
