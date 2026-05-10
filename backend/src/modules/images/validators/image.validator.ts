import { z } from "zod";

const backgroundSchema = z.object({
  type: z.enum(["transparent", "white", "color", "image"]).default("transparent"),
  value: z.string().optional()
});

export const processImageSchema = z.object({
  body: z.object({
    imageId: z.string().min(12),
    background: backgroundSchema.optional()
  })
});

export const batchProcessSchema = z.object({
  body: z.object({
    imageIds: z.array(z.string().min(12)).min(1).max(25),
    background: backgroundSchema.optional()
  })
});
