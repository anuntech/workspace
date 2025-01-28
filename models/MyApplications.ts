import mongoose from "mongoose";
import toJSON from "./plugins/toJSON";
import { Model } from "mongoose";

export interface IMyApplications extends Document {
	workspaceId: mongoose.Schema.Types.ObjectId;
	allowedApplicationsId: mongoose.Schema.Types.ObjectId[];
	favoriteApplications: {
		applicationId: mongoose.Types.ObjectId;
		userId: mongoose.Types.ObjectId;
	}[];
}

const myApplicationSchema = new mongoose.Schema<IMyApplications>(
	{
		workspaceId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Workspace",
			required: true,
		},
		allowedApplicationsId: {
			type: [
				{
					type: mongoose.Schema.Types.ObjectId,
					ref: "Applications",
				},
			],
			default: [],
		},
		favoriteApplications: [
			{
				applicationId: {
					type: mongoose.Types.ObjectId,
					ref: "Applications",
				},
				userId: {
					type: mongoose.Types.ObjectId,
					ref: "User",
				},
			},
		],
	},
	{
		toJSON: { virtuals: true },
		timestamps: true,
	},
);

myApplicationSchema.plugin(toJSON as any);

const MyApplications: Model<IMyApplications> =
	mongoose.models.MyApplications ||
	mongoose.model<IMyApplications>("MyApplications", myApplicationSchema);

export default MyApplications;
