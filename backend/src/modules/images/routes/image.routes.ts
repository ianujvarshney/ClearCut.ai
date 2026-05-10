import { Router } from "express";
import { authenticate } from "@/middlewares/auth.middleware";
import { upload } from "@/middlewares/upload.middleware";
import { validate } from "@/middlewares/validate.middleware";
import { ImageController } from "../controllers/image.controller";
import { batchProcessSchema, processImageSchema } from "../validators/image.validator";

export const imageRouter = Router();

imageRouter.use(authenticate);
imageRouter.post("/upload", upload.single("image"), ImageController.upload);
imageRouter.post("/batch-upload", upload.array("images", 25), ImageController.batchUpload);
imageRouter.get("/history", ImageController.history);
imageRouter.post("/remove-background", validate(processImageSchema), ImageController.removeBackground);
imageRouter.post("/batch-process", validate(batchProcessSchema), ImageController.batchProcess);
imageRouter.get("/jobs/:jobId", ImageController.status);
imageRouter.post("/jobs/:jobId/retry", ImageController.retry);
imageRouter.get("/:imageId/download", ImageController.download);
