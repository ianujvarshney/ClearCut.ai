import type { RequestHandler } from "express";
import { ApiError } from "@/utils/ApiError";
import { verifyAccessToken } from "@/utils/jwt";

export const authenticate: RequestHandler = (req, _res, next) => {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : undefined;
  if (!token) return next(new ApiError(401, "Missing access token", "AUTH_REQUIRED"));

  try {
    const payload = verifyAccessToken(token);
    req.user = { id: payload.sub, email: payload.email, role: payload.role };
    return next();
  } catch {
    return next(new ApiError(401, "Invalid or expired access token", "AUTH_INVALID"));
  }
};

export const authorize =
  (...roles: Array<"admin" | "user">): RequestHandler =>
  (req, _res, next) => {
    if (!req.user) return next(new ApiError(401, "Authentication required", "AUTH_REQUIRED"));
    if (!roles.includes(req.user.role)) return next(new ApiError(403, "Insufficient permissions", "RBAC_DENIED"));
    return next();
  };
