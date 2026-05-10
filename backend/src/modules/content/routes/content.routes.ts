import { Router } from "express";
import { z } from "zod";
import { validate } from "@/middlewares/validate.middleware";
import { ContentController } from "../controllers/content.controller";

export const contentRouter = Router();

const contactSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    company: z.string().optional(),
    message: z.string().min(10).max(5000)
  })
});

const newsletterSchema = z.object({
  body: z.object({ email: z.string().email() })
});

contentRouter.post("/contact", validate(contactSchema), ContentController.contact);
contentRouter.post("/newsletter", validate(newsletterSchema), ContentController.newsletter);
contentRouter.get("/blog", ContentController.blogList);
contentRouter.get("/blog/:slug", ContentController.blogDetail);
contentRouter.get("/faqs", ContentController.faqs);
