import { Schema, model, Types } from "mongoose";

const uploadSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: "User", required: true, index: true },
    provider: { type: String, enum: ["cloudinary", "s3", "local"], default: "cloudinary" },
    key: { type: String, required: true, index: true },
    url: { type: String, required: true },
    signedUrl: String,
    mimeType: String,
    bytes: Number,
    checksum: String
  },
  { timestamps: true }
);

export const UploadModel = model("Upload", uploadSchema);
