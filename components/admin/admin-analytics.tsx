"use client";

import {
  Users,
  UserCheck,
  Beaker,
  CreditCard,
  Percent,
  TrendingUp,
  Activity,
  Sparkles,
  DollarSign,
} from "lucide-react";
import { StatCard } from "@/components/shared";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SignupBars, PlanDonut } from "@/components/charts";
import { Progress } from "@/components/ui/misc";
import {
  FOUNDER_METRICS as M,
  REVENUE_BY_PLAN,
  SIGNUP_TREND,
  TOP_PAGES,
  FEATURE_USAGE,
} from "@/lib/analytics";
import { formatCurrency, formatNumber } from "@/lib/format";

export function AdminAnalytics() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Signups" value={formatNumber(M.totalSignups)} icon={Users} delta={14.2} deltaLabel="vs last month" />
        <StatCard label="Active Users" value={formatNumber(M.activeUsers)} icon={UserCheck} delta={9.1} deltaLabel="MAU" tone="positive" />
        <StatCard label="Free Users" value={formatNumber(M.trialUsers)} icon={Beaker} hint="on the free analysis" />
        <StatCard label="Paid Users" value={formatNumber(M.paidUsers)} icon={CreditCard} delta={6.8} deltaLabel="vs last month" tone="positive" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="MRR" value={formatCurrency(M.mrr)} icon={DollarSign} delta={11.4} deltaLabel="vs last month" tone="positive" />
        <StatCard label="ARR" value={formatCurrency(M.arr, { compact: true })} icon={TrendingUp} tone="positive" hint="annual run-rate" />
        <StatCard label="Conversion Rate" value={`${M.conversionRate}%`} icon={Percent} delta={1.3} deltaLabel="free → paid" tone="positive" />
        <StatCard label="Churn Rate" value={`${M.churnRate}%`} icon={Activity} delta={-0.4} deltaLabel="vs last month" tone="positive" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2"><CardTitle>Signups & conversions</CardTitle></CardHeader>
          <CardContent><SignupBars data={SIGNUP_TREND} /></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle>MRR by plan</CardTitle></CardHeader>
          <CardContent>
            <PlanDonut data={REVENUE_BY_PLAN} />
            <div className="mt-3 space-y-1.5">
              {REVENUE_BY_PLAN.map((p) => (
                <div key={p.plan} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-muted-foreground"><span className="size-2 rounded-full" style={{ background: p.color }} />{p.plan}</span>
                  <span className="tabular font-medium">{formatCurrency(p.mrr)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-2"><CardTitle>Most visited pages</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {TOP_PAGES.map((p) => (
              <div key={p.page}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-mono text-xs text-muted-foreground">{p.page}</span>
                  <span className="tabular font-medium">{formatNumber(p.views)}</span>
                </div>
                <Progress value={p.share * 3} indicatorClassName="bg-chart-2" />
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle>Feature usage</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {FEATURE_USAGE.map((f) => (
              <div key={f.feature}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{f.feature}</span>
                  <span className="tabular font-medium">{f.usage}%</span>
                </div>
                <Progress value={f.usage} />
              </div>
            ))}
            <div className="mt-2 flex items-center justify-between rounded-lg bg-secondary/60 px-3 py-2.5 text-sm">
              <span className="flex items-center gap-2 font-medium"><Sparkles className="size-4 text-brand" /> AI queries generated</span>
              <span className="tabular font-semibold">{formatNumber(M.aiQueries)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="flex flex-wrap items-center justify-between gap-3 p-5">
          <div>
            <p className="text-sm text-muted-foreground">Stripe revenue (last 30 days, gross)</p>
            <p className="tabular text-2xl font-semibold">{formatCurrency(M.stripeRevenue)}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Net revenue retention</p>
            <p className="tabular text-2xl font-semibold text-brand-strong">112%</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
