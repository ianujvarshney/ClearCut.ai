import type { ErrorRequestHandler, RequestHandler } from "express";
import { ZodError } from "zod";
import { ApiError } from "@/utils/ApiError";
import { logger } from "@/configs/logger";
import { env } from "@/configs/env";

export const notFoundHandler: RequestHandler = (req, _res, next) => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`, "NOT_FOUND"));
};

export const errorHandler: ErrorRequestHandler = (error, req, res, _next) => {
  if (error instanceof ZodError) {
    return res.status(422).json({
      success: false,
      code: "VALIDATION_ERROR",
      message: "Request validation failed",
      details: error.flatten(),
      requestId: req.requestId
    });
  }

  const normalized =
    error instanceof ApiError
      ? error
      : new ApiError(error.statusCode || 500, error.message || "Internal server error", "INTERNAL_ERROR");

  logger.error({ err: error, requestId: req.requestId }, normalized.message);

  return res.status(normalized.statusCode).json({
    success: false,
    code: normalized.code,
    message: normalized.message,
    details: normalized.details,
    requestId: req.requestId,
    stack: env.NODE_ENV === "production" ? undefined : normalized.stack
  });
};
