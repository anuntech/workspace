import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import { createCustomerPortal } from "@/libs/stripe";
import User from "@/models/User";
import { routeWrapper } from "@/libs/routeWrapper";

export const POST = routeWrapper(POSTHandler, "/api/stripe/create-portal");

async function POSTHandler(req: NextRequest) {
	const session = await getServerSession(authOptions);

	if (session) {
		await connectMongo();

		const body = await req.json();

		const { id } = session.user;

		const user = await User.findById(id);

		if (!user?.customerId) {
			return NextResponse.json(
				{
					error:
						"Você não tem uma conta de pagamento associada. Faça a compra de uma assinatura para acessar este recurso.",
				},
				{ status: 400 },
			);
		} else if (!body.returnUrl) {
			return NextResponse.json(
				{ error: "Return URL is required" },
				{ status: 400 },
			);
		}

		const stripePortalUrl = await createCustomerPortal({
			customerId: user.customerId,
			returnUrl: body.returnUrl,
		});

		return NextResponse.json({
			url: stripePortalUrl,
		});
	} else {
		// Not Signed in
		return NextResponse.json({ error: "Not signed in" }, { status: 401 });
	}
}
