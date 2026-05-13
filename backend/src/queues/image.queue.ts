import { Queue, QueueEvents } from "bullmq";
import { getRedisConnection } from "@/configs/redis";

export type ImageJobPayload = {
  processingJobId?: string;
  userId: string;
  imageIds: string[];
  background: { type: "transparent" | "white" | "color" | "image"; value?: string };
  model?: "u2net" | "rmbg" | "modnet" | "onnx-u2net";
  priority?: "standard" | "high" | "batch";
  requestedAt?: string;
};

export const imageQueueName = "image-processing";
export const imageOptimizationQueueName = "image-optimization";
export const thumbnailQueueName = "thumbnail-generation";
export const cleanupQueueName = "storage-cleanup";

let imageProcessingQueue: Queue<ImageJobPayload> | undefined;
let imageOptimizationQueue: Queue<ImageJobPayload> | undefined;
let thumbnailQueue: Queue<ImageJobPayload> | undefined;
let cleanupQueue: Queue<{ olderThanHours: number }> | undefined;
let imageQueueEvents: QueueEvents | undefined;

const defaultJobOptions = {
  attempts: 3,
  backoff: { type: "exponential" as const, delay: 3000 },
  removeOnComplete: 1000,
  removeOnFail: 5000
};

export function getImageProcessingQueue() {
  if (!imageProcessingQueue) {
    imageProcessingQueue = new Queue<ImageJobPayload>(imageQueueName, {
      connection: getRedisConnection(),
      defaultJobOptions
    });
  }
  return imageProcessingQueue;
}

export function getImageOptimizationQueue() {
  if (!imageOptimizationQueue) {
    imageOptimizationQueue = new Queue<ImageJobPayload>(imageOptimizationQueueName, {
      connection: getRedisConnection(),
      defaultJobOptions
    });
  }
  return imageOptimizationQueue;
}

export function getThumbnailQueue() {
  if (!thumbnailQueue) {
    thumbnailQueue = new Queue<ImageJobPayload>(thumbnailQueueName, {
      connection: getRedisConnection(),
      defaultJobOptions
    });
  }
  return thumbnailQueue;
}

export function getCleanupQueue() {
  if (!cleanupQueue) {
    cleanupQueue = new Queue<{ olderThanHours: number }>(cleanupQueueName, {
      connection: getRedisConnection(),
      defaultJobOptions: {
        attempts: 2,
        backoff: { type: "exponential", delay: 60000 },
        removeOnComplete: 100,
        removeOnFail: 1000
      }
    });
  }
  return cleanupQueue;
}

export function getImageQueueEvents() {
  if (!imageQueueEvents) {
    imageQueueEvents = new QueueEvents(imageQueueName, { connection: getRedisConnection() });
  }
  return imageQueueEvents;
}

export async function closeImageQueue() {
  await Promise.all([
    imageProcessingQueue?.close(),
    imageOptimizationQueue?.close(),
    thumbnailQueue?.close(),
    cleanupQueue?.close(),
    imageQueueEvents?.close()
  ]);
  imageProcessingQueue = undefined;
  imageOptimizationQueue = undefined;
  thumbnailQueue = undefined;
  cleanupQueue = undefined;
  imageQueueEvents = undefined;
}
