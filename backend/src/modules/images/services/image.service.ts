import { getImageProcessingQueue } from "@/queues/image.queue";
import { ApiError } from "@/utils/ApiError";
import { getPagination } from "@/utils/pagination";
import { env } from "@/configs/env";
import { ObjectStorageService } from "@/modules/storage/object-storage.service";
import { ImageRepository } from "../repositories/image.repository";
import type { Request } from "express";

export class ImageService {
  constructor(
    private readonly repo = new ImageRepository(),
    private readonly storage = new ObjectStorageService()
  ) {}

  async upload(userId: string, file: Express.Multer.File) {
    if (!file) throw new ApiError(400, "Image file is required", "FILE_REQUIRED");
    const object = await this.storage.putImage({
      userId,
      buffer: file.buffer,
      originalName: file.originalname,
      mimeType: file.mimetype,
      folder: "uploads"
    });
    return this.repo.createImage({
      userId,
      original: {
        url: object.url,
        publicId: object.publicId,
        bytes: object.bytes,
        mimeType: object.mimeType
      },
      status: "uploaded"
    });
  }

  async batchUpload(userId: string, files: Express.Multer.File[]) {
    return Promise.all(files.map((file) => this.upload(userId, file)));
  }

  list(req: Request) {
    const { skip, limit } = getPagination(req);
    return this.repo.listUserImages(req.user!.id, skip, limit);
  }

  async enqueue(userId: string, imageIds: string[], background = { type: "transparent" as const }) {
    const processingJob = await this.repo.createProcessingJob({ userId, imageIds, background, model: env.AI_MODEL_DEFAULT, provider: env.AI_PROVIDER_ORDER, status: "queued" });
    const queueJob = await getImageProcessingQueue().add("remove-background", {
      processingJobId: processingJob.id,
      userId,
      imageIds,
      background,
      model: env.AI_MODEL_DEFAULT,
      priority: imageIds.length > 1 ? "batch" : "standard",
      requestedAt: new Date().toISOString()
    });
    await processingJob.updateOne({ queueJobId: queueJob.id });
    await Promise.all(imageIds.map((imageId) => this.repo.updateImage(imageId, { status: "queued", background })));
    return { jobId: processingJob.id, queueJobId: queueJob.id, status: "queued" };
  }

  async status(userId: string, jobId: string) {
    const job = await this.repo.findJob(jobId, userId);
    if (!job) throw new ApiError(404, "Processing job not found", "JOB_NOT_FOUND");
    return job;
  }

  async download(userId: string, imageId: string) {
    const image = await this.repo.findImage(imageId, userId);
    if (!image) throw new ApiError(404, "Image not found", "IMAGE_NOT_FOUND");
    await this.repo.updateImage(imageId, { $inc: { downloadCount: 1 } });
    const publicIdOrUrl = image.processed?.publicId ?? image.processed?.url ?? image.original?.publicId ?? image.original?.url;
    return { url: this.storage.getSignedReadUrl(publicIdOrUrl), signed: true, expiresIn: env.SIGNED_URL_TTL_SECONDS };
  }

  retry(userId: string, jobId: string) {
    return this.status(userId, jobId).then((job) =>
      this.enqueue(userId, job.imageIds.map(String), { type: "transparent" })
    );
  }
}
