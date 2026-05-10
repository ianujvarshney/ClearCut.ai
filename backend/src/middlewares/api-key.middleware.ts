import type { RequestHandler } from "express";
import { DeveloperService } from "@/modules/developer/services/developer.service";

const service = new DeveloperService();

export const authenticateApiKey: RequestHandler = async (req, _res, next) => {
  try {
    const rawKey = req.header("x-api-key");
    if (!rawKey) throw new Error("Missing API key");
    const key = await service.verifyPublicKey(rawKey);
    req.apiKey = { id: key.id, ownerId: String(key.userId), scopes: key.scopes };
    return next();
  } catch (error) {
    return next(error);
  }
};
