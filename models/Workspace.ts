import mongoose from "mongoose";
import toJSON from "./plugins/toJSON";
import { Model } from "mongoose";

interface members extends Document {
  memberId: mongoose.Schema.Types.ObjectId;
  role: "admin" | "member";
}

export interface IWorkspace extends Document {
  name: string;
  icon: {
    type: "image" | "emoji";
    value: string;
  };
  owner: mongoose.Schema.Types.ObjectId;
  members: members[];
  invitedMembersEmail: {
    invitedAt: Date;
    email: string;
  }[];
  plan: "premium" | "free";
  priceId: string;
  boughtApplications: mongoose.Types.ObjectId[];
  rules: {
    allowedMemberApps: {
      appId: mongoose.Schema.Types.ObjectId;
      memberId: mongoose.Schema.Types.ObjectId;
    };
  };
}

const workspaceSchema = new mongoose.Schema<IWorkspace>(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      maxlength: 100,
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
    invitedMembersEmail: {
      type: [
        {
          invitedAt: {
            type: Date,
            default: Date.now,
          },
          email: {
            type: String,
            required: true,
            validate: {
              validator: (email: string) =>
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
              message: "O email é inválido.",
            },
          },
        },
      ],
      default: [],
    },
    plan: {
      type: String,
      enum: ["premium", "free"],
      default: "free",
    },
    priceId: {
      type: String,
      validate: {
        validator: (v: string) => /^price_/.test(v),
        message: "O priceId deve começar com 'price_'.",
      },
    },
    boughtApplications: {
      type: [mongoose.Schema.Types.ObjectId],
      default: [],
    },
    rules: {
      allowedMemberApps: {
        appId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Application",
        },
        memberId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Member",
        },
      },
      required: false,
    },
  },
  {
    toJSON: { virtuals: true },
    timestamps: true,
  }
);

workspaceSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.name = this.name.trim();
  }
  if (this.isModified("icon.value")) {
    this.icon.value = this.icon.value.trim();
  }
  next();
});

// Helper function to remove workspace references from Applications
async function removeWorkspaceFromApplications(
  workspaceId: mongoose.Schema.Types.ObjectId
) {
  await mongoose
    .model("Applications")
    .updateMany(
      { workspacesAllowed: workspaceId },
      { $pull: { workspacesAllowed: workspaceId } }
    );
}

// Helper function to delete MyApplications documents with the workspaceId
async function deleteMyApplicationsWithWorkspace(
  workspaceId: mongoose.Types.ObjectId
) {
  await mongoose.model("MyApplications").deleteMany({ workspaceId });
}

// Middleware for findOneAndDelete
workspaceSchema.pre("findOneAndDelete", async function (next) {
  try {
    const workspaceToDelete = await this.model.findOne(this.getQuery());
    if (workspaceToDelete) {
      const workspaceId = workspaceToDelete._id;
      await Promise.all([
        removeWorkspaceFromApplications(workspaceId),
        deleteMyApplicationsWithWorkspace(workspaceId),
      ]);
    }
    next();
  } catch (error) {
    next(error);
  }
});

// Middleware for deleteOne
workspaceSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    try {
      const workspaceId = this._id;
      await Promise.all([
        removeWorkspaceFromApplications(workspaceId as any),
        deleteMyApplicationsWithWorkspace(workspaceId),
      ]);
      next();
    } catch (error) {
      next(error);
    }
  }
);

// Middleware for deleteMany
workspaceSchema.pre("deleteMany", async function (next) {
  try {
    const workspacesToDelete = await this.model.find(this.getQuery());
    const workspaceIds = workspacesToDelete.map((ws) => ws._id);
    if (workspaceIds.length > 0) {
      await Promise.all([
        mongoose
          .model("Applications")
          .updateMany(
            { workspacesAllowed: { $in: workspaceIds } },
            { $pull: { workspacesAllowed: { $in: workspaceIds } } }
          ),
        mongoose
          .model("MyApplications")
          .deleteMany({ workspaceId: { $in: workspaceIds } }),
      ]);
    }
    next();
  } catch (error) {
    next(error);
  }
});

workspaceSchema.plugin(toJSON as any);

const Workspace: Model<IWorkspace> =
  mongoose.models.Workspace ||
  mongoose.model<IWorkspace>("Workspace", workspaceSchema);

export default Workspace;
