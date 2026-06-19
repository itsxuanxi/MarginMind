"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Check, Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/misc";
import { PLANS, type PlanId } from "@/lib/plans";
import { formatCurrency } from "@/lib/format";

export function PricingCards({ compact = false }: { compact?: boolean }) {
  const [founding, setFounding] = React.useState(true);
  const [loading, setLoading] = React.useState<PlanId | null>(null);
  const router = useRouter();

  const checkout = async (plan: PlanId) => {
    if (plan === "enterprise") {
      router.push("/contact");
      return;
    }
    setLoading(plan);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, founding }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        // Demo mode — no Stripe keys. Continue into the trial flow.
        toast.success("Starting your 14-day free trial (demo mode).");
        router.push(`/sign-up?plan=${plan}`);
      }
    } catch {
      router.push(`/sign-up?plan=${plan}`);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center gap-3">
        <span className={cn("text-sm font-medium", !founding && "text-muted-foreground")}>
          Founding Customer pricing
        </span>
        <Switch checked={founding} onCheckedChange={setFounding} />
        <span className="text-sm text-muted-foreground">Standard</span>
        {founding && (
          <Badge variant="success" className="ml-1">
            <Sparkles className="size-3" /> 40% off
          </Badge>
        )}
      </div>

      <div className="grid gap-5 lg:grid-cols-4">
        {PLANS.map((plan) => {
          const isCustom = plan.price === null;
          const price = founding && plan.foundingPrice ? plan.foundingPrice : plan.price;
          return (
            <div
              key={plan.id}
              className={cn(
                "relative flex flex-col rounded-2xl border bg-card p-6 transition-shadow",
                plan.popular
                  ? "border-brand shadow-[0_0_0_1px_var(--brand),0_20px_40px_-20px_rgba(15,157,110,0.4)]"
                  : "border-border hover:shadow-lg"
              )}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand px-3 py-1 text-xs font-semibold text-white shadow">
                  Most Popular
                </span>
              )}
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{plan.name}</h3>
              </div>
              <p className="mt-1 min-h-10 text-sm text-muted-foreground">{plan.tagline}</p>

              <div className="mt-4 flex items-end gap-1.5">
                {isCustom ? (
                  <span className="text-3xl font-semibold tracking-tight">Custom</span>
                ) : (
                  <>
                    {founding && plan.foundingPrice && (
                      <span className="mb-1 text-base text-muted-foreground line-through">
                        {formatCurrency(plan.price!)}
                      </span>
                    )}
                    <span className="text-4xl font-semibold tracking-tight">
                      {formatCurrency(price as number)}
                    </span>
                    <span className="mb-1.5 text-sm text-muted-foreground">{plan.cadence}</span>
                  </>
                )}
              </div>

              <Button
                onClick={() => checkout(plan.id)}
                disabled={loading === plan.id}
                variant={plan.popular ? "brand" : "outline"}
                className="mt-5 w-full"
              >
                {loading === plan.id && <Loader2 className="size-4 animate-spin" />}
                {plan.cta}
              </Button>

              {!compact && (
                <ul className="mt-6 space-y-2.5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <Check className="mt-0.5 size-4 shrink-0 text-brand" />
                      <span className="text-foreground/80">{f}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
      <p className="text-center text-sm text-muted-foreground">
        All plans include a 14-day free trial. No credit card required to start.
      </p>
    </div>
  );
}
