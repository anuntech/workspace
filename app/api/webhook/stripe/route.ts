import { NextResponse, NextRequest } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import connectMongo from "@/libs/mongoose";
import configFile from "@/config";
import User from "@/models/User";
import { findCheckoutSession } from "@/libs/stripe";
import Workspace from "@/models/Workspace";
import mongoose from "mongoose";
import MyApplications from "@/models/MyApplications";
import Applications from "@/models/Applications";
import plans from "@/models/Plans";
import { routeWrapper } from "@/libs/routeWrapper";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
	apiVersion: "2023-08-16",
	typescript: true,
});
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

// This is where we receive Stripe webhook events
// It used to update the user data, send emails, etc...
// By default, it'll store the user in the database
// See more: https://shipfa.st/docs/features/payments
export const POST = routeWrapper(POSTHandler, "/api/webhook/stripe");

async function POSTHandler(req: NextRequest) {
	await connectMongo();

	const body = await req.text();

	const signature = headers().get("stripe-signature");

	let eventType;
	let event;

	// verify Stripe event is legit
	try {
		event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
	} catch (err) {
		console.error(`Webhook signature verification failed. ${err.message}`);
		return NextResponse.json({ error: err.message }, { status: 400 });
	}

	eventType = event.type;

	switch (eventType) {
		case "checkout.session.completed": {
			// First payment is successful and a subscription is created (if mode was set to "subscription" in ButtonCheckout)
			// ✅ Grant access to the product
			const stripeObject: Stripe.Checkout.Session = event.data
				.object as Stripe.Checkout.Session;

			if (stripeObject.payment_status !== "paid") {
				console.log("Payment not completed yet.");
				break;
			}

			const session = await findCheckoutSession(stripeObject.id);

			const customerId = session?.customer;
			const priceId = session?.line_items?.data[0]?.price.id;
			const userId = stripeObject.client_reference_id;
			const plan = configFile.stripe.plans.find((p) => p.priceId === priceId);
			const workspaceId = stripeObject.metadata?.workspaceId;

			if (!plan) break;

			const customer = (await stripe.customers.retrieve(
				customerId as string,
			)) as Stripe.Customer;

			let user;

			// Get or create the user. userId is normally pass in the checkout session (clientReferenceID) to identify the user when we get the webhook event
			if (userId) {
				user = await User.findById(userId);
			} else if (customer.email) {
				user = await User.findOne({ email: customer.email });
				if (!user) {
					user = await User.create({
						email: customer.email,
						name: customer.name,
					});

					await user.save();
				}
			} else {
				console.error("No user found");
				throw new Error("No user found");
			}

			// Update user data + Grant user access to your product. It's a boolean in the database, but could be a number of credits, etc...
			user.priceId = priceId;
			user.customerId = customerId;

			// user.hasAccess = true;
			await user.save();

			const type = stripeObject.metadata?.type;
			const applicationId = stripeObject.metadata?.applicationId;
			const workspace = await Workspace.findById(workspaceId);
			if (type == "premium") {
				workspace.plan = "premium";
			} else if (type == "app" || type == "app-rentable") {
				workspace.boughtApplications.push(
					new mongoose.Types.ObjectId(applicationId),
				);
			}
			await workspace.save();

			const subscriptionId = stripeObject.subscription; // ID da assinatura criada

			if (subscriptionId) {
				await stripe.subscriptions.update(subscriptionId as string, {
					metadata: {
						workspaceId: stripeObject.metadata.workspaceId,
						applicationId: stripeObject.metadata.applicationId,
						type: stripeObject.metadata.type,
					},
				});
			}

			// Extra: send email with user link, product page, etc...
			// try {
			//   await sendEmail(...);
			// } catch (e) {
			//   console.error("Email issue:" + e?.message);
			// }

			break;
		}

		case "checkout.session.expired": {
			// User didn't complete the transaction
			// You don't need to do anything here, by you can send an email to the user to remind him to complete the transaction, for instance
			break;
		}

		case "customer.subscription.updated": {
			// The customer might have changed the plan (higher or lower plan, cancel soon etc...)
			// You don't need to do anything here, because Stripe will let us know when the subscription is canceled for good (at the end of the billing cycle) in the "customer.subscription.deleted" event
			// You can update the user data to show a "Cancel soon" badge for instance
			break;
		}

		case "customer.subscription.deleted": {
			// The customer subscription stopped
			// ❌ Revoke access to the product
			const stripeObject: Stripe.Subscription = event.data
				.object as Stripe.Subscription;

			const subscription = await stripe.subscriptions.retrieve(stripeObject.id);
			const user = await User.findOne({ customerId: subscription.customer });

			// Revoke access to your product
			user.hasAccess = false;
			await user.save();

			const { workspaceId, type, applicationId } = stripeObject.metadata;

			if (type == "premium") {
				const workspace = await Workspace.findById(workspaceId);

				workspace.plan = "free";
				const plan = await plans.findOne({ name: "free" });
				workspace.members.splice(plan.membersLimit - 1);

				await workspace.save();
				const premiumApps = await Applications.find({
					workspaceAccess: "premium",
				});

				const premiumAppIds = premiumApps.map((app) => app._id);

				await MyApplications.updateOne(
					{ workspaceId },
					{ $pull: { allowedApplicationsId: { $in: premiumAppIds } } },
				);
			}

			if (type == "app-rentable" || type == "app") {
				await Workspace.findByIdAndUpdate(workspaceId, {
					$pull: {
						boughtApplications: applicationId,
					},
				});
				await MyApplications.updateOne(
					{ workspaceId },
					{ $pull: { allowedApplicationsId: applicationId } },
				);
			}

			break;
		}

		case "invoice.paid": {
			// Customer just paid an invoice (for instance, a recurring payment for a subscription)
			// ✅ Grant access to the product

			const stripeObject: Stripe.Invoice = event.data.object as Stripe.Invoice;

			const priceId = stripeObject.lines.data[0].price.id;
			const customerId = stripeObject.customer;

			const user = await User.findOne({ customerId });

			// Make sure the invoice is for the same plan (priceId) the user subscribed to
			if (user.priceId !== priceId) break;

			// Grant user access to your product. It's a boolean in the database, but could be a number of credits, etc...
			user.hasAccess = true;
			await user.save();

			const workspaceId = stripeObject.metadata?.workspaceId;
			const type = stripeObject.metadata?.type;
			const applicationId = stripeObject.metadata?.applicationId;

			const workspace = await Workspace.findById(workspaceId);
			if (type == "premium") {
				workspace.plan = "premium";
			} else if (type == "app" || type == "app-rentable") {
				workspace.boughtApplications.push(
					new mongoose.Types.ObjectId(applicationId),
				);
			}

			await workspace.save();
			break;
		}

		case "invoice.payment_failed":
			// A payment failed (for instance the customer does not have a valid payment method)
			// ❌ Revoke access to the product
			// ⏳ OR wait for the customer to pay (more friendly):
			//      - Stripe will automatically email the customer (Smart Retries)
			//      - We will receive a "customer.subscription.deleted" when all retries were made and the subscription has expired

			break;

		default:
		// Unhandled event type
	}

	return NextResponse.json({});
}
