import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import { createCheckout } from "@/libs/stripe";
import connectMongo from "@/libs/mongoose";
import User from "@/models/User";
import Workspace from "@/models/Workspace";
import Applications from "@/models/Applications";

// This function is used to create a Stripe Checkout Session (one-time payment or subscription)
// It's called by the <ButtonCheckout /> component
// By default, it doesn't force users to be authenticated. But if they are, it will prefill the Checkout data with their email and/or credit card
export async function POST(req: NextRequest) {
  const body = await req.json();

  if (!body.successUrl || !body.cancelUrl) {
    return NextResponse.json(
      { error: "Success and cancel URLs are required" },
      { status: 400 }
    );
  } else if (!body.mode) {
    return NextResponse.json(
      {
        error:
          "Mode is required (either 'payment' for one-time payments or 'subscription' for recurring subscription)",
      },
      { status: 400 }
    );
  } else if (!body.workspaceId) {
    return NextResponse.json(
      {
        error: "Workspace ID is required",
      },
      { status: 400 }
    );
  } else if (!body.applicationId) {
    return NextResponse.json(
      {
        error: "applicationId is required",
      },
      { status: 400 }
    );
  }

  try {
    const session = await getServerSession(authOptions);

    await connectMongo();

    const workspace = await Workspace.findById(body.workspaceId);
    if (!workspace)
      return NextResponse.json(
        { error: "Workspace not found" },
        { status: 404 }
      );

    if (workspace.owner.toString() !== session.user.id) {
      return NextResponse.json(
        { error: "You do not have permission to create a subscription" },
        { status: 403 }
      );
    }

    if (
      workspace.boughtApplications?.find(
        (id) => id.toString() === application.id.toString()
      )
    ) {
      return NextResponse.json(
        { error: "You can't create a subscription for this application" },
        { status: 403 }
      );
    }

    const application = await Applications.findById(body.applicationId);
    if (!application)
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );

    if (application.workspaceAccess != "buyable") {
      return NextResponse.json(
        { error: "You can't create a subscription for this application" },
        { status: 403 }
      );
    }

    if (
      application.workspacesAllowed.length > 0 &&
      application.workspacesAllowed.indexOf(workspace.id) == -1
    ) {
      return NextResponse.json(
        { error: "You can't create a subscription for this application" },
        { status: 403 }
      );
    }

    const user = await User.findById(session?.user?.id);

    const { mode, successUrl, cancelUrl } = body;

    const stripeSessionURL = await createCheckout({
      priceId: application.priceId,
      mode,
      successUrl,
      cancelUrl,
      // If user is logged in, it will pass the user ID to the Stripe Session so it can be retrieved in the webhook later
      clientReferenceId: user?._id?.toString(),
      // If user is logged in, this will automatically prefill Checkout data like email and/or credit card for faster checkout
      user,
      // If you send coupons from the frontend, you can pass it here
      // couponId: body.couponId,
      workspaceId: workspace.id,
      applicationId: application.id,
      type: "app",
    });

    return NextResponse.json({ url: stripeSessionURL });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: e?.message }, { status: 500 });
  }
}
