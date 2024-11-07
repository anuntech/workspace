import mongoose from "mongoose";
import toJSON from "./plugins/toJSON";
import { Model } from "mongoose";

export interface INotification extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  message?: string;
  isNew?: boolean;
  isInvite?: boolean;
  from?: mongoose.Schema.Types.ObjectId;
  workspaceId?: mongoose.Schema.Types.ObjectId;
  state?: "refused" | "neutral" | "accepted";
}

const NotificationSchema = new mongoose.Schema<INotification>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    message: String,
    isNew: {
      type: Boolean,
      default: true,
    },
    isInvite: {
      type: Boolean,
      default: false,
    },
    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
    },
    state: {
      type: String,
      enum: ["refused", "neutral", "accepted"],
      default: "neutral",
    },
  },
  {
    toJSON: { virtuals: true },
    timestamps: true,
  }
);

NotificationSchema.plugin(toJSON);

const Notifications: Model<INotification> =
  mongoose.models.Notifications ||
  mongoose.model<INotification>("Notifications", NotificationSchema);

export default Notifications;
