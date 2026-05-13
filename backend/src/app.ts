import express from "express";
import swaggerUi from "swagger-ui-express";
import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { ExpressAdapter } from "@bull-board/express";
import { env } from "@/configs/env";
import { swaggerSpec } from "@/configs/swagger";
import { metricsHandler } from "@/configs/metrics";
import { getCleanupQueue, getImageOptimizationQueue, getImageProcessingQueue, getThumbnailQueue } from "@/queues/image.queue";
import { applySecurity } from "@/middlewares/security.middleware";
import { errorHandler, notFoundHandler } from "@/middlewares/error.middleware";
import { apiRouter } from "@/routes";

export function createApp() {
  const app = express();

  applySecurity(app);
  app.use("/api/v1/billing/webhooks/stripe", express.raw({ type: "application/json" }));
  app.use(express.json({ limit: "2mb" }));
  app.use(express.urlencoded({ extended: true, limit: "2mb" }));

  if (env.NODE_ENV !== "test") {
    const bullServerAdapter = new ExpressAdapter();
    bullServerAdapter.setBasePath("/admin/queues");
    createBullBoard({
      queues: [
        new BullMQAdapter(getImageProcessingQueue()),
        new BullMQAdapter(getImageOptimizationQueue()),
        new BullMQAdapter(getThumbnailQueue()),
        new BullMQAdapter(getCleanupQueue())
      ],
      serverAdapter: bullServerAdapter
    });
    app.use("/admin/queues", bullServerAdapter.getRouter());
  }

  app.get("/health", (_req, res) => {
    res.json({
      success: true,
      data: {
        service: "clearcut-api",
        environment: env.NODE_ENV,
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
      }
    });
  });
  app.get("/metrics", metricsHandler);
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.use(env.API_PREFIX, apiRouter);
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
