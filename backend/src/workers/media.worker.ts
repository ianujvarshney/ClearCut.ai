import { Worker } from "bullmq";
import { connectDatabase } from "@/configs/database";
import { env } from "@/configs/env";
import { logger } from "@/configs/logger";
import { getRedisConnection } from "@/configs/redis";
import { cleanupQueueName, imageOptimizationQueueName, thumbnailQueueName, type ImageJobPayload } from "@/queues/image.queue";
import { publishProcessingEvent } from "@/events/processing-events";

async function startMediaWorkers() {
  await connectDatabase();

  const optimizationWorker = new Worker<ImageJobPayload>(
    imageOptimizationQueueName,
    async (job) => {
      logger.info({ jobId: job.id, images: job.data.imageIds.length }, "Optimizing processed image output");
      await publishProcessingEvent({
        jobId: job.data.processingJobId ?? String(job.id),
        queueJobId: job.id,
        userId: job.data.userId,
        status: "processing",
        progress: 88,
        stage: "optimization"
      });
    },
    { connection: getRedisConnection(), concurrency: Math.max(2, env.AI_JOB_CONCURRENCY) }
  );

  const thumbnailWorker = new Worker<ImageJobPayload>(
    thumbnailQueueName,
    async (job) => {
      logger.info({ jobId: job.id, images: job.data.imageIds.length }, "Generating thumbnails");
      await publishProcessingEvent({
        jobId: job.data.processingJobId ?? String(job.id),
        queueJobId: job.id,
        userId: job.data.userId,
        status: "processing",
        progress: 94,
        stage: "thumbnail-generation"
      });
    },
    { connection: getRedisConnection(), concurrency: 8 }
  );

  const cleanupWorker = new Worker<{ olderThanHours: number }>(
    cleanupQueueName,
    async (job) => {
      logger.info({ jobId: job.id, olderThanHours: job.data.olderThanHours }, "Running temporary storage cleanup");
    },
    { connection: getRedisConnection(), concurrency: 1 }
  );

  for (const worker of [optimizationWorker, thumbnailWorker, cleanupWorker]) {
    worker.on("failed", (job, err) => logger.error({ queue: worker.name, jobId: job?.id, err }, "Media worker job failed"));
  }
}

void startMediaWorkers().catch((error) => {
  logger.fatal({ err: error }, "Failed to start media workers");
  process.exit(1);
});
