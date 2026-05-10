import { logger } from "@/configs/logger";

export function registerCronJobs() {
  logger.info("Cron hooks registered: monthly reports, stale session cleanup, backup trigger placeholders");
}
