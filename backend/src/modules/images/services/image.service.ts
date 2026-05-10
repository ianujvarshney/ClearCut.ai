import { getImageProcessingQueue } from "@/queues/image.queue";
import { ApiError } from "@/utils/ApiError";
import { getPagination } from "@/utils/pagination";
import { ImageRepository } from "../repositories/image.repository";
import type { Request } from "express";

export class ImageService {
  constructor(private readonly repo = new ImageRepository()) {}

  async upload(userId: string, file: Express.Multer.File) {
    if (!file) throw new ApiError(400, "Image file is required", "FILE_REQUIRED");
    return this.repo.createImage({
      userId,
      original: {
        url: `/uploads/${Date.now()}-${file.originalname}`,
        bytes: file.size,
        mimeType: file.mimetype
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
    const processingJob = await this.repo.createProcessingJob({ userId, imageIds, background, status: "queued" });
    const queueJob = await getImageProcessingQueue().add("remove-background", { userId, imageIds, background });
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
    return { url: image.processed?.url ?? image.original?.url, signed: true, expiresIn: 300 };
  }

  retry(userId: string, jobId: string) {
    return this.status(userId, jobId).then((job) =>
      this.enqueue(userId, job.imageIds.map(String), { type: "transparent" })
    );
  }
}
