import connectMongo from "@/libs/mongoose";
import { authOptions } from "@/libs/next-auth";
import Applications from "@/models/Applications";
import MyApplications from "@/models/MyApplications";
import Plans from "@/models/Plans";
import User from "@/models/User";
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
    const application = await Applications.findById(body.applicationId);

    if (!application) {
      return NextResponse.json(
        { error: "Application do not exists" },
        { status: 400 }
      );
    }

    if (
      (application.workspaceAccess == "buyable" ||
        application.workspaceAccess == "rentable") &&
      !workspace.boughtApplications?.find(
        (id) => id.toString() === application.id.toString()
      )
    ) {
      return NextResponse.json(
        { error: "You can't allow this application" },
        { status: 403 }
      );
    }

    if (
      application.workspaceAccess == "premium" &&
      workspace.plan != "premium" &&
      !workspace.boughtApplications?.find(
        (a) => a.toString() === application.id.toString()
      )
    ) {
      return NextResponse.json(
        { error: "The workspace is not premium" },
        { status: 403 }
      );
    }

    if (myApplications) {
      const plan = await Plans.findOne({ name: workspace.plan || "free" });
      if (myApplications.allowedApplicationsId.length >= plan.appsLimit) {
        return NextResponse.json(
          { error: "Atingiu o limite máximo de aplicativos" },
          { status: 403 }
        );
      }
      const alreadyInstalled = myApplications.allowedApplicationsId.find(
        (appId) => appId.toString() === application._id.toString()
      );
      if (!alreadyInstalled) {
        myApplications.allowedApplicationsId.push(application._id);
      }

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

export async function DELETE(
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
        { error: "You do not have permission to uninstall this application" },
        { status: 403 }
      );
    }

    const myApplications = await MyApplications.findOne({
      workspaceId: params.workspaceId,
    });
    const body = await request.json();

    if (!myApplications) return NextResponse.json(myApplications);

    const indexInAllowed = myApplications.allowedApplicationsId.findIndex(
      (id) => id.toString() === body.applicationId
    );
    if (indexInAllowed !== -1) {
      myApplications.allowedApplicationsId.splice(indexInAllowed, 1);
    }

    myApplications.favoriteApplications =
      myApplications.favoriteApplications.filter(
        (fav) => fav.applicationId.toString() != body.applicationId
      );

    await myApplications.save();
    return NextResponse.json(myApplications);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: e?.message }, { status: 500 });
  }
}

export async function GET(
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

    const myApplications = await MyApplications.findOne({
      workspaceId: params.workspaceId,
    }).populate("allowedApplicationsId");

    if (!myApplications) {
      return NextResponse.json([]);
    }

    if (
      workspace.owner.toString() !== session.user.id &&
      !workspace.members.some(
        (m) => m.memberId.toString() === session.user.id.toString()
      )
    ) {
      return NextResponse.json(
        {
          error:
            "You do not have permission to get this workspace applications",
        },
        { status: 403 }
      );
    }

    let applications = myApplications.allowedApplicationsId;

    const memberRole = workspace.members.find(
      (member) => member.memberId.toString() === session.user.id.toString()
    )?.role;

    const isNotAdminAndOwner =
      memberRole !== "admin" && workspace.owner.toString() !== session.user.id;

    if (isNotAdminAndOwner) {
      const applicationsIdsThatUserHasPermission =
        workspace.rules.allowedMemberApps
          .filter(
            (app) =>
              !!app.members.find(
                (m) => m.memberId.toString() == session.user.id
              )
          )
          .map((app) => app.appId.toString());

      applications = myApplications.allowedApplicationsId.filter((app) =>
        applicationsIdsThatUserHasPermission.includes(
          (app as any)._id.toString()
        )
      );
    }

    return NextResponse.json(applications);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: e?.message }, { status: 500 });
  }
}
