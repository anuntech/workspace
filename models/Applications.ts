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
  descriptionTitle: string;
  workspacesAllowed: mongoose.Schema.Types.ObjectId[];
  galleryPhotos: string[];
  icon: {
    type: "image" | "emoji";
    value: string;
  };
  workspaceAccess: "free" | "premium";
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
    },
    icon: {
      type: {
        type: String,
        enum: ["image", "emoji"],
        required: true,
      },
      value: String,
    },
    galleryPhotos: {
      type: [String],
      trim: true,
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
    descriptionTitle: {
      type: String,
      trim: true,
    },
    workspacesAllowed: {
      type: [mongoose.Schema.Types.ObjectId],
      trim: true,
    },
    workspaceAccess: {
      type: String,
      enum: ["free", "premium"],
    },
  },
  {
    toJSON: { virtuals: true },
    timestamps: true,
  }
);

// Inside your applicationSchema file

// Inside your applicationSchema file

// Helper function to remove application references
async function removeApplicationReferences(appId: any) {
  await mongoose
    .model("MyApplications")
    .updateMany(
      { allowedApplicationsId: appId },
      { $pull: { allowedApplicationsId: appId } }
    );
}

// Middleware for findOneAndDelete
applicationSchema.pre("findOneAndDelete", async function (next) {
  try {
    const appToDelete = await this.model.findOne(this.getQuery());
    if (appToDelete) {
      await removeApplicationReferences(appToDelete._id);
    }
    next();
  } catch (error) {
    next(error);
  }
});

// Middleware for deleteOne
applicationSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    try {
      await removeApplicationReferences(this._id);
      next();
    } catch (error) {
      next(error);
    }
  }
);

// Middleware for deleteMany
applicationSchema.pre("deleteMany", async function (next) {
  try {
    const appsToDelete = await this.model.find(this.getQuery());
    const appIds = appsToDelete.map((app) => app._id);
    if (appIds.length > 0) {
      await mongoose
        .model("MyApplications")
        .updateMany(
          { allowedApplicationsId: { $in: appIds } },
          { $pull: { allowedApplicationsId: { $in: appIds } } }
        );
    }
    next();
  } catch (error) {
    next(error);
  }
});

applicationSchema.plugin(toJSON as any);

const Applications: Model<IApplications> =
  mongoose.models.Applications ||
  mongoose.model<IApplications>("Applications", applicationSchema);

export default Applications;
