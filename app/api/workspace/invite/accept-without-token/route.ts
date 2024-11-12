import connectMongo from "@/libs/mongoose";
import { authOptions } from "@/libs/next-auth";
import { verifyWorkspaceInviteToken } from "@/libs/workspace-invite";
import Notifications from "@/models/Notification";
import Plans from "@/models/Plans";
import User from "@/models/User";
import Workspace from "@/models/Workspace";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    await connectMongo();

    const data = await request.json();

    const worksPace = await Workspace.findById(data.workspaceId);
    if (!worksPace) {
      return NextResponse.json(
        { error: "Workspace not found" },
        { status: 404 }
      );
    }

    const notification = await Notifications.findById(data.notificationId);
    if (!notification) {
      return NextResponse.json(
        { error: "Notification not found" },
        { status: 404 }
      );
    }

    const plan = await Plans.findOne({ name: worksPace.plan || "free" });

    if (worksPace.members.length >= plan.membersLimit) {
      return NextResponse.json(
        { error: "This workspace is full" },
        { status: 403 }
      );
    }

    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (
      !worksPace.invitedMembersEmail.map((a) => a.email).includes(user.email)
    ) {
      return NextResponse.json(
        { error: "You are not invited to this workspace" },
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
        invitedMembersEmail: { email: user.email },
      },
    });

    notification.state = "accepted";

    notification.save();

    return NextResponse.json(user);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: e?.message }, { status: 500 });
  }
}
