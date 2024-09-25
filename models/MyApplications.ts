import mongoose from "mongoose";
import toJSON from "./plugins/toJSON";
import { Model } from "mongoose";

export interface IMyApplications extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  applicationId: mongoose.Schema.Types.ObjectId;
}

const myApplicationSchema = new mongoose.Schema<IMyApplications>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Applications",
      required: true,
    },
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
