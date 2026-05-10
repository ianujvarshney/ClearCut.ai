import type { Server as HttpServer } from "http";
import { Server } from "socket.io";
import { corsOrigins } from "@/configs/env";
import { logger } from "@/configs/logger";

export function attachSockets(server: HttpServer) {
  const io = new Server(server, {
    cors: { origin: corsOrigins, credentials: true }
  });

  io.on("connection", (socket) => {
    logger.info({ socketId: socket.id }, "Socket connected");
    socket.on("processing:subscribe", (jobId: string) => socket.join(`job:${jobId}`));
    socket.on("disconnect", () => logger.info({ socketId: socket.id }, "Socket disconnected"));
  });

  return io;
}
