import { getRedisConnection } from "@/configs/redis";

export type ProcessingEvent = {
  jobId: string;
  queueJobId?: string;
  userId?: string;
  status: "queued" | "processing" | "completed" | "failed" | "retrying";
  progress: number;
  stage?: string;
  etaSeconds?: number;
  imageId?: string;
  error?: string;
  at: string;
};

export const processingEventsChannel = "processing-events";

export async function publishProcessingEvent(event: Omit<ProcessingEvent, "at"> & { at?: string }) {
  const payload: ProcessingEvent = { ...event, at: event.at ?? new Date().toISOString() };
  await getRedisConnection().publish(processingEventsChannel, JSON.stringify(payload));
}
