import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import { NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import Notifications from "@/models/Notification";
import { routeWrapper } from "@/libs/routeWrapper";

export const GET = routeWrapper(
	GETHandler,
	"/api/user/notifications/is-there-new",
);

async function GETHandler(request: Request) {
	const session = await getServerSession(authOptions);
	await connectMongo();

	const notifications = await Notifications.find({
		userId: session.user.id,
	});

	const isThereNewNotification = notifications.find((v) => v.isNew);

	return NextResponse.json(!!isThereNewNotification);
}
