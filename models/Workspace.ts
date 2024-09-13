import mongoose from "mongoose";
import toJSON from "./plugins/toJSON";
import { Model } from "mongoose";

interface members extends Document {
  memberId: mongoose.Schema.Types.ObjectId;
  role: "admin" | "member";
}

export interface IWorkspace extends Document {
  name: string;
  icon: string;
  owner: mongoose.Schema.Types.ObjectId;
  members: members[];
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
    members: {
      type: [
        {
          memberId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
          },
          role: {
            type: String,
            enum: ["admin", "member"],
            required: true,
          },
        },
      ],
      required: false,
      default: [],
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
