import { Queue, QueueEvents } from "bullmq";
import { getRedisConnection } from "@/configs/redis";

export type ImageJobPayload = {
  userId: string;
  imageIds: string[];
  background: { type: "transparent" | "white" | "color" | "image"; value?: string };
};

export const imageQueueName = "image-processing";

let imageProcessingQueue: Queue<ImageJobPayload> | undefined;
let imageQueueEvents: QueueEvents | undefined;

export function getImageProcessingQueue() {
  if (!imageProcessingQueue) {
    imageProcessingQueue = new Queue<ImageJobPayload>(imageQueueName, {
      connection: getRedisConnection(),
      defaultJobOptions: {
        attempts: 3,
        backoff: { type: "exponential", delay: 3000 },
        removeOnComplete: 1000,
        removeOnFail: 5000
      }
    });
  }
  return imageProcessingQueue;
}

export function getImageQueueEvents() {
  if (!imageQueueEvents) {
    imageQueueEvents = new QueueEvents(imageQueueName, { connection: getRedisConnection() });
  }
  return imageQueueEvents;
}

export async function closeImageQueue() {
  await Promise.all([imageProcessingQueue?.close(), imageQueueEvents?.close()]);
  imageProcessingQueue = undefined;
  imageQueueEvents = undefined;
}
