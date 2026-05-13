import crypto from "crypto";
import { env } from "@/configs/env";

export type StoredObject = {
  url: string;
  publicId: string;
  bytes: number;
  mimeType: string;
};

type PutObjectInput = {
  userId: string;
  buffer: Buffer;
  originalName: string;
  mimeType: string;
  folder: "uploads" | "processed" | "thumbnails" | "temporary";
};

export class ObjectStorageService {
  async putImage(input: PutObjectInput): Promise<StoredObject> {
    const extension = input.originalName.split(".").pop()?.toLowerCase() || "bin";
    const publicId = `${input.folder}/${input.userId}/${crypto.randomUUID()}.${extension}`;
    return {
      publicId,
      url: this.publicUrl(publicId),
      bytes: input.buffer.byteLength,
      mimeType: input.mimeType
    };
  }

  getSignedReadUrl(publicIdOrUrl?: string) {
    if (!publicIdOrUrl) return undefined;
    const unsignedUrl = publicIdOrUrl.startsWith("http") || publicIdOrUrl.startsWith("/") ? publicIdOrUrl : this.publicUrl(publicIdOrUrl);
    const expires = Math.floor(Date.now() / 1000) + env.SIGNED_URL_TTL_SECONDS;
    const signature = crypto.createHmac("sha256", env.COOKIE_SECRET).update(`${unsignedUrl}:${expires}`).digest("hex");
    return `${unsignedUrl}${unsignedUrl.includes("?") ? "&" : "?"}expires=${expires}&signature=${signature}`;
  }

  private publicUrl(publicId: string) {
    if (env.CDN_BASE_URL) return `${env.CDN_BASE_URL.replace(/\/$/, "")}/${publicId}`;
    if (env.STORAGE_PROVIDER === "s3") {
      return `https://${env.OBJECT_STORAGE_BUCKET}.s3.${env.OBJECT_STORAGE_REGION}.amazonaws.com/${publicId}`;
    }
    return `/storage/${publicId}`;
  }
}
