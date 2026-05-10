import { Worker } from "bullmq";
import { getRedisConnection } from "@/configs/redis";
import { logger } from "@/configs/logger";
import { connectDatabase } from "@/configs/database";
import { imageQueueName, type ImageJobPayload } from "@/queues/image.queue";
import { ImageModel } from "@/models/Image.model";
import { ProcessingJobModel } from "@/models/ProcessingJob.model";
import { MockBackgroundProvider } from "@/modules/images/services/ai-provider.service";

const provider = new MockBackgroundProvider();

async function startWorker() {
  await connectDatabase();
  const worker = new Worker<ImageJobPayload>(
    imageQueueName,
    async (job) => {
      await ProcessingJobModel.findOneAndUpdate({ queueJobId: job.id }, { status: "processing", progress: 10, $inc: { attempts: 1 } });
      for (const imageId of job.data.imageIds) {
        const image = await ImageModel.findByIdAndUpdate(imageId, { status: "processing" }, { new: true });
        if (!image) continue;
        const result = await provider.removeBackground({ sourceUrl: image.original?.url ?? "", background: job.data.background });
        await ImageModel.findByIdAndUpdate(imageId, {
          status: "completed",
          processed: result
        });
      }
      await ProcessingJobModel.findOneAndUpdate({ queueJobId: job.id }, { status: "completed", progress: 100, completedAt: new Date() });
    },
    { connection: getRedisConnection(), concurrency: 5 }
  );

  worker.on("completed", (job) => logger.info({ jobId: job.id }, "Image job completed"));
  worker.on("failed", (job, err) => logger.error({ jobId: job?.id, err }, "Image job failed"));
}

void startWorker();
