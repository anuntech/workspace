import connectMongo from "@/libs/mongoose";
import { authOptions } from "@/libs/next-auth";
import Applications from "@/models/Applications";
import User from "@/models/User";
import Workspace from "@/models/Workspace";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { routeWrapper } from "@/libs/routeWrapper";

export const GET = routeWrapper(
	GETHandler,
	"/api/workspace/rules/members/[workspaceId]",
);

async function GETHandler(
	request: NextRequest,
	{
		params,
	}: {
		params: { workspaceId: string };
	},
) {
	const session = await getServerSession(authOptions);

	await connectMongo();

	const { workspaceId } = params;
	const appId = request.nextUrl.searchParams.get("appId");
	const app = await Applications.findById(appId);
	if (!app) {
		return NextResponse.json({ error: "App not found" }, { status: 404 });
	}

	const workspace = await Workspace.findOne({ _id: workspaceId });
	if (!workspace) {
		return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
	}

	const res = await Promise.all(
		workspace.rules.allowedMemberApps.map(async (app) => ({
			members: await Promise.all(
				app.members.map(async (member) => {
					const m = await User.findOne({ _id: member.memberId });
					return m;
				}),
			),
			appId: app.appId,
		})),
	);

	const filtered = res.filter((app) => app.appId.toString() === appId);

	return NextResponse.json(filtered);
}
