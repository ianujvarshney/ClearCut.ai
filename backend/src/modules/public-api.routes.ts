import { Router } from "express";
import { authenticateApiKey } from "@/middlewares/api-key.middleware";
import { upload } from "@/middlewares/upload.middleware";
import { asyncHandler } from "@/utils/asyncHandler";
import { getImageProcessingQueue } from "@/queues/image.queue";

export const publicApiRouter = Router();

publicApiRouter.use(authenticateApiKey);
publicApiRouter.post(
  "/remove-background",
  upload.single("image"),
  asyncHandler(async (req, res) => {
    const queueJob = await getImageProcessingQueue().add("public-remove-background", {
      userId: String(req.apiKey!.ownerId),
      imageIds: [],
      background: { type: req.body.background ?? "transparent" }
    });
    res.status(202).json({
      success: true,
      data: {
        requestId: queueJob.id,
        status: "queued",
        message: "Public API processing placeholder accepted"
      }
    });
  })
);
