import mongoose from "mongoose";
import toJSON from "./plugins/toJSON";
import { Model } from "mongoose";

interface IWorkspace extends Document {
  name: string;
  icon: string;
  owner: mongoose.Schema.Types.ObjectId;
}

const workspaceSchema = new mongoose.Schema<IWorkspace>(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    icon: {
      type: String,
      trim: true,
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    toJSON: { virtuals: true },
    timestamps: true,
  }
);

workspaceSchema.plugin(toJSON as any);

const Workspace: Model<IWorkspace> =
  mongoose.models.Workspace ||
  mongoose.model<IWorkspace>("Workspace", workspaceSchema);

export default Workspace;
