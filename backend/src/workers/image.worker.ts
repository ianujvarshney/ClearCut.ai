import { Worker } from "bullmq";
import { getRedisConnection } from "@/configs/redis";
import { logger } from "@/configs/logger";
import { env } from "@/configs/env";
import { connectDatabase } from "@/configs/database";
import { publishProcessingEvent } from "@/events/processing-events";
import { getImageOptimizationQueue, getThumbnailQueue, imageQueueName, type ImageJobPayload } from "@/queues/image.queue";
import { ImageModel } from "@/models/Image.model";
import { ProcessingJobModel } from "@/models/ProcessingJob.model";
import { createBackgroundProvider } from "@/modules/images/services/ai-provider.service";

const provider = createBackgroundProvider();

async function updateProgress(jobId: string | undefined, queueJobId: string | undefined, userId: string, progress: number, stage: string, status: "queued" | "processing" | "completed" | "failed" | "retrying" = "processing") {
  if (jobId) {
    await ProcessingJobModel.findByIdAndUpdate(jobId, { status, progress });
  }
  await publishProcessingEvent({ jobId: jobId ?? String(queueJobId), queueJobId, userId, status, progress, stage });
}

async function startWorker() {
  await connectDatabase();
  const worker = new Worker<ImageJobPayload>(
    imageQueueName,
    async (job) => {
      const processingJobId = job.data.processingJobId;
      await ProcessingJobModel.findOneAndUpdate({ queueJobId: job.id }, { status: "processing", progress: 10, $inc: { attempts: 1 } });
      await updateProgress(processingJobId, job.id, job.data.userId, 10, "job-started");
      for (const imageId of job.data.imageIds) {
        const image = await ImageModel.findByIdAndUpdate(imageId, { status: "processing" }, { new: true });
        if (!image) continue;
        await updateProgress(processingJobId, job.id, job.data.userId, 35, "ai-inference", "processing");
        const result = await provider.removeBackground({
          sourceUrl: image.original?.url ?? "",
          background: job.data.background,
          model: job.data.model,
          requestId: job.id
        });
        await ImageModel.findByIdAndUpdate(imageId, {
          status: "completed",
          processed: result
        });
        await publishProcessingEvent({ jobId: processingJobId ?? String(job.id), queueJobId: job.id, userId: job.data.userId, imageId, status: "processing", progress: 75, stage: "image-processed" });
      }
      await getImageOptimizationQueue().add("optimize-image", job.data);
      await getThumbnailQueue().add("generate-thumbnail", job.data);
      await ProcessingJobModel.findOneAndUpdate({ queueJobId: job.id }, { status: "completed", progress: 100, completedAt: new Date() });
      await updateProgress(processingJobId, job.id, job.data.userId, 100, "completed", "completed");
    },
    { connection: getRedisConnection(), concurrency: env.AI_JOB_CONCURRENCY }
  );

  worker.on("completed", (job) => logger.info({ jobId: job.id }, "Image job completed"));
  worker.on("failed", (job, err) => {
    logger.error({ jobId: job?.id, err }, "Image job failed");
    void ProcessingJobModel.findOneAndUpdate(
      { queueJobId: job?.id },
      { status: job?.attemptsMade && job.opts.attempts && job.attemptsMade < job.opts.attempts ? "retrying" : "failed", error: err.message }
    );
    if (job) {
      void publishProcessingEvent({
        jobId: job.data.processingJobId ?? String(job.id),
        queueJobId: job.id,
        userId: job.data.userId,
        status: job.attemptsMade < Number(job.opts.attempts ?? 1) ? "retrying" : "failed",
        progress: 0,
        stage: "failed",
        error: err.message
      });
    }
  });
}

void startWorker();
