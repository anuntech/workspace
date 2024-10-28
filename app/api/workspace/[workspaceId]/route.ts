import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import { NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import Workspace from "@/models/Workspace";
import MyApplications from "@/models/MyApplications";

export async function DELETE(
  request: Request,
  { params }: { params: { workspaceId: string; memberId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    const { workspaceId } = params;

    await connectMongo();

    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      return NextResponse.json(
        { error: "Workspace not found" },
        { status: 404 }
      );
    }

    if (workspace.owner.toString() !== session.user.id) {
      return NextResponse.json(
        { error: "You do not have permission to remove this workspace" },
        { status: 403 }
      );
    }

    const deleted = await Workspace.deleteOne({ _id: workspaceId });
    await MyApplications.deleteMany({ workspaceId: workspaceId });

    return NextResponse.json(deleted, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: e?.message }, { status: 500 });
  }
}
