import connectMongo from "@/libs/mongoose";
import { authOptions } from "@/libs/next-auth";
import Applications from "@/models/Applications";
import MyApplications from "@/models/MyApplications";
import Workspace from "@/models/Workspace";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { workspaceId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    await connectMongo();

    const workspace = await Workspace.findById(params.workspaceId);

    if (!workspace) {
      return NextResponse.json(
        { error: "Workspace not found" },
        { status: 404 }
      );
    }

    const memberRole = workspace.members.find(
      (member) => member.memberId.toString() === session.user.id.toString()
    )?.role;

    if (
      memberRole !== "admin" &&
      workspace.owner.toString() !== session.user.id
    ) {
      return NextResponse.json(
        { error: "You do not have permission to get this workspace invites" },
        { status: 403 }
      );
    }

    const myApplications = await MyApplications.findOne({
      workspaceId: params.workspaceId,
    });
    const body = await request.json();

    console.log(body);

    if (myApplications) {
      myApplications.allowedApplicationsId.push(
        new mongoose.Types.ObjectId(body.applicationId) as any
      );
      await myApplications.save();

      return NextResponse.json(myApplications);
    }

    await MyApplications.create({
      workspaceId: params.workspaceId,
      allowedApplicationsId: [new mongoose.Types.ObjectId(body.applicationId)],
    });

    return NextResponse.json(myApplications);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: e?.message }, { status: 500 });
  }
}
