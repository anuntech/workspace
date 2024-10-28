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
  invitedMembersEmail: string[];
  plan: "premium" | "free";
}

const workspaceSchema = new mongoose.Schema<IWorkspace>(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    icon: {
      type: {
        type: String,
        enum: ["image", "emoji"],
        required: true,
      },
      value: String,
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
      type: [String],
      validate: {
        validator: function (value: string[]) {
          return value.length === new Set(value).size;
        },
        message: "duplicated email",
      },
      default: [],
    },
    plan: {
      type: String,
      enum: ["premium", "free"],
      default: "free",
    },
  },
  {
    toJSON: { virtuals: true },
    timestamps: true,
  }
);

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
