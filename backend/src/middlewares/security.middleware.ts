import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoSanitize from "express-mongo-sanitize";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import hpp from "hpp";
import pinoHttp from "pino-http";
import xss from "xss-clean";
import type { Express, Request, Response, NextFunction } from "express";
import { corsOrigins, env } from "@/configs/env";
import { logger } from "@/configs/logger";
import { ApiError } from "@/utils/ApiError";

export function applySecurity(app: Express) {
  app.set("trust proxy", 1);
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" }
    })
  );
  app.use(
    cors({
      origin(origin, callback) {
        if (!origin || corsOrigins.includes(origin)) return callback(null, true);
        return callback(new ApiError(403, "Origin is not allowed by CORS", "CORS_BLOCKED"));
      },
      credentials: true
    })
  );
  app.use(cookieParser(env.COOKIE_SECRET));
  app.use(compression());
  app.use(mongoSanitize());
  app.use(xss());
  app.use(hpp());
  app.use(
    pinoHttp({
      logger,
      genReqId: (req) => (req.headers["x-request-id"] as string) || crypto.randomUUID()
    })
  );
  app.use(
    rateLimit({
      windowMs: env.GLOBAL_RATE_LIMIT_WINDOW_MS,
      max: env.GLOBAL_RATE_LIMIT_MAX,
      standardHeaders: true,
      legacyHeaders: false
    })
  );
  app.use((req: Request, _res: Response, next: NextFunction) => {
    req.requestId = req.id as string;
    if (env.MAINTENANCE_MODE && !req.path.includes("/health")) {
      return next(new ApiError(503, "The API is temporarily in maintenance mode", "MAINTENANCE_MODE"));
    }
    return next();
  });
}
