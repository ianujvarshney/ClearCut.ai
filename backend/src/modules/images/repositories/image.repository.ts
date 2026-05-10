import { ImageModel } from "@/models/Image.model";
import { ProcessingJobModel } from "@/models/ProcessingJob.model";

export class ImageRepository {
  createImage(payload: Record<string, unknown>) {
    return ImageModel.create(payload);
  }

  listUserImages(userId: string, skip = 0, limit = 20) {
    return ImageModel.find({ userId }).sort({ createdAt: -1 }).skip(skip).limit(limit);
  }

  findImage(id: string, userId?: string) {
    return ImageModel.findOne({ _id: id, ...(userId ? { userId } : {}) });
  }

  updateImage(id: string, payload: Record<string, unknown>) {
    return ImageModel.findByIdAndUpdate(id, payload, { new: true });
  }

  createProcessingJob(payload: Record<string, unknown>) {
    return ProcessingJobModel.create(payload);
  }

  findJob(id: string, userId?: string) {
    return ProcessingJobModel.findOne({ _id: id, ...(userId ? { userId } : {}) });
  }
}
