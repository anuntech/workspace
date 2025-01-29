import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import { NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import User from "@/models/User";
import clientPromise from "@/libs/mongo";
import mongoose from "mongoose";
import { routeWrapper } from "@/libs/routeWrapper";

export const GET = routeWrapper(GETHandler, "/api/user");

async function GETHandler(request: Request) {
	const session = await getServerSession(authOptions);

	await connectMongo();

	const user = await User.findById(session?.user?.id).lean();

	const accountsCollection = mongoose.connection.collection("accounts");
	const account = await accountsCollection.findOne({
		userId: new mongoose.Types.ObjectId(session?.user?.id),
	});

	if (account?.provider == "google") {
		return NextResponse.json({ ...user, isGoogle: true });
	}

	return NextResponse.json(user);
}

export const PATCH = routeWrapper(PATCHHandler, "/api/user");

async function PATCHHandler(request: Request) {
	const session = await getServerSession(authOptions);

	await connectMongo();

	const body = await request.json();

	const accountsCollection = mongoose.connection.collection("accounts");
	// const account = await accountsCollection.findOne({
	//   userId: new mongoose.Types.ObjectId(session?.user?.id),
	// });

	const user = await User.findById(session.user.id);

	if (body.email && body.email != user.email) {
		return NextResponse.json(
			{ error: "Email can't be changed" },
			{ status: 400 },
		);
	}

	if (body.icon && body.icon != "") {
		return NextResponse.json(
			{ error: "Icon can't be changed" },
			{ status: 400 },
		);
	}

	const updatedUser = await User.findByIdAndUpdate(session.user.id, body, {
		new: true,
		runValidators: true,
	});

	if (!updatedUser) {
		return NextResponse.json(
			{ error: "Usuário não encontrado" },
			{ status: 404 },
		);
	}

	return NextResponse.json(updatedUser);
}

// import { NextResponse, NextRequest } from "next/server";
// import { getServerSession } from "next-auth/next";
// import { authOptions } from "@/libs/next-auth";
// import { createCheckout } from "@/libs/stripe";
// import connectMongo from "@/libs/mongoose";
// import User from "@/models/User";

// // This function is used to create a Stripe Checkout Session (one-time payment or subscription)
// // It's called by the <ButtonCheckout /> component
// // By default, it doesn't force users to be authenticated. But if they are, it will prefill the Checkout data with their email and/or credit card
// export async function POST(req: NextRequest) {
//   const body = await req.json();

//   if (!body.priceId) {
//     return NextResponse.json(
//       { error: "Price ID is required" },
//       { status: 400 }
//     );
//   } else if (!body.successUrl || !body.cancelUrl) {
//     return NextResponse.json(
//       { error: "Success and cancel URLs are required" },
//       { status: 400 }
//     );
//   } else if (!body.mode) {
//     return NextResponse.json(
//       {
//         error:
//           "Mode is required (either 'payment' for one-time payments or 'subscription' for recurring subscription)",
//       },
//       { status: 400 }
//     );
//   }

//   try {
//     const session = await getServerSession(authOptions);

//     await connectMongo();

//     const user = await User.findById(session?.user?.id);

//     const { priceId, mode, successUrl, cancelUrl } = body;

//     const stripeSessionURL = await createCheckout({
//       priceId,
//       mode,
//       successUrl,
//       cancelUrl,
//       // If user is logged in, it will pass the user ID to the Stripe Session so it can be retrieved in the webhook later
//       clientReferenceId: user?._id?.toString(),
//       // If user is logged in, this will automatically prefill Checkout data like email and/or credit card for faster checkout
//       user,
//       // If you send coupons from the frontend, you can pass it here
//       // couponId: body.couponId,
//     });

//     return NextResponse.json({ url: stripeSessionURL });
//   } catch (e) {
//     console.error(e);
//     return NextResponse.json({ error: e?.message }, { status: 500 });
//   }
// }
