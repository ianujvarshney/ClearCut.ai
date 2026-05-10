import { stripe } from "@/configs/stripe";
import { ApiError } from "@/utils/ApiError";
import { PaymentModel, SubscriptionModel } from "@/models/Billing.model";

export class BillingService {
  async createCheckoutSession(userId: string, plan: "pro" | "business") {
    if (!stripe) return { provider: "stripe-placeholder", plan, checkoutUrl: `/pricing?checkout=${plan}` };
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      success_url: `${process.env.APP_URL}/dashboard?checkout=success`,
      cancel_url: `${process.env.APP_URL}/pricing?checkout=cancelled`,
      metadata: { userId, plan },
      line_items: [{ price: process.env[`STRIPE_PRICE_${plan.toUpperCase()}`], quantity: 1 }]
    });
    return { checkoutUrl: session.url };
  }

  subscriptions(userId: string) {
    return SubscriptionModel.find({ userId }).sort({ createdAt: -1 });
  }

  invoices(userId: string) {
    return PaymentModel.find({ userId }).sort({ createdAt: -1 }).limit(50);
  }

  async purchaseCredits(userId: string, credits: number) {
    if (credits < 10) throw new ApiError(400, "Minimum credit purchase is 10", "MIN_CREDITS");
    return { userId, credits, checkoutUrl: `/pricing?credits=${credits}`, provider: "stripe-placeholder" };
  }

  webhook(event: unknown) {
    return { received: true, event };
  }
}
