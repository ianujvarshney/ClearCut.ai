import 'module-alias/register';
import http from "http";
import { createApp } from "@/app";
import { connectDatabase, disconnectDatabase } from "@/configs/database";
import { env } from "@/configs/env";
import { logger } from "@/configs/logger";
import { attachSockets } from "@/sockets";

async function bootstrap() {
  await connectDatabase();
  const app = createApp();
  const server = http.createServer(app);
  attachSockets(server);

  server.listen(env.PORT, () => {
    logger.info({ port: env.PORT, prefix: env.API_PREFIX }, "ClearCut API listening");
  });

  const shutdown = async (signal: string) => {
    logger.info({ signal }, "Shutting down API");
    server.close(async () => {
      await disconnectDatabase();
      process.exit(0);
    });
  };

  process.on("SIGTERM", () => void shutdown("SIGTERM"));
  process.on("SIGINT", () => void shutdown("SIGINT"));
}

void bootstrap().catch((error) => {
  logger.fatal({ err: error }, "Failed to start API");
  process.exit(1);
});
