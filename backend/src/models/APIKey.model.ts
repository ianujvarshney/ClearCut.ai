import { Schema, model, Types } from "mongoose";

const apiKeySchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true },
    prefix: { type: String, required: true, index: true },
    keyHash: { type: String, required: true, unique: true, select: false },
    scopes: [{ type: String }],
    status: { type: String, enum: ["active", "revoked"], default: "active", index: true },
    quotaPerMonth: { type: Number, default: 1000 },
    usageThisMonth: { type: Number, default: 0 },
    lastUsedAt: Date,
    expiresAt: Date
  },
  { timestamps: true }
);

apiKeySchema.index({ userId: 1, createdAt: -1 });
export const APIKeyModel = model("APIKey", apiKeySchema);
