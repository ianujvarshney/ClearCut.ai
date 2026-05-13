import type { Server as HttpServer } from "http";
import { Server } from "socket.io";
import { corsOrigins } from "@/configs/env";
import { logger } from "@/configs/logger";
import { getRedisConnection } from "@/configs/redis";
import { processingEventsChannel, type ProcessingEvent } from "@/events/processing-events";

export function attachSockets(server: HttpServer) {
  const io = new Server(server, {
    cors: { origin: corsOrigins, credentials: true }
  });

  io.on("connection", (socket) => {
    logger.info({ socketId: socket.id }, "Socket connected");
    socket.on("processing:subscribe", (jobId: string) => socket.join(`job:${jobId}`));
    socket.on("disconnect", () => logger.info({ socketId: socket.id }, "Socket disconnected"));
  });

  const subscriber = getRedisConnection().duplicate();
  void subscriber.subscribe(processingEventsChannel);
  subscriber.on("message", (_channel, payload) => {
    try {
      const event = JSON.parse(payload) as ProcessingEvent;
      io.to(`job:${event.jobId}`).emit("processing:update", event);
      if (event.queueJobId) io.to(`job:${event.queueJobId}`).emit("processing:update", event);
      if (event.userId) io.to(`user:${event.userId}`).emit("processing:update", event);
    } catch (error) {
      logger.warn({ err: error }, "Failed to parse processing event");
    }
  });

  return io;
}
