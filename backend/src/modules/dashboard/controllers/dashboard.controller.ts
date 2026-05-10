import { ImageModel } from "@/models/Image.model";
import { AnalyticsModel, ActivityLogModel } from "@/models/Operational.model";
import { asyncHandler } from "@/utils/asyncHandler";

export const DashboardController = {
  overview: asyncHandler(async (req, res) => {
    const [images, completed, failed, activity] = await Promise.all([
      ImageModel.countDocuments({ userId: req.user!.id }),
      ImageModel.countDocuments({ userId: req.user!.id, status: "completed" }),
      ImageModel.countDocuments({ userId: req.user!.id, status: "failed" }),
      ActivityLogModel.find({ actorId: req.user!.id }).sort({ createdAt: -1 }).limit(10)
    ]);
    res.json({ success: true, data: { images, completed, failed, activity } });
  }),
  usage: asyncHandler(async (req, res) => {
    const metrics = await AnalyticsModel.find({ userId: req.user!.id }).sort({ date: -1 }).limit(60);
    res.json({ success: true, data: metrics });
  }),
  reports: asyncHandler(async (_req, res) => {
    res.json({ success: true, data: { period: "monthly", status: "report-generation-placeholder" } });
  })
};
