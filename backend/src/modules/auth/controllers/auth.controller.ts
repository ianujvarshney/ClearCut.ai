import { asyncHandler } from "@/utils/asyncHandler";
import { AuthService } from "../services/auth.service";

const service = new AuthService();

export const AuthController = {
  register: asyncHandler(async (req, res) => {
    const result = await service.register(req.body, { userAgent: req.headers["user-agent"], ip: req.ip });
    res.status(201).json({ success: true, data: result });
  }),
  login: asyncHandler(async (req, res) => {
    const result = await service.login(req.body, { userAgent: req.headers["user-agent"], ip: req.ip });
    res.json({ success: true, data: result });
  }),
  refresh: asyncHandler(async (req, res) => {
    res.json({ success: true, data: await service.refresh(req.body.refreshToken) });
  }),
  logout: asyncHandler(async (req, res) => {
    await service.logout(req.body.refreshToken);
    res.status(204).send();
  }),
  verifyEmail: asyncHandler(async (_req, res) => {
    res.json({ success: true, data: service.verifyEmail() });
  }),
  forgotPassword: asyncHandler(async (req, res) => {
    res.json({ success: true, data: service.requestPasswordReset(req.body.email) });
  }),
  resetPassword: asyncHandler(async (_req, res) => {
    res.json({ success: true, data: { reset: true, status: "password-reset-placeholder" } });
  }),
  oauth: asyncHandler(async (req, res) => {
    res.json({ success: true, data: service.oauth(req.params.provider as "google" | "github") });
  })
};
