import { asyncHandler } from "@/utils/asyncHandler";
import { UserService } from "../services/user.service";

const service = new UserService();

export const UserController = {
  me: asyncHandler(async (req, res) => {
    res.json({ success: true, data: await service.profile(req.user!.id) });
  }),
  updateMe: asyncHandler(async (req, res) => {
    res.json({ success: true, data: await service.updateProfile(req.user!.id, req.body) });
  }),
  uploadAvatar: asyncHandler(async (req, res) => {
    res.json({ success: true, data: await service.updateAvatar(req.user!.id, `/cdn/avatars/${req.file?.originalname ?? "avatar.png"}`) });
  }),
  changePassword: asyncHandler(async (req, res) => {
    await service.changePassword(req.user!.id, req.body.password);
    res.status(204).send();
  }),
  deleteMe: asyncHandler(async (req, res) => {
    await service.deleteAccount(req.user!.id);
    res.status(204).send();
  }),
  activity: asyncHandler(async (_req, res) => {
    res.json({ success: true, data: [] });
  }),
  subscriptions: asyncHandler(async (_req, res) => {
    res.json({ success: true, data: { plan: "free", status: "active" } });
  })
};
