import mongoose from "mongoose";
import toJSON from "./plugins/toJSON";
import { Model } from "mongoose";

export interface IApplications extends mongoose.Document {
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
  workspaceAccess: "free" | "premium" | "buyable";
  priceId?: string;
}

const applicationSchema = new mongoose.Schema<IApplications>(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      maxlength: 100,
      validate: {
        validator: (v: string) => /^[a-zA-Z0-9 ]+$/.test(v),
        message: "O nome só pode conter letras, números e espaços.",
      },
    },
    cta: {
      type: String,
      trim: true,
      maxlength: 50,
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
      value: {
        type: String,
        trim: true,
        maxlength: 100,
      },
    },
    galleryPhotos: {
      type: [String],
      validate: {
        validator: (v: string[]) => v.length <= 10,
        message: "Não pode haver mais de 10 imagens.",
      },
    },
    avatarFallback: {
      type: String,
      trim: true,
      required: true,
      maxlength: 50,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    descriptionTitle: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    workspacesAllowed: {
      type: [mongoose.Schema.Types.ObjectId],
      trim: true,
    },
    workspaceAccess: {
      type: String,
      enum: ["free", "premium", "buyable"],
    },
    priceId: {
      type: String,
      trim: true,
      maxlength: 100,
    },
  },
  {
    toJSON: { virtuals: true },
    timestamps: true,
  }
);

applicationSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.name = this.name.trim();
  }
  if (this.isModified("description")) {
    this.description = this.description.trim();
  }
  next();
});

async function removeApplicationReferences(appId: any) {
  await mongoose
    .model("MyApplications")
    .updateMany(
      { allowedApplicationsId: appId },
      { $pull: { allowedApplicationsId: appId } }
    );
}

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

applicationSchema.index({ name: 1 }, { unique: true });

const Applications: Model<IApplications> =
  mongoose.models.Applications ||
  mongoose.model<IApplications>("Applications", applicationSchema);

export default Applications;
