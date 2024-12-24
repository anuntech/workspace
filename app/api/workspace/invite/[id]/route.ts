import connectMongo from "@/libs/mongoose";
import { authOptions } from "@/libs/next-auth";
import User from "@/models/User";
import Workspace from "@/models/Workspace";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    await connectMongo();

    const { id } = params;

    const worksPace = await Workspace.findById(id);

    if (!worksPace) {
      return NextResponse.json(
        { error: "Workspace not found" },
        { status: 404 }
      );
    }

    const memberRole = worksPace.members.find(
      (member) => member.memberId.toString() === session.user.id.toString()
    )?.role;

    if (
      worksPace.owner.toString() !== session.user.id &&
      memberRole !== "admin"
    ) {
      return NextResponse.json(
        { error: "You do not have permission to get this workspace invites" },
        { status: 403 }
      );
    }

    const invitedUsers = await User.find({
      email: { $in: worksPace.invitedMembersEmail.map((a) => a.email) },
    }).select("name email image icon");

    const usersWithoutAccounst = worksPace.invitedMembersEmail
      .map((c) => c.email)
      .filter((email) => !invitedUsers.find((user) => user.email == email));
    invitedUsers.push(
      ...usersWithoutAccounst.map((email) => ({
        email,
        name: email.split("@")[0],
        image: undefined,
      }))
    );

    return NextResponse.json(invitedUsers);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: e?.message }, { status: 500 });
  }
}
