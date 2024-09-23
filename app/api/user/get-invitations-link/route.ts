import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import { NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import User from "@/models/User";
import { generateInviteWorkspaceToken } from "@/libs/workspace-invite";
import Workspace from "@/models/Workspace";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    await connectMongo();

    const workspace = await Workspace.find({
      invitedMembersEmail: {
        $in: [session.user.email],
      },
    });

    if (!workspace.length) {
      return NextResponse.json(
        {
          error: "You are not invited to any workspace",
        },
        { status: 403 }
      );
    }

    const user = await User.findById(session?.user?.id);

    const token = generateInviteWorkspaceToken(
      user.email,
      workspace[workspace.length - 1].id.toString()
    );

    return NextResponse.json({ token });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: e?.message }, { status: 500 });
  }
}