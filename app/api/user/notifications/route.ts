import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import { NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import Notifications from "@/models/Notification";
import User from "@/models/User";
import Workspace from "@/models/Workspace";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { routeWrapper } from "@/libs/routeWrapper";

export const GET = routeWrapper(GETHandler, "/api/user/notifications");

async function GETHandler(request: Request) {
	const url = new URL(request.url);
	const page = parseInt(url.searchParams.get("page") || "1", 10);
	const limit = parseInt(url.searchParams.get("limit") || "8", 10);
	const skip = (page - 1) * limit;

	const session = await getServerSession(authOptions);
	await connectMongo();

	const totalCount = await Notifications.countDocuments({
		userId: session.user.id,
	});

	const notifications = await Notifications.find({
		userId: session.user.id,
	})
		.sort({ createdAt: -1 })
		.skip(skip)
		.limit(limit);

	const notificationsMap = await Promise.all(
		notifications.map(async (v) => {
			const fromUser = await User.findOne({ _id: v.from });
			const workspace = await Workspace.findOne({ _id: v.workspaceId });

			let notification = v;

			if (!workspace?.name && notification.state !== "expired") {
				notification = await Notifications.findOneAndUpdate(
					{
						_id: v._id,
					},
					{
						$set: {
							state: "expired",
						},
					},
					{
						isNew: true,
					},
				);
			}

			return {
				id: notification._id,
				user: fromUser?.name || "Unknown User",
				avatar: fromUser?.image,
				icon: fromUser?.icon,
				message: `convidou você para o workspace ${
					workspace?.name || "Invalid Workspace"
				}`,
				workspaceId: notification.workspaceId,
				state: notification.state,
				isNew: notification.isNew,
				isInvite: notification.isInvite,
				time: formatDistanceToNow(new Date((notification as any).updatedAt), {
					addSuffix: true,
					locale: ptBR,
				}),
			};
		}),
	);

	return NextResponse.json({
		notifications: notificationsMap,
		pagination: {
			totalCount,
			currentPage: page,
			totalPages: Math.ceil(totalCount / limit),
			hasNextPage: page * limit < totalCount,
			hasPreviousPage: page > 1,
		},
	});
}
