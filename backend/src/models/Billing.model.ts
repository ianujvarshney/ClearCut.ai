import { Schema, model, Types } from "mongoose";

const subscriptionSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: "User", required: true, index: true },
    stripeCustomerId: { type: String, index: true },
    stripeSubscriptionId: { type: String, index: true },
    plan: { type: String, enum: ["free", "pro", "business", "enterprise"], default: "free" },
    status: { type: String, enum: ["trialing", "active", "past_due", "canceled", "incomplete"], default: "active" },
    currentPeriodStart: Date,
    currentPeriodEnd: Date,
    cancelAtPeriodEnd: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const paymentSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: "User", required: true, index: true },
    stripePaymentIntentId: String,
    stripeInvoiceId: String,
    amount: { type: Number, required: true },
    currency: { type: String, default: "usd" },
    status: { type: String, enum: ["pending", "paid", "failed", "refunded"], default: "pending", index: true },
    metadata: Schema.Types.Mixed
  },
  { timestamps: true }
);

const creditLedgerSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: "User", required: true, index: true },
    amount: { type: Number, required: true },
    reason: { type: String, enum: ["signup", "purchase", "subscription", "processing", "refund", "admin_adjustment"], required: true },
    balanceAfter: { type: Number, required: true },
    referenceId: String
  },
  { timestamps: true }
);

creditLedgerSchema.index({ userId: 1, createdAt: -1 });
export const SubscriptionModel = model("Subscription", subscriptionSchema);
export const PaymentModel = model("Payment", paymentSchema);
export const CreditLedgerModel = model("CreditLedger", creditLedgerSchema);
