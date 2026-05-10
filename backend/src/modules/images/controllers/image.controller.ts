import { asyncHandler } from "@/utils/asyncHandler";
import { ImageService } from "../services/image.service";

const service = new ImageService();

export const ImageController = {
  upload: asyncHandler(async (req, res) => {
    res.status(201).json({ success: true, data: await service.upload(req.user!.id, req.file!) });
  }),
  batchUpload: asyncHandler(async (req, res) => {
    res.status(201).json({ success: true, data: await service.batchUpload(req.user!.id, req.files as Express.Multer.File[]) });
  }),
  history: asyncHandler(async (req, res) => {
    res.json({ success: true, data: await service.list(req) });
  }),
  removeBackground: asyncHandler(async (req, res) => {
    res.status(202).json({ success: true, data: await service.enqueue(req.user!.id, [req.body.imageId], req.body.background) });
  }),
  batchProcess: asyncHandler(async (req, res) => {
    res.status(202).json({ success: true, data: await service.enqueue(req.user!.id, req.body.imageIds, req.body.background) });
  }),
  status: asyncHandler(async (req, res) => {
    res.json({ success: true, data: await service.status(req.user!.id, String(req.params.jobId)) });
  }),
  retry: asyncHandler(async (req, res) => {
    res.status(202).json({ success: true, data: await service.retry(req.user!.id, String(req.params.jobId)) });
  }),
  download: asyncHandler(async (req, res) => {
    res.json({ success: true, data: await service.download(req.user!.id, String(req.params.imageId)) });
  })
};
