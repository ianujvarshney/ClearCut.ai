import { Schema, model, Types, type InferSchemaType } from "mongoose";

const sessionSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: "User", required: true, index: true },
    refreshTokenHash: { type: String, required: true, unique: true },
    device: {
      userAgent: String,
      ip: String,
      country: String,
      city: String
    },
    revokedAt: Date,
    expiresAt: { type: Date, required: true, index: { expires: 0 } }
  },
  { timestamps: true }
);

export type SessionDocument = InferSchemaType<typeof sessionSchema>;
export const SessionModel = model("Session", sessionSchema);
