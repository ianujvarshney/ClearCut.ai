import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "staging", "production"]).default("development"),
  PORT: z.coerce.number().default(5000),
  API_PREFIX: z.string().default("/api/v1"),
  APP_URL: z.string().url().default("http://localhost:3000"),
  API_URL: z.string().url().default("http://localhost:5000"),
  CORS_ORIGINS: z.string().default("http://localhost:3000"),
  MONGO_URI: z.string().default("mongodb://localhost:27017/clearcut_ai"),
  REDIS_HOST: z.string().default("localhost"),
  REDIS_PORT: z.coerce.number().default(6379),
  REDIS_PASSWORD: z.string().optional(),
  JWT_ACCESS_SECRET: z.string().min(32, "JWT_ACCESS_SECRET must be at least 32 characters").default("dev-access-secret-change-me-32-characters"),
  JWT_REFRESH_SECRET: z.string().min(32, "JWT_REFRESH_SECRET must be at least 32 characters").default("dev-refresh-secret-change-me-32-characters"),
  JWT_ACCESS_EXPIRES_IN: z.string().default("15m"),
  JWT_REFRESH_EXPIRES_IN: z.string().default("30d"),
  COOKIE_SECRET: z.string().min(32, "COOKIE_SECRET must be at least 32 characters").default("dev-cookie-secret-change-me-32-characters"),
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().default(587),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  EMAIL_FROM: z.string().default("ClearCut AI <no-reply@clearcut.ai>"),
  GLOBAL_RATE_LIMIT_WINDOW_MS: z.coerce.number().default(900000),
  GLOBAL_RATE_LIMIT_MAX: z.coerce.number().default(500),
  UPLOAD_MAX_FILE_SIZE_MB: z.coerce.number().default(15),
  MAINTENANCE_MODE: z.coerce.boolean().default(false)
});

export const env = envSchema.parse(process.env);
export const corsOrigins = env.CORS_ORIGINS.split(",").map((origin) => origin.trim());
