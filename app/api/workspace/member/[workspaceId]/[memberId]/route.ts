import connectMongo from "@/libs/mongoose";
import { authOptions } from "@/libs/next-auth";
import User from "@/models/User";
import Workspace from "@/models/Workspace";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: { workspaceId: string; memberId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    await connectMongo();

    const { workspaceId, memberId } = params;

    const worksPace = await Workspace.findById(
      new mongoose.Types.ObjectId(workspaceId)
    );

    if (!worksPace) {
      return NextResponse.json(
        { error: "Workspace not found" },
        { status: 404 }
      );
    }

    if (worksPace.owner.toString() !== session.user.id) {
      return NextResponse.json(
        { error: "You do not have permission to remove this member" },
        { status: 403 }
      );
    }

    const newWorkspace = await Workspace.findByIdAndUpdate(workspaceId, {
      $pull: {
        members: {
          memberId: new mongoose.Types.ObjectId(memberId),
        },
      },
    });

    return NextResponse.json(newWorkspace, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: e?.message }, { status: 500 });
  }
}
