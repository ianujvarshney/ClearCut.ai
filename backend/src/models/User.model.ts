import { Schema, model, type InferSchemaType } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    passwordHash: { type: String, required: true, select: false },
    avatarUrl: String,
    role: { type: String, enum: ["admin", "user"], default: "user", index: true },
    status: { type: String, enum: ["active", "pending", "suspended", "deleted"], default: "pending", index: true },
    emailVerifiedAt: Date,
    oauth: {
      googleId: String,
      githubId: String
    },
    settings: {
      locale: { type: String, default: "en" },
      marketingEmails: { type: Boolean, default: true },
      processingAlerts: { type: Boolean, default: true }
    },
    creditsBalance: { type: Number, default: 50, min: 0 },
    deletedAt: Date
  },
  { timestamps: true }
);

userSchema.index({ createdAt: -1 });
userSchema.index({ "oauth.googleId": 1 }, { sparse: true });
userSchema.index({ "oauth.githubId": 1 }, { sparse: true });

export type UserDocument = InferSchemaType<typeof userSchema>;
export const UserModel = model("User", userSchema);
