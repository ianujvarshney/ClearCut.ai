import { Router } from "express";
import { authenticate } from "@/middlewares/auth.middleware";
import { BillingController } from "../controllers/billing.controller";

export const billingRouter = Router();

billingRouter.post("/webhooks/stripe", BillingController.webhook);
billingRouter.use(authenticate);
billingRouter.post("/checkout", BillingController.checkout);
billingRouter.get("/subscriptions", BillingController.subscriptions);
billingRouter.get("/invoices", BillingController.invoices);
billingRouter.post("/credits", BillingController.credits);
