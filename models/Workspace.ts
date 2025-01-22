import mongoose from "mongoose";
import toJSON from "./plugins/toJSON";
import { Model } from "mongoose";

interface WorkspaceMember extends mongoose.Document {
  memberId: mongoose.Schema.Types.ObjectId;
  role: "admin" | "member";
}

interface WorkspaceIcon {
  type: "image" | "emoji" | "lucide";
  value: string;
}

interface WorkspaceInvite {
  invitedAt: Date;
  email: string;
}

interface WorkspaceRule {
  appId: mongoose.Schema.Types.ObjectId;
  members: { memberId: mongoose.Schema.Types.ObjectId }[];
}

interface WorkspaceLink {
  title: string;
  url: string;
  icon: WorkspaceIcon;
  urlType: "none" | "iframe" | "newWindow" | "sameWindow";
  fields: {
    key: string;
    value: string;
    redirectType: "iframe" | "newWindow" | "sameWindow";
  }[];
}

export interface IWorkspace extends mongoose.Document {
  name: string;
  icon: WorkspaceIcon;
  owner: mongoose.Schema.Types.ObjectId;
  members: WorkspaceMember[];
  invitedMembersEmail: WorkspaceInvite[];
  plan: "premium" | "free";
  priceId: string;
  boughtApplications: mongoose.Types.ObjectId[];
  rules: {
    allowedMemberApps: WorkspaceRule[];
  };
  tutorial: {
    name: "workspace" | "invitation" | "application";
  }[];
  links: WorkspaceLink[];
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PRICE_ID_REGEX = /^price_/;
const MAX_NAME_LENGTH = 50;
const MAX_ICON_VALUE_LENGTH = 100;

const workspaceSchema = new mongoose.Schema<IWorkspace>(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      maxlength: MAX_NAME_LENGTH,
    },
    icon: {
      type: {
        type: String,
        enum: ["image", "emoji", "lucide"],
        required: true,
      },
      value: {
        type: String,
        trim: true,
        maxlength: MAX_ICON_VALUE_LENGTH,
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
              validator: (email: string) => EMAIL_REGEX.test(email),
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
        validator: (v: string) => PRICE_ID_REGEX.test(v),
        message: "O priceId deve começar com 'price_'.",
      },
    },
    boughtApplications: {
      type: [mongoose.Schema.Types.ObjectId],
      default: [],
    },
    rules: {
      allowedMemberApps: [
        {
          appId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Application",
          },
          members: [
            {
              memberId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Member",
              },
            },
          ],
        },
      ],
      default: {},
    },
    tutorial: {
      type: [
        {
          name: {
            type: String,
            required: [true, "O nome da página é obrigatório."],
            enum: ["workspace", "invitation", "application"],
          },
        },
      ],
    },
    links: [
      {
        title: {
          type: String,
          required: [true, "O título do link é obrigatório."],
        },
        url: {
          type: String,
        },
        icon: {
          type: {
            type: String,
            enum: ["image", "emoji", "lucide"],
            required: true,
          },
          value: {
            type: String,
            trim: true,
            maxlength: MAX_ICON_VALUE_LENGTH,
          },
        },
        urlType: {
          type: String,
          enum: ["none", "iframe", "newWindow", "sameWindow"],
          default: "none",
          required: true,
        },
        fields: [
          {
            key: {
              type: String,
              required: true,
            },
            value: {
              type: String,
              required: true,
            },
            redirectType: {
              type: String,
              enum: ["iframe", "newWindow", "sameWindow"],
              default: "iframe",
              required: true,
            },
          },
        ],
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    timestamps: true,
  }
);

workspaceSchema.pre("save", async function (next) {
  try {
    if (this.isModified("name")) {
      this.name = this.name.trim();
    }
    if (this.isModified("icon.value")) {
      this.icon.value = this.icon.value.trim();
    }

    if (this.isModified("tutorial") && Array.isArray(this.tutorial)) {
      const uniquePages = Array.from(
        new Set(this.tutorial.map((t) => t.name))
      ).map((name) => ({ name }));
      this.tutorial = uniquePages;
    }
    next();
  } catch (error) {
    next(error);
  }
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

// Add index for common queries
workspaceSchema.index({ owner: 1 });
workspaceSchema.index({ "members.memberId": 1 });

// Add method to check if user is member
workspaceSchema.methods.isMember = function (
  userId: mongoose.Types.ObjectId
): boolean {
  return this.members.some((member: any) => member.memberId.equals(userId));
};

// Add method to check if user is admin
workspaceSchema.methods.isAdmin = function (
  userId: mongoose.Types.ObjectId
): boolean {
  return this.members.some(
    (member: any) => member.memberId.equals(userId) && member.role === "admin"
  );
};

workspaceSchema.plugin(toJSON as any);

const Workspace: Model<IWorkspace> =
  mongoose.models.Workspace ||
  mongoose.model<IWorkspace>("Workspace", workspaceSchema);

export default Workspace;
