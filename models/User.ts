import mongoose from "mongoose";
import toJSON from "./plugins/toJSON";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      maxlength: 100,
      validate: {
        validator: (v: string) => /^[a-zA-Z\s]+$/.test(v),
        message: "O nome deve conter apenas letras e espaços.",
      },
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      required: [true, "O email é obrigatório."],
      validate: {
        validator: (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
        message: "Formato de email inválido.",
      },
    },
    image: {
      type: String,
      trim: true,
    },
    customerId: {
      type: String,
      trim: true,
      validate: {
        validator: (v: string) => /^cus_/.test(v),
        message: "O customerId deve começar com 'cus_'.",
      },
    },
    priceId: {
      type: String,
      trim: true,
      validate: {
        validator: (v: string) => /^price_/.test(v),
        message: "O priceId deve começar com 'price_'.",
      },
    },
    hasAccess: {
      type: Boolean,
      default: false,
      validate: {
        validator: (v: boolean) => typeof v === "boolean",
        message: "O campo hasAccess deve ser um valor booleano.",
      },
    },
    icon: {
      type: {
        type: String,
        enum: ["image", "emoji"],
      },
      value: {
        type: String,
        trim: true,
      },
    },
    pagesOpened: {
      type: [String],
      enum: ["workspace", "invitation", "application"],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

userSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.name = this.name.trim();
  }
  if (this.isModified("email")) {
    this.email = this.email.trim().toLowerCase();
  }
  next();
});

userSchema.index({ email: 1 }, { unique: true });

userSchema.plugin(toJSON);

export default mongoose.models.User || mongoose.model("User", userSchema);
