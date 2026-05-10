import { nanoid } from "nanoid";
import { APIKeyModel } from "@/models/APIKey.model";
import { sha256 } from "@/utils/crypto";
import { ApiError } from "@/utils/ApiError";

export class DeveloperService {
  async createKey(userId: string, name: string, scopes = ["images:process"]) {
    const rawKey = `cc_${nanoid(32)}`;
    const apiKey = await APIKeyModel.create({
      userId,
      name,
      prefix: rawKey.slice(0, 8),
      keyHash: sha256(rawKey),
      scopes
    });
    return { id: apiKey.id, key: rawKey, prefix: apiKey.prefix, scopes: apiKey.scopes };
  }

  listKeys(userId: string) {
    return APIKeyModel.find({ userId }).sort({ createdAt: -1 });
  }

  revokeKey(userId: string, keyId: string) {
    return APIKeyModel.findOneAndUpdate({ _id: keyId, userId }, { status: "revoked" }, { new: true });
  }

  async usage(userId: string) {
    const keys = await APIKeyModel.find({ userId });
    return {
      totalRequests: keys.reduce((sum, key) => sum + key.usageThisMonth, 0),
      quota: keys.reduce((sum, key) => sum + key.quotaPerMonth, 0),
      keys: keys.length
    };
  }

  async verifyPublicKey(rawKey: string) {
    const key = await APIKeyModel.findOne({ keyHash: sha256(rawKey), status: "active" }).select("+keyHash");
    if (!key) throw new ApiError(401, "Invalid API key", "API_KEY_INVALID");
    await key.updateOne({ $inc: { usageThisMonth: 1 }, lastUsedAt: new Date() });
    return key;
  }
}
