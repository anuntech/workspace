import mongoose, { Model } from "mongoose";
import toJSON from "./plugins/toJSON";

// LEAD SCHEMA is used to store the leads that are generated from the landing page.
// You would use this if your product isn't ready yet and you want to collect emails
// The <ButtonLead /> component & the /api/lead route are used to collect the emails

export interface IPlans extends Document {
	name: string;
	membersLimit: number;
	appsLimit: number;
	price: number;
}

const plansSchema = new mongoose.Schema<IPlans>(
	{
		name: {
			type: String,
			trim: true,
			required: true,
		},
		membersLimit: {
			type: Number,
			required: true,
			default: 0,
		},
		appsLimit: {
			type: Number,
			required: true,
			default: 0,
		},
		price: {
			type: Number,
			required: true,
			default: 0,
		},
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
	},
);

// add plugin that converts mongoose to json
plansSchema.plugin(toJSON as any);

const plans: Model<IPlans> =
	mongoose.models.Plans || mongoose.model("Plans", plansSchema);

export default plans;
