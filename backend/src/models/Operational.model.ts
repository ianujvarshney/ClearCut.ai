import { Schema, model, Types } from "mongoose";

const notificationSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: "User", index: true },
    title: { type: String, required: true },
    body: { type: String, required: true },
    type: { type: String, enum: ["info", "success", "warning", "billing", "processing"], default: "info" },
    readAt: Date
  },
  { timestamps: true }
);

const activityLogSchema = new Schema(
  {
    actorId: { type: Types.ObjectId, ref: "User", index: true },
    action: { type: String, required: true, index: true },
    entityType: String,
    entityId: String,
    ip: String,
    userAgent: String,
    metadata: Schema.Types.Mixed
  },
  { timestamps: true }
);

const analyticsSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: "User", index: true },
    metric: { type: String, required: true, index: true },
    value: { type: Number, required: true },
    date: { type: Date, required: true, index: true },
    dimensions: Schema.Types.Mixed
  },
  { timestamps: true }
);

analyticsSchema.index({ metric: 1, date: -1 });
export const NotificationModel = model("Notification", notificationSchema);
export const ActivityLogModel = model("ActivityLog", activityLogSchema);
export const AnalyticsModel = model("Analytics", analyticsSchema);
