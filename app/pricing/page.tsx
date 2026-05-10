import { Check } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";

export default function PricingPage() {
  const plans = [
    ["Free", "$0", "Explore the workflow", ["50 credits", "Standard preview", "Batch demo", "Community support"]],
    ["Pro", "$19", "For active creators", ["1,000 credits", "HD downloads", "Brand backgrounds", "Priority processing"]],
    ["Business", "$79", "For teams", ["6,000 credits", "Team seats", "Shared history", "Stripe portal placeholder"]],
    ["Enterprise", "Custom", "For API volume", ["SLA placeholder", "Dedicated limits", "S3/Cloudinary routing", "Security review"]]
  ];

  return (
    <PageShell eyebrow="Pricing" title="Plans that scale with your image volume" body="Start with free credits, upgrade for HD exports, and connect Stripe when you are ready for production billing.">
      <div className="grid gap-5 lg:grid-cols-4">
        {plans.map(([name, price, description, perks], index) => (
          <div key={name as string} className={`rounded-3xl border p-6 shadow-sm ${index === 1 ? "border-indigo-300 bg-white shadow-glow dark:bg-slate-900" : "border-slate-200 bg-white dark:border-white/10 dark:bg-white/5"}`}>
            <p className="font-black">{name}</p>
            <p className="mt-4 text-4xl font-black">{price}</p>
            <p className="mt-2 text-sm text-muted-foreground">{description}</p>
            <div className="mt-6 grid gap-3 text-sm">
              {(perks as string[]).map((perk) => <span key={perk} className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-500" /> {perk}</span>)}
            </div>
            <Button className="mt-7 w-full" variant={index === 1 ? "gradient" : "secondary"}>Choose plan</Button>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
