import { Schema, model, Types, type InferSchemaType } from "mongoose";

const imageSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: "User", required: true, index: true },
    original: {
      url: { type: String, required: true },
      publicId: String,
      bytes: Number,
      width: Number,
      height: Number,
      mimeType: String
    },
    processed: {
      url: String,
      publicId: String,
      bytes: Number,
      width: Number,
      height: Number,
      mimeType: String
    },
    background: {
      type: { type: String, enum: ["transparent", "white", "color", "image"], default: "transparent" },
      value: String
    },
    status: { type: String, enum: ["uploaded", "queued", "processing", "completed", "failed"], default: "uploaded", index: true },
    error: String,
    creditsUsed: { type: Number, default: 1 },
    downloadCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

imageSchema.index({ userId: 1, createdAt: -1 });
imageSchema.index({ status: 1, updatedAt: -1 });

export type ImageDocument = InferSchemaType<typeof imageSchema>;
export const ImageModel = model("Image", imageSchema);
