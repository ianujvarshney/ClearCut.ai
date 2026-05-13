import type { Request, Response } from "express";
import { env } from "@/configs/env";
import { getImageProcessingQueue } from "@/queues/image.queue";

export async function metricsHandler(_req: Request, res: Response) {
  if (!env.METRICS_ENABLED) return res.status(404).end();
  const queue = getImageProcessingQueue();
  const counts = await queue.getJobCounts("waiting", "active", "completed", "failed", "delayed");
  const lines = [
    "# HELP clearcut_api_uptime_seconds API process uptime.",
    "# TYPE clearcut_api_uptime_seconds gauge",
    `clearcut_api_uptime_seconds ${process.uptime()}`,
    "# HELP clearcut_queue_jobs BullMQ image processing jobs by state.",
    "# TYPE clearcut_queue_jobs gauge",
    ...Object.entries(counts).map(([state, value]) => `clearcut_queue_jobs{queue="image-processing",state="${state}"} ${value}`)
  ];
  return res.type("text/plain").send(`${lines.join("\n")}\n`);
}
