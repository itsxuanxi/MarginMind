"use client";

import * as React from "react";
import Link from "next/link";
import { CheckCircle2, Loader2, AlertTriangle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type State = "verifying" | "success" | "error";

const PLAN_NAME: Record<string, string> = {
  founding: "Founding Customer",
  pro: "Pro",
};

export function CheckoutSuccess({ sessionId }: { sessionId?: string }) {
  const [state, setState] = React.useState<State>(sessionId ? "verifying" : "error");
  const [plan, setPlan] = React.useState<string>("");

  React.useEffect(() => {
    if (!sessionId) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/checkout/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ session_id: sessionId }),
        });
        const data = await res.json().catch(() => ({}));
        if (cancelled) return;
        if (res.ok && data.ok) {
          setPlan(data.plan || "");
          setState("success");
        } else {
          setState("error");
        }
      } catch {
        if (!cancelled) setState("error");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  return (
    <Card className="mx-auto max-w-lg">
      <CardContent className="flex flex-col items-center p-10 text-center">
        {state === "verifying" && (
          <>
            <span className="flex size-14 items-center justify-center rounded-2xl bg-secondary text-muted-foreground">
              <Loader2 className="size-7 animate-spin" />
            </span>
            <h1 className="mt-5 text-xl font-semibold">Confirming your subscription…</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">Verifying your payment with Stripe.</p>
          </>
        )}

        {state === "success" && (
          <>
            <span className="flex size-14 items-center justify-center rounded-2xl bg-[var(--brand-soft)] text-brand-strong">
              <CheckCircle2 className="size-7" />
            </span>
            <h1 className="mt-5 text-2xl font-semibold tracking-tight">You&apos;re subscribed 🎉</h1>
            <p className="mt-2 max-w-sm text-muted-foreground">
              Your {PLAN_NAME[plan] ? <span className="font-semibold text-foreground">{PLAN_NAME[plan]}</span> : "subscription"} plan is active.
              Unlimited exports, full AI recommendations and continuous monitoring are unlocked.
            </p>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
              <Button asChild variant="brand" size="lg">
                <Link href="/dashboard">Go to dashboard <ArrowRight className="size-4" /></Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/billing">View billing</Link>
              </Button>
            </div>
          </>
        )}

        {state === "error" && (
          <>
            <span className="flex size-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
              <AlertTriangle className="size-7" />
            </span>
            <h1 className="mt-5 text-xl font-semibold">We couldn&apos;t confirm your payment</h1>
            <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
              If you completed checkout, your subscription may still be processing — refresh in a
              moment or check the billing page. You were not charged twice.
            </p>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
              <Button asChild variant="brand"><Link href="/billing">Go to billing</Link></Button>
              <Button asChild variant="outline"><Link href="/pricing">Back to pricing</Link></Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
