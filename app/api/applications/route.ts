import connectMongo from "@/libs/mongoose";
import { authOptions } from "@/libs/next-auth";
import Applications from "@/models/Applications";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    await connectMongo();

    const applications = await Applications.find();

    return NextResponse.json(applications);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: e?.message }, { status: 500 });
  }
}
