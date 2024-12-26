import mongoose from "mongoose";
import toJSON from "./plugins/toJSON";
import { Model } from "mongoose";

export interface IMyApplications extends Document {
  workspaceId: mongoose.Schema.Types.ObjectId;
  allowedApplicationsId: mongoose.Schema.Types.ObjectId[];
  favoriteApplications: {
    applicationId: mongoose.Schema.Types.ObjectId;
    userId: mongoose.Schema.Types.ObjectId;
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
          type: mongoose.Schema.Types.ObjectId,
          ref: "Applications",
        },
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    timestamps: true,
  }
);

myApplicationSchema.plugin(toJSON as any);

const MyApplications: Model<IMyApplications> =
  mongoose.models.MyApplications ||
  mongoose.model<IMyApplications>("MyApplications", myApplicationSchema);

export default MyApplications;
