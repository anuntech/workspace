import config from "@/config";
import connectMongo from "@/libs/mongoose";
import { authOptions } from "@/libs/next-auth";
import Applications from "@/models/Applications";
import MyApplications from "@/models/MyApplications";
import Workspace from "@/models/Workspace";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { workspaceId: string } }
) {
  try {
    await getServerSession(authOptions);

    await connectMongo();

    const workspace = await Workspace.findById(params.workspaceId);

    if (!workspace) {
      return NextResponse.json(
        { error: "Workspace not found" },
        { status: 404 }
      );
    }

    const applications = await Applications.find();

    const applicationsEnabledOrDisabled = await Promise.all(
      applications.map(async (app) => {
        const allowedApplicationsId = (
          await MyApplications.findOne({
            workspaceId: new mongoose.Types.ObjectId(params.workspaceId),
          })
        )?.allowedApplicationsId;

        const isEnabled = allowedApplicationsId?.includes(
          new mongoose.Types.ObjectId(app._id.toString()) as any
        );

        return {
          ...app.toObject(),
          status: isEnabled ? "enabled" : "disabled",
        };
      })
    );

    const removeApplicationsWithoutPermission =
      applicationsEnabledOrDisabled.filter((app) =>
        app.workspacesAllowed.length > 0
          ? app.workspacesAllowed.find((id) => id.toString() === workspace.id)
          : true
      );

    return NextResponse.json(removeApplicationsWithoutPermission);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: e?.message }, { status: 500 });
  }
}
