import multer from "multer";
import { env } from "@/configs/env";
import { ApiError } from "@/utils/ApiError";

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: env.UPLOAD_MAX_FILE_SIZE_MB * 1024 * 1024,
    files: 25
  },
  fileFilter(_req, file, cb) {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new ApiError(415, "Only image files are allowed", "UNSUPPORTED_FILE"));
    }
    return cb(null, true);
  }
});
