import { z } from "zod";

export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(80).optional(),
    settings: z
      .object({
        locale: z.string().optional(),
        marketingEmails: z.boolean().optional(),
        processingAlerts: z.boolean().optional()
      })
      .optional()
  })
});

export const changePasswordSchema = z.object({
  body: z.object({ password: z.string().min(8).max(128) })
});
