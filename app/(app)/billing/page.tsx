import { Zap, Receipt } from "lucide-react";
import { PageHeader, SectionHeading } from "@/components/shared";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/misc";
import { PricingPlans } from "@/components/landing/pricing-plans";
import { ManageBillingButton, UpgradeButton, PortalLinkButton } from "@/components/billing-controls";
import {
  getEntitlements,
  FREE_EXPORT_LIMIT,
  FREE_ANALYSIS_LIMIT,
} from "@/lib/entitlements";
import { formatDate } from "@/lib/format";

export const metadata = { title: "Billing" };

const PLAN_LABEL: Record<string, { name: string; price: string }> = {
  free: { name: "Free", price: "$0" },
  founding: { name: "Founding Customer", price: "$9.99 CAD / mo" },
  pro: { name: "Pro", price: "$29.99 CAD / mo" },
};

export default async function BillingPage() {
  const e = await getEntitlements();
  const label = PLAN_LABEL[e.plan] ?? PLAN_LABEL.free;
  const statusVariant =
    e.status === "active" ? "success" : e.status === "trialing" ? "info" : e.status === "past_due" || e.status === "unpaid" ? "danger" : "default";

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
                  <h2 className="text-xl font-semibold">{label.name} plan</h2>
                  {e.isPaid ? (
                    <Badge variant={statusVariant} className="capitalize">{e.status}</Badge>
                  ) : (
                    <Badge variant="default">Free</Badge>
                  )}
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {e.isPaid
                    ? "Full access — unlimited analyses, exports and AI recommendations."
                    : "Sample access — one free export and one AI analysis. Upgrade to unlock everything."}
                </p>
                <p className="mt-4 flex items-baseline gap-1">
                  <span className="tabular text-3xl font-semibold">{label.price}</span>
                </p>
                {e.currentPeriodEnd && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    {e.status === "trialing" ? "Trial ends" : "Renews"} on{" "}
                    <span className="font-medium text-foreground">{formatDate(e.currentPeriodEnd, "long")}</span>
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                {e.isPaid ? (
                  <>
                    <ManageBillingButton />
                    <PortalLinkButton>Update payment method</PortalLinkButton>
                  </>
                ) : (
                  <UpgradeButton />
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Usage */}
        <Card>
          <CardHeader className="pb-2"><CardTitle>Usage</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <UsageRow label="Exports" used={e.exportCount} limit={e.isPaid ? null : FREE_EXPORT_LIMIT} />
            <UsageRow label="AI analyses" used={e.analysisCount} limit={e.isPaid ? null : FREE_ANALYSIS_LIMIT} />
            {!e.isPaid && (
              <div className="rounded-lg border border-brand/20 bg-[var(--brand-soft)] p-3 text-sm text-brand-strong">
                <Zap className="mr-1 inline size-4" /> Upgrade for unlimited exports, analyses and full AI recommendations.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Plans */}
      <Card>
        <CardHeader><SectionHeading title={e.isPaid ? "Change plan" : "Upgrade your plan"} description="Founding pricing is locked for life. 14-day free trial on every plan." /></CardHeader>
        <CardContent>
          <PricingPlans />
        </CardContent>
      </Card>

      {/* Invoices */}
      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle>Invoices</CardTitle>
          {e.isPaid && <PortalLinkButton>View in portal</PortalLinkButton>}
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-10 text-center">
            <span className="flex size-11 items-center justify-center rounded-xl bg-secondary text-muted-foreground"><Receipt className="size-5" /></span>
            <p className="mt-3 text-sm font-medium">
              {e.isPaid ? "Invoices are managed in the Stripe billing portal" : "No invoices yet"}
            </p>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              {e.isPaid
                ? "Open the billing portal to download receipts and view payment history."
                : "Start a plan to see invoices and receipts here."}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function UsageRow({ label, used, limit }: { label: string; used: number; limit: number | null }) {
  const pct = limit ? Math.min(100, (used / limit) * 100) : 100;
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="tabular font-medium">
          {used} / {limit ?? "∞"}
        </span>
      </div>
      <Progress value={limit ? pct : 8} indicatorClassName={limit && pct >= 100 ? "bg-amber-500" : undefined} />
    </div>
  );
}
