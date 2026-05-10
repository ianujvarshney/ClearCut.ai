import IORedis from "ioredis";
import { env } from "./env";

let redisConnection: IORedis | undefined;

export function getRedisConnection() {
  if (!redisConnection) {
    redisConnection = new IORedis({
      host: env.REDIS_HOST,
      port: env.REDIS_PORT,
      password: env.REDIS_PASSWORD,
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
      lazyConnect: env.NODE_ENV === "test"
    });
  }
  return redisConnection;
}

export async function closeRedisConnection() {
  if (redisConnection) {
    await redisConnection.quit();
    redisConnection = undefined;
  }
}
