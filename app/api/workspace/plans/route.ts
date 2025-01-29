import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import { NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import Workspace from "@/models/Workspace";
import Plans from "@/models/Plans";
import { routeWrapper } from "@/libs/routeWrapper";

export const GET = routeWrapper(GETHandler, "/api/workspace/plans");

async function GETHandler(request: Request) {
	const session = await getServerSession(authOptions);

	await connectMongo();

	const plans = await Plans.find();

	return NextResponse.json(plans);
}
