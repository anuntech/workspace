import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import { createCheckout } from "@/libs/stripe";
import connectMongo from "@/libs/mongoose";
import User from "@/models/User";
import Workspace from "@/models/Workspace";
import Applications from "@/models/Applications";
import MyApplications from "@/models/MyApplications";
import mongoose, { MongooseError } from "mongoose";

// This function is used to create a Stripe Checkout Session (one-time payment or subscription)
// It's called by the <ButtonCheckout /> component
// By default, it doesn't force users to be authenticated. But if they are, it will prefill the Checkout data with their email and/or credit card
export async function POST(req: NextRequest) {
  const body = await req.json();
  const session = await getServerSession(authOptions);

  const application = await Applications.findById(body.applicationId);
  if (!application) {
    return NextResponse.json(
      { error: "Application not found" },
      { status: 404 }
    );
  }

  const workspace = await Workspace.findById(body.workspaceId);
  if (!workspace) {
    return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
  }

  if (
    workspace.owner.toString() != session.user.id &&
    !workspace.members.find(
      (m) => m.memberId.toString() === session.user.id.toString()
    )
  ) {
    return NextResponse.json(
      { error: "You do not have permission to favorite this application" },
      { status: 403 }
    );
  }

  try {
    await connectMongo();
    const myApplications = await MyApplications.findOne({
      workspaceId: new mongoose.Types.ObjectId(body.workspaceId),
    });

    const favoriteIndex = myApplications.favoriteApplications.findIndex(
      (a) =>
        a.applicationId.toString() === application.id.toString() &&
        a.userId.toString() === session.user.id
    );

    if (favoriteIndex == -1) {
      myApplications?.favoriteApplications.push({
        userId: new mongoose.Types.ObjectId(session.user.id),
        applicationId: application.id,
      });
      await myApplications.save();

      return NextResponse.json(myApplications);
    }

    myApplications.favoriteApplications.splice(favoriteIndex, 1);
    await myApplications.save();

    return NextResponse.json(myApplications);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: e?.message }, { status: 500 });
  }
}
