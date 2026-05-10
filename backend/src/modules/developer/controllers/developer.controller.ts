import { asyncHandler } from "@/utils/asyncHandler";
import { DeveloperService } from "../services/developer.service";

const service = new DeveloperService();

export const DeveloperController = {
  createKey: asyncHandler(async (req, res) => {
    res.status(201).json({ success: true, data: await service.createKey(req.user!.id, req.body.name ?? "Default key", req.body.scopes) });
  }),
  listKeys: asyncHandler(async (req, res) => {
    res.json({ success: true, data: await service.listKeys(req.user!.id) });
  }),
  revokeKey: asyncHandler(async (req, res) => {
    res.json({ success: true, data: await service.revokeKey(req.user!.id, String(req.params.keyId)) });
  }),
  usage: asyncHandler(async (req, res) => {
    res.json({ success: true, data: await service.usage(req.user!.id) });
  }),
  docs: asyncHandler(async (_req, res) => {
    res.json({ success: true, data: { openapi: "/docs", sdks: ["node", "python", "curl"] } });
  })
};
