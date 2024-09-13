import mongoose from "mongoose";
import toJSON from "./plugins/toJSON";

const workspaceSchema = new mongoose.Schema(
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
  },
  {
    toJSON: { virtuals: true },
    timestamps: true,
  }
);

workspaceSchema.plugin(toJSON);

export default mongoose.models.Workspace ||
  mongoose.model("Workspace", workspaceSchema);
