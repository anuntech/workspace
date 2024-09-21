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

    const user = await User.findOne({ email });

    const alreadyIn = worksPace.members?.find(
      (member) => member.memberId.toString() === user?.id
    );

    const alreadyInvited = worksPace.invitedMembersEmail?.find(
      (invitedId) => invitedId === email
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
        invitedMembersEmail: email,
      },
    });

    await sendInviteWorkspaceEmail(email, workspaceId, worksPace.name);

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

    const { workspaceId, email } = await request.json();

    const worksPace = await Workspace.findById(workspaceId);

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

    await Workspace.findByIdAndUpdate(workspaceId, {
      $pull: {
        invitedMembersEmail: email,
      },
    });

    return NextResponse.json(worksPace);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: e?.message }, { status: 500 });
  }
}
