import connectMongo from "@/libs/mongoose";
import { authOptions } from "@/libs/next-auth";
import { sendInviteWorkspaceEmail } from "@/libs/workspace-invite";
import User from "@/models/User";
import Workspace from "@/models/Workspace";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    await connectMongo();

    const { email, workspaceId } = await request.json();

    const worksPace = await Workspace.findById(workspaceId);

    if (!worksPace) {
      return NextResponse.json(
        { error: "Workspace not found" },
        { status: 404 }
      );
    }

    if (worksPace.owner.toString() !== session.user.id) {
      return NextResponse.json(
        { error: "You do not have permission to invite users" },
        { status: 403 }
      );
    }

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const alreadyIn = worksPace.members.find(
      (member) => member.memberId.toString() === user.id
    );

    const alreadyInvited = worksPace.invitedMembersId.find(
      (invitedId) => invitedId === user.id
    );

    if (alreadyIn || alreadyInvited) {
      return NextResponse.json(
        {
          error: "This user is already in or already invited in this workspace",
        },
        { status: 403 }
      );
    }

    await Workspace.findByIdAndUpdate(workspaceId, {
      $push: {
        invitedMembersId: user.id,
      },
    });

    await sendInviteWorkspaceEmail(email, workspaceId);

    return NextResponse.json(user);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: e?.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    await connectMongo();

    const { id, userId } = await request.json();

    const worksPace = await Workspace.findById(id);

    if (!worksPace) {
      return NextResponse.json(
        { error: "Workspace not found" },
        { status: 404 }
      );
    }

    if (worksPace.owner.toString() !== session.user.id) {
      return NextResponse.json(
        { error: "You do not have permission to remove this invite" },
        { status: 403 }
      );
    }

    if (!(await User.findById(userId))) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await Workspace.findByIdAndUpdate(id, {
      $pull: {
        invitedMembersId: userId,
      },
    });

    return NextResponse.json(worksPace);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: e?.message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    await connectMongo();

    const { id } = await request.json();

    const worksPace = await Workspace.findById(id);

    if (!worksPace) {
      return NextResponse.json(
        { error: "Workspace not found" },
        { status: 404 }
      );
    }

    if (worksPace.owner.toString() !== session.user.id) {
      return NextResponse.json(
        { error: "You do not have permission to get this workspace invites" },
        { status: 403 }
      );
    }

    const invitedUsers = await User.find({
      _id: { $in: worksPace.invitedMembersId },
    }).select("name email image");

    return NextResponse.json(invitedUsers);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: e?.message }, { status: 500 });
  }
}
