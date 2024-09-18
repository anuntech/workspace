import connectMongo from "@/libs/mongoose";
import { authOptions } from "@/libs/next-auth";
import { verifyWorkspaceInviteToken } from "@/libs/workspace-invite";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { invite: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    await connectMongo();

    const { invite } = params;

    const data = verifyWorkspaceInviteToken(invite);

    if (!data) {
      return NextResponse.json({ error: "Invalid token" }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: e?.message }, { status: 500 });
  }
}
