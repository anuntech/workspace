import connectMongo from "@/libs/mongoose";
import { authOptions } from "@/libs/next-auth";
import { sendInviteNotification } from "@/libs/notification";
import { sendInviteWorkspaceEmail } from "@/libs/workspace-invite";
import Notifications from "@/models/Notification";
import Plans from "@/models/Plans";
import User from "@/models/User";
import Workspace from "@/models/Workspace";
import {
  addMinutes,
  addSeconds,
  differenceInMinutes,
  differenceInSeconds,
} from "date-fns";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    await connectMongo();

    const { email, workspaceId } = await request.json();

    const worksPace = await Workspace.findById(workspaceId);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          error: "Email inválido",
        },
        { status: 404 }
      );
    }

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

    const alreadyInvited = worksPace.invitedMembersEmail
      .map((a) => a.email)
      ?.find((invitedId) => invitedId === email);

    if (!alreadyIn && !alreadyInvited) {
      return NextResponse.json({ error: "User was not invited" });
    }

    const invitedAt = worksPace.invitedMembersEmail.find(
      (e) => e.email === email
    ).invitedAt;

    const now = new Date();

    const updatedAt = new Date(invitedAt);
    const diffInMinutes = differenceInMinutes(now, updatedAt);

    if (diffInMinutes < 2) {
      const timeToResend = addSeconds(updatedAt, 120);
      const minutesLeft = differenceInSeconds(timeToResend, now);

      return NextResponse.json(
        {
          error: `Você precisa esperar ${minutesLeft} segundo(s) para enviar outro convite.`,
        },
        { status: 429 }
      );
    }

    worksPace.invitedMembersEmail.find((e) => e.email === email).invitedAt =
      new Date();

    worksPace.save();

    await Notifications.updateMany(
      {
        from: session.user.id,
        userId: user.id,
        workspaceId: worksPace.id,
        isInvite: true,
      },
      {
        state: "expired",
      }
    );

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
