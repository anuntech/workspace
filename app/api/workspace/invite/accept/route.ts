import connectMongo from "@/libs/mongoose";
import { authOptions } from "@/libs/next-auth";
import { verifyWorkspaceInviteToken } from "@/libs/workspace-invite";
import User from "@/models/User";
import Workspace from "@/models/Workspace";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    await connectMongo();

    const { invite } = await request.json();

    const data = verifyWorkspaceInviteToken(invite) as any;

    if (!data) {
      return NextResponse.json({ error: "Invalid token" }, { status: 400 });
    }

    const worksPace = await Workspace.findById(data.workspaceId);
    if (!worksPace) {
      return NextResponse.json(
        { error: "Workspace not found" },
        { status: 404 }
      );
    }

    const user = await User.findOne({
      email: data.email,
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.id !== session.user.id) {
      return NextResponse.json(
        { error: "You do not have permission to accept this invite" },
        { status: 403 }
      );
    }

    await Workspace.findByIdAndUpdate(data.workspaceId, {
      $push: {
        members: {
          memberId: new mongoose.Types.ObjectId(user.id),
          role: "member",
        },
      },
      $pull: {
        invitedMembersEmail: user.email,
      },
    });

    return NextResponse.json(user);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: e?.message }, { status: 500 });
  }
}
