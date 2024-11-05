import mongoose from "mongoose";
import toJSON from "./plugins/toJSON";
import { Model } from "mongoose";

export interface INotification extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  message: string;
  isNew: boolean;
  isInvite: boolean;
  from?: mongoose.Schema.Types.ObjectId;
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
      default: false,
    },
    isInvite: {
      type: Boolean,
      default: false,
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
