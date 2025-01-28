import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import { NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import Workspace from "@/models/Workspace";
import Plans from "@/models/Plans";

export async function GET(request: Request) {
	try {
		await getServerSession(authOptions);

		await connectMongo();

		const plans = await Plans.find();

		return NextResponse.json(plans);
	} catch (e) {
		console.error(e);
		return NextResponse.json({ error: e?.message }, { status: 500 });
	}
}
