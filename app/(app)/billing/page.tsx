"use client";

import * as React from "react";
import {
  CreditCard,
  Check,
  ExternalLink,
  Loader2,
  Download,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader, SectionHeading } from "@/components/shared";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/misc";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { PLANS, type PlanId } from "@/lib/plans";
import { formatCurrency, formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

const CURRENT: PlanId = "growth";
const STATUS = "trialing"; // trialing | active | past_due | canceled | unpaid
const RENEWAL = new Date(Date.now() + 9 * 86400000);

const USAGE = [
  { label: "Orders this month", used: 3240, limit: 5000 },
  { label: "Connected stores", used: 3, limit: 3 },
  { label: "AI queries", used: 142, limit: 1000 },
];

const INVOICES = [
  { id: "INV-1042", date: new Date(Date.now() - 2 * 86400000), amount: 59, status: "Trial" },
  { id: "INV-1018", date: new Date(Date.now() - 32 * 86400000), amount: 59, status: "Paid" },
  { id: "INV-0994", date: new Date(Date.now() - 62 * 86400000), amount: 59, status: "Paid" },
];

export default function BillingPage() {
  const [loading, setLoading] = React.useState<string | null>(null);
  const plan = PLANS.find((p) => p.id === CURRENT)!;

  const openPortal = async () => {
    setLoading("portal");
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else toast.info("Stripe isn't configured — this is the demo billing view.");
    } catch {
      toast.error("Couldn't open the billing portal.");
    } finally {
      setLoading(null);
    }
  };

  const changePlan = async (target: PlanId) => {
    if (target === "enterprise") { window.location.href = "/contact"; return; }
    setLoading(target);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: target }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else toast.success(`Plan change to ${target} recorded (demo mode).`);
    } catch {
      toast.error("Couldn't start checkout.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Billing" description="Manage your plan, usage and invoices." />

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Current plan */}
        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-semibold">{plan.name} plan</h2>
                  <Badge variant={STATUS === "trialing" ? "info" : "success"} className="capitalize">{STATUS}</Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{plan.tagline}</p>
                <p className="mt-4 flex items-baseline gap-1">
                  <span className="tabular text-3xl font-semibold">{formatCurrency(plan.foundingPrice!)}</span>
                  <span className="text-sm text-muted-foreground">/month · founding price</span>
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {STATUS === "trialing" ? "Trial ends" : "Renews"} on <span className="font-medium text-foreground">{formatDate(RENEWAL, "long")}</span>
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <Button variant="default" onClick={openPortal} disabled={loading === "portal"}>
                  {loading === "portal" ? <Loader2 className="size-4 animate-spin" /> : <CreditCard className="size-4" />}
                  Manage billing
                </Button>
                <Button variant="ghost" size="sm" onClick={openPortal}>
                  <ExternalLink className="size-3.5" /> Update payment method
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Usage */}
        <Card>
          <CardHeader className="pb-2"><CardTitle>Usage this period</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {USAGE.map((u) => {
              const pct = (u.used / u.limit) * 100;
              return (
                <div key={u.label}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{u.label}</span>
                    <span className="tabular font-medium">{u.used.toLocaleString()} / {u.limit.toLocaleString()}</span>
                  </div>
                  <Progress value={pct} indicatorClassName={pct > 85 ? "bg-amber-500" : undefined} />
                </div>
              );
            })}
            <div className="rounded-lg border border-brand/20 bg-[var(--brand-soft)] p-3 text-sm text-brand-strong">
              <Zap className="mr-1 inline size-4" /> Approaching your order limit? Upgrade to Scale for 50,000 orders/mo.
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Plan switcher */}
      <Card>
        <CardHeader><SectionHeading title="Change plan" description="Upgrade or downgrade anytime. Changes are prorated." /></CardHeader>
        <CardContent className="grid gap-4 lg:grid-cols-4">
          {PLANS.map((p) => {
            const isCurrent = p.id === CURRENT;
            return (
              <div key={p.id} className={cn("rounded-xl border p-4", isCurrent ? "border-brand bg-[var(--brand-soft)]/30" : "border-border")}>
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{p.name}</h3>
                  {isCurrent && <Badge variant="success">Current</Badge>}
                </div>
                <p className="mt-2 tabular text-2xl font-semibold">
                  {p.price === null ? "Custom" : formatCurrency(p.foundingPrice!)}
                  {p.price !== null && <span className="text-sm font-normal text-muted-foreground">/mo</span>}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{p.limits.orders}</p>
                <Button
                  variant={isCurrent ? "outline" : "brand"}
                  size="sm"
                  className="mt-4 w-full"
                  disabled={isCurrent || loading === p.id}
                  onClick={() => changePlan(p.id)}
                >
                  {loading === p.id && <Loader2 className="size-4 animate-spin" />}
                  {isCurrent ? "Current plan" : p.id === "enterprise" ? "Contact Sales" : "Switch"}
                </Button>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Invoices */}
      <Card>
        <CardHeader className="pb-2"><CardTitle>Invoices</CardTitle></CardHeader>
        <CardContent className="px-0 pb-2">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Invoice</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Receipt</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {INVOICES.map((inv) => (
                <TableRow key={inv.id}>
                  <TableCell className="font-medium">{inv.id}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{formatDate(inv.date)}</TableCell>
                  <TableCell className="tabular text-right">{formatCurrency(inv.amount)}</TableCell>
                  <TableCell><Badge variant={inv.status === "Paid" ? "success" : "info"}>{inv.status}</Badge></TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="xs" onClick={() => toast.success("Downloading receipt…")}><Download className="size-3.5" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="border-red-200">
        <CardContent className="flex flex-wrap items-center justify-between gap-3 p-5">
          <div>
            <h3 className="font-semibold">Cancel subscription</h3>
            <p className="text-sm text-muted-foreground">You&apos;ll keep access until the end of your billing period.</p>
          </div>
          <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-50" onClick={() => toast("Opening cancellation flow…")}>
            Cancel plan
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
