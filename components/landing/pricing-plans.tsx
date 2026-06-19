"use client";

import * as React from "react";
import { Check, Sparkles, Flame, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { startCheckout } from "@/lib/checkout-client";

interface Plan {
  id: "founding" | "pro";
  name: string;
  price: string;
  futurePrice: string;
  save: string;
  tagline: string;
  badge?: string;
  note?: string;
  popular?: boolean;
  features: string[];
}

const PLANS: Plan[] = [
  {
    id: "founding",
    name: "Founding Customer",
    price: "9.99",
    futurePrice: "29.99",
    save: "Save 67%",
    tagline: "For early believers who want true profit visibility — locked in for life.",
    badge: "Most Popular",
    note: "Limited to the first 50 customers",
    popular: true,
    features: [
      "Profit Dashboard & SKU analysis",
      "Profit Leak Detection",
      "AI Profit Agent",
      "3 stores · 5,000 orders / month",
      "Multi-channel analysis",
      "Founding price locked for life",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: "29.99",
    futurePrice: "99.99",
    save: "Save 70%",
    tagline: "For growing brands scaling across markets and channels.",
    features: [
      "Everything in Founding",
      "Unlimited stores",
      "50,000 orders / month",
      "Advanced AI Profit Agent",
      "Team access & roles",
      "API access & priority support",
    ],
  },
];

export function PricingPlans() {
  const [loading, setLoading] = React.useState<Plan["id"] | null>(null);

  const onCheckout = async (id: Plan["id"]) => {
    setLoading(id);
    try {
      await startCheckout(id);
    } catch {
      toast.error("Couldn't start checkout. Please try again.");
      setLoading(null);
    }
  };

  return (
    <div className="mx-auto grid max-w-4xl gap-6 lg:grid-cols-2">
      {PLANS.map((plan) => (
        <div
          key={plan.id}
          className={cn(
            "group relative flex flex-col rounded-3xl border bg-card p-7 transition-all duration-300 hover:-translate-y-1.5",
            plan.popular
              ? "border-brand shadow-[0_0_0_1px_var(--brand),0_24px_50px_-24px_rgba(15,157,110,0.45)] hover:shadow-[0_0_0_1px_var(--brand),0_32px_60px_-24px_rgba(15,157,110,0.55)]"
              : "border-border shadow-sm hover:border-brand/30 hover:shadow-xl"
          )}
        >
          {plan.badge && (
            <span className="absolute -top-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1 rounded-full bg-brand px-3 py-1 text-xs font-semibold text-white shadow">
              <Sparkles className="size-3" /> {plan.badge}
            </span>
          )}

          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold tracking-tight">{plan.name}</h3>
            <span className="rounded-full bg-[var(--brand-soft)] px-2.5 py-1 text-xs font-semibold text-brand-strong">
              {plan.save}
            </span>
          </div>
          <p className="mt-1.5 min-h-10 text-sm text-muted-foreground">{plan.tagline}</p>

          <div className="mt-5 flex items-end gap-1.5">
            <span className="text-5xl font-semibold tracking-tight">${plan.price}</span>
            <span className="mb-2 text-sm text-muted-foreground">CAD / month</span>
          </div>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Future price{" "}
            <span className="font-medium text-foreground/70 line-through">${plan.futurePrice} CAD</span>
          </p>

          {plan.note && (
            <p className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1.5 text-xs font-medium text-amber-800">
              <Flame className="size-3.5" /> {plan.note}
            </p>
          )}

          <Button
            onClick={() => onCheckout(plan.id)}
            disabled={loading !== null}
            variant={plan.popular ? "brand" : "outline"}
            size="lg"
            className="mt-6 w-full"
          >
            {loading === plan.id ? <Loader2 className="size-4 animate-spin" /> : null}
            Start Free Trial
          </Button>

          <ul className="mt-6 space-y-2.5">
            {plan.features.map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-sm">
                <Check className="mt-0.5 size-4 shrink-0 text-brand" />
                <span className="text-foreground/80">{f}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
