import connectMongo from "@/libs/mongoose";
import { authOptions } from "@/libs/next-auth";
import User from "@/models/User";
import Workspace from "@/models/Workspace";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { workspaceId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    await connectMongo();

    const { workspaceId } = params;

    const workspace = await Workspace.findOne({ _id: workspaceId });
    if (!workspace) {
      return NextResponse.json(
        { error: "Workspace not found" },
        { status: 404 }
      );
    }

    const res = await Promise.all(
      workspace.rules.allowedMemberApps.map(async (app) => ({
        members: await Promise.all(
          app.members.map(async (member) => {
            const m = await User.findOne({ _id: member.memberId });
            return m;
          })
        ),
        appId: app.appId,
      }))
    );

    return NextResponse.json(res);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: e?.message }, { status: 500 });
  }
}
