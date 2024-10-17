import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import { NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import Workspace from "@/models/Workspace";

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    await connectMongo();

    const body = await request.formData();

    const workspace = await Workspace.findById(body.get("workspaceId"));

    if (!workspace) {
      return NextResponse.json(
        { error: "Workspace not found" },
        { status: 404 }
      );
    }

    const admin =
      workspace.members.find(
        (val) => val.memberId.toString() === session.user.id.toString()
      )?.role == "admin";
    const owner = workspace.owner.toString() == session.user.id.toString();

    if (!admin && !owner) {
      return NextResponse.json(
        { error: "You are not authorized to perform this action" },
        { status: 403 }
      );
    }

    const iconType = body.get("iconType");

    if (iconType == "image") {
      workspace.icon.type = "image";
      workspace.icon.value = body.get("icon") as string;
    } else if (iconType == "emoji") {
      workspace.icon.type = "emoji";
      workspace.icon.value = body.get("icon") as string;
    }

    await workspace.save();

    return NextResponse.json(workspace);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: e?.message }, { status: 500 });
  }
}
