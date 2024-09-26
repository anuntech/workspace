import mongoose from "mongoose";
import toJSON from "./plugins/toJSON";
import { Model } from "mongoose";

export interface IApplications extends Document {
  id: mongoose.Schema.Types.ObjectId;
  name: string;
  avatarSrc: string;
  avatarFallback: string;
  description: string;
  cta: string;
  applicationUrl: string;
}

const applicationSchema = new mongoose.Schema<IApplications>(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    cta: {
      type: String,
      trim: true,
    },
    applicationUrl: {
      type: String,
      trim: true,
      required: true,
    },
    avatarSrc: {
      type: String,
      trim: true,
      required: true,
    },
    avatarFallback: {
      type: String,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  {
    toJSON: { virtuals: true },
    timestamps: true,
  }
);

applicationSchema.plugin(toJSON as any);

const Applications: Model<IApplications> =
  mongoose.models.Applications ||
  mongoose.model<IApplications>("Applications", applicationSchema);

export default Applications;
