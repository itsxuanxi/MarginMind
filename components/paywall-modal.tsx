"use client";

import * as React from "react";
import { Sparkles, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { startCheckout } from "@/lib/checkout-client";

type PaywallVariant = "export" | "analysis" | "general";

const COPY: Record<PaywallVariant, { headline: string; sub: string; cta: string }> = {
  export: {
    headline: "Unlock Unlimited Reports",
    sub: "Export unlimited executive reports and AI profit recommendations with the Founding Customer plan.",
    cta: "Upgrade Now",
  },
  analysis: {
    headline: "Unlock Full Profit Intelligence",
    sub: "Upgrade to continue monitoring margins, exporting reports, and receiving AI recommendations.",
    cta: "Upgrade to Founding Customer",
  },
  general: {
    headline: "Unlock Full Profit Intelligence",
    sub: "Upgrade to continue monitoring margins, exporting reports, and receiving AI recommendations.",
    cta: "Upgrade to Founding Customer",
  },
};

const PERKS = [
  "Unlimited CSV & PDF exports",
  "Full AI profit recommendations",
  "Continuous margin & leak monitoring",
  "Founding price locked for life — $9.99 CAD/mo",
];

export function PaywallModal({
  open,
  onOpenChange,
  variant = "general",
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  variant?: PaywallVariant;
}) {
  const [loading, setLoading] = React.useState(false);
  const copy = COPY[variant];

  const upgrade = async () => {
    setLoading(true);
    try {
      await startCheckout("founding");
    } catch {
      toast.error("Couldn't start checkout. Please try again.");
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <div className="text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-emerald-500 text-white shadow-sm">
          <Sparkles className="size-6" />
        </div>
        <h2 className="mt-4 text-xl font-semibold tracking-tight">{copy.headline}</h2>
        <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">{copy.sub}</p>

        <ul className="mx-auto mt-5 max-w-xs space-y-2 text-left">
          {PERKS.map((p) => (
            <li key={p} className="flex items-start gap-2.5 text-sm">
              <Check className="mt-0.5 size-4 shrink-0 text-brand" />
              <span className="text-foreground/80">{p}</span>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-col gap-2">
          <Button variant="brand" size="lg" onClick={upgrade} disabled={loading} className="w-full">
            {loading ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
            {copy.cta}
          </Button>
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={loading} className="w-full">
            Maybe Later
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
