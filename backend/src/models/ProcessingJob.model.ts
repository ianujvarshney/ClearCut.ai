import { Schema, model, Types } from "mongoose";

const processingJobSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: "User", required: true, index: true },
    imageIds: [{ type: Types.ObjectId, ref: "Image" }],
    queueJobId: { type: String, index: true },
    provider: { type: String, default: "mock-ai" },
    status: { type: String, enum: ["queued", "processing", "completed", "failed", "retrying"], default: "queued", index: true },
    attempts: { type: Number, default: 0 },
    progress: { type: Number, default: 0 },
    error: String,
    completedAt: Date
  },
  { timestamps: true }
);

processingJobSchema.index({ userId: 1, createdAt: -1 });
export const ProcessingJobModel = model("ProcessingJob", processingJobSchema);
