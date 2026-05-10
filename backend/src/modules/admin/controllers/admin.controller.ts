import { UserModel } from "@/models/User.model";
import { ImageModel } from "@/models/Image.model";
import { PaymentModel } from "@/models/Billing.model";
import { ActivityLogModel } from "@/models/Operational.model";
import { asyncHandler } from "@/utils/asyncHandler";

export const AdminController = {
  users: asyncHandler(async (_req, res) => {
    res.json({ success: true, data: await UserModel.find().sort({ createdAt: -1 }).limit(100) });
  }),
  suspendUser: asyncHandler(async (req, res) => {
    res.json({ success: true, data: await UserModel.findByIdAndUpdate(req.params.userId, { status: "suspended" }, { new: true }) });
  }),
  analytics: asyncHandler(async (_req, res) => {
    const [users, images, revenue] = await Promise.all([
      UserModel.countDocuments(),
      ImageModel.countDocuments(),
      PaymentModel.aggregate([{ $match: { status: "paid" } }, { $group: { _id: null, total: { $sum: "$amount" } } }])
    ]);
    res.json({ success: true, data: { users, images, revenue: revenue[0]?.total ?? 0 } });
  }),
  logs: asyncHandler(async (_req, res) => {
    res.json({ success: true, data: await ActivityLogModel.find().sort({ createdAt: -1 }).limit(100) });
  }),
  abuse: asyncHandler(async (_req, res) => {
    res.json({ success: true, data: { flaggedKeys: [], blockedIps: [], status: "monitoring-placeholder" } });
  })
};
