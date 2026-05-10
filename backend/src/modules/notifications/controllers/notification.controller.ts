import { NotificationModel } from "@/models/Operational.model";
import { asyncHandler } from "@/utils/asyncHandler";

export const NotificationController = {
  list: asyncHandler(async (req, res) => {
    res.json({ success: true, data: await NotificationModel.find({ userId: req.user!.id }).sort({ createdAt: -1 }).limit(50) });
  }),
  markRead: asyncHandler(async (req, res) => {
    res.json({ success: true, data: await NotificationModel.findOneAndUpdate({ _id: req.params.id, userId: req.user!.id }, { readAt: new Date() }, { new: true }) });
  })
};
