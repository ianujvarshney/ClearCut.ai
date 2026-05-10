import mongoose from "mongoose";
import { env } from "./env";
import { logger } from "./logger";

export async function connectDatabase() {
  mongoose.set("strictQuery", true);
  await mongoose.connect(env.MONGO_URI, {
    autoIndex: env.NODE_ENV !== "production",
    maxPoolSize: 20
  });
  logger.info("MongoDB connected");
}

export async function disconnectDatabase() {
  await mongoose.disconnect();
}
