"use client";

import * as React from "react";
import { CreditCard, Loader2, Sparkles, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { startCheckout, openBillingPortal } from "@/lib/checkout-client";

export function ManageBillingButton({ className }: { className?: string }) {
  const [loading, setLoading] = React.useState(false);
  const onClick = async () => {
    setLoading(true);
    try {
      const opened = await openBillingPortal();
      if (!opened) {
        toast.error("No active subscription found to manage yet.");
        setLoading(false);
      }
    } catch {
      toast.error("Couldn't open the billing portal. Please try again.");
      setLoading(false);
    }
  };
  return (
    <Button variant="default" onClick={onClick} disabled={loading} className={className}>
      {loading ? <Loader2 className="size-4 animate-spin" /> : <CreditCard className="size-4" />}
      Manage billing
    </Button>
  );
}

export function UpgradeButton({
  plan = "founding",
  label = "Upgrade to Founding Customer",
  className,
}: {
  plan?: "founding" | "pro";
  label?: string;
  className?: string;
}) {
  const [loading, setLoading] = React.useState(false);
  const onClick = async () => {
    setLoading(true);
    try {
      await startCheckout(plan);
    } catch {
      toast.error("Couldn't start checkout. Please try again.");
      setLoading(false);
    }
  };
  return (
    <Button variant="brand" onClick={onClick} disabled={loading} className={className}>
      {loading ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
      {label}
    </Button>
  );
}

export function PortalLinkButton({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = React.useState(false);
  const onClick = async () => {
    setLoading(true);
    const opened = await openBillingPortal().catch(() => false);
    if (!opened) {
      toast.error("No active subscription found to manage yet.");
      setLoading(false);
    }
  };
  return (
    <Button variant="ghost" size="sm" onClick={onClick} disabled={loading}>
      {loading ? <Loader2 className="size-3.5 animate-spin" /> : <ExternalLink className="size-3.5" />}
      {children}
    </Button>
  );
}
