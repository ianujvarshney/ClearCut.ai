import { asyncHandler } from "@/utils/asyncHandler";
import { BillingService } from "../services/billing.service";

const service = new BillingService();

export const BillingController = {
  checkout: asyncHandler(async (req, res) => {
    res.json({ success: true, data: await service.createCheckoutSession(req.user!.id, req.body.plan ?? "pro") });
  }),
  subscriptions: asyncHandler(async (req, res) => {
    res.json({ success: true, data: await service.subscriptions(req.user!.id) });
  }),
  invoices: asyncHandler(async (req, res) => {
    res.json({ success: true, data: await service.invoices(req.user!.id) });
  }),
  credits: asyncHandler(async (req, res) => {
    res.json({ success: true, data: await service.purchaseCredits(req.user!.id, Number(req.body.credits ?? 100)) });
  }),
  webhook: asyncHandler(async (req, res) => {
    res.json({ success: true, data: service.webhook(req.body) });
  })
};
