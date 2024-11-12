import connectMongo from "@/libs/mongoose";
import { authOptions } from "@/libs/next-auth";
import { sendInviteNotification } from "@/libs/notification";
import { sendInviteWorkspaceEmail } from "@/libs/workspace-invite";
import Notifications from "@/models/Notification";
import Plans from "@/models/Plans";
import User from "@/models/User";
import Workspace from "@/models/Workspace";
import { addMinutes, differenceInMinutes } from "date-fns";
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
        { error: "Você não possui permissão para convidar usuários" },
        { status: 403 }
      );
    }

    const plan = await Plans.findOne({ name: worksPace.plan || "free" });

    if (worksPace.members.length >= plan.membersLimit) {
      return NextResponse.json(
        { error: "This workspace is full" },
        { status: 403 }
      );
    }

    if (worksPace.invitedMembersEmail.length >= 30) {
      return NextResponse.json(
        { error: "O limite de convites foi atingido" },
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

    if (!alreadyIn && !alreadyInvited) {
      return NextResponse.json({ error: "User was not invited" });
    }

    const notification = await Notifications.findOne({
      userId: session.user.id,
      from: user?.id,
      workspaceId: worksPace.id,
    });

    const now = new Date();
    const updatedAt = new Date(notification.updatedAt);
    const diffInMinutes = differenceInMinutes(now, updatedAt);

    if (diffInMinutes < 2) {
      const timeToResend = addMinutes(updatedAt, 2);
      const minutesLeft = differenceInMinutes(timeToResend, now);

      return NextResponse.json(
        {
          error: `Você precisa esperar ${minutesLeft} minuto(s) para enviar outro convite.`,
        },
        { status: 429 }
      );
    }

    await sendInviteWorkspaceEmail(email, worksPace.id, worksPace.name);
    if (user) {
      await sendInviteNotification(user.id, session.user.id, worksPace.id);
    }

    return NextResponse.json(user);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: e?.message }, { status: 500 });
  }
}
