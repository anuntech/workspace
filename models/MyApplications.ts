import mongoose from "mongoose";
import toJSON from "./plugins/toJSON";
import { Model } from "mongoose";

export interface IMyApplications extends Document {
	workspaceId: mongoose.Schema.Types.ObjectId;
	allowedApplicationsId: mongoose.Schema.Types.ObjectId[];
	favoriteApplications: {
		applicationId: mongoose.Types.ObjectId;
		userId: mongoose.Types.ObjectId;
		type: "application" | "link";
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
		favoriteApplications: {
			type: [
				new mongoose.Schema({
					applicationId: {
						type: mongoose.Types.ObjectId,
						required: true,
					},
					userId: {
						type: mongoose.Types.ObjectId,
						ref: "User",
						required: true,
					},
					type: {
						type: String,
						enum: ["application", "link"],
						required: true,
					},
				}),
			],
			validate: {
				validator: function (favorites: any[]) {
					const uniquePairs = new Set(
						favorites.map((fav) => `${fav.applicationId}-${fav.userId}`),
					);
					return uniquePairs.size === favorites.length;
				},
				message:
					"Um usuário não pode favoritar o mesmo aplicativo mais de uma vez.",
			},
		},
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
