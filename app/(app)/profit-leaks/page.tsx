"use client";

import * as React from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Ship,
  Undo2,
  Globe2,
  Megaphone,
  TrendingDown,
  CircleSlash,
  ArrowRight,
  Sparkles,
  Wrench,
} from "lucide-react";
import { PageHeader, StatCard, DemoModeBanner } from "@/components/shared";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { SeverityBadge, Badge } from "@/components/ui/badge";
import { LEAKS, leakSummary } from "@/lib/leaks";
import { formatCurrency } from "@/lib/format";
import type { LeakType, ProfitLeak, Severity } from "@/lib/types";
import { cn } from "@/lib/utils";

const ICONS: Record<LeakType, typeof Ship> = {
  "High Shipping Cost": Ship,
  "High Return Rate": Undo2,
  "Customs Heavy": Globe2,
  "Unprofitable Ad Campaign": Megaphone,
  "Declining Margin": TrendingDown,
  "Negative Contribution Margin": CircleSlash,
};

const SEVERITIES: Severity[] = ["Critical", "High", "Medium", "Low"];

export default function ProfitLeaksPage() {
  const [type, setType] = React.useState("all");
  const [severity, setSeverity] = React.useState("all");
  const summary = leakSummary();

  const types = Array.from(new Set(LEAKS.map((l) => l.type)));
  const rows = LEAKS.filter(
    (l) => (type === "all" || l.type === type) && (severity === "all" || l.severity === severity)
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Profit Leak Detection" description="Every quantified reason your profit is leaking — with a fix for each.">
        <Button asChild variant="brand" size="sm"><Link href="/ai-agent"><Sparkles className="size-4" /> Ask AI to fix these</Link></Button>
      </PageHeader>

      <DemoModeBanner />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Monthly Profit Loss" value={formatCurrency(summary.totalMonthly)} icon={AlertTriangle} tone="negative" hint="recoverable" />
        <StatCard label="Annualized Impact" value={formatCurrency(summary.totalAnnual)} icon={TrendingDown} tone="negative" hint="if left unaddressed" />
        <StatCard label="Active Leaks" value={String(summary.count)} icon={Wrench} hint={`${summary.critical} critical`} />
        <StatCard label="Affected SKUs" value={String(summary.affectedSkus)} icon={CircleSlash} hint="across your catalog" />
      </div>

      <Card className="border-amber-200 bg-gradient-to-br from-amber-50/70 to-card">
        <CardContent className="flex flex-col items-start gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700"><AlertTriangle className="size-5" /></span>
            <div>
              <p className="font-semibold">You&apos;re leaking {formatCurrency(summary.totalMonthly)} every month.</p>
              <p className="text-sm text-muted-foreground">That&apos;s {formatCurrency(summary.totalAnnual)} a year. Closing the top {Math.min(5, summary.count)} leaks recovers most of it.</p>
            </div>
          </div>
          <Button asChild variant="outline" size="sm"><Link href="/ai-agent">Generate fix plan <ArrowRight className="size-4" /></Link></Button>
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center gap-2">
        <Select value={type} onChange={(e) => setType(e.target.value)} size="sm" className="w-56">
          <option value="all">All leak types</option>
          {types.map((t) => <option key={t} value={t}>{t}</option>)}
        </Select>
        <Select value={severity} onChange={(e) => setSeverity(e.target.value)} size="sm" className="w-44">
          <option value="all">All severities</option>
          {SEVERITIES.map((s) => <option key={s} value={s}>{s}</option>)}
        </Select>
        <span className="ml-auto text-sm text-muted-foreground">{rows.length} leaks</span>
      </div>

      <div className="space-y-3">
        {rows.map((leak) => <LeakCard key={leak.id} leak={leak} />)}
      </div>
    </div>
  );
}

function LeakCard({ leak }: { leak: ProfitLeak }) {
  const Icon = ICONS[leak.type];
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col gap-4 p-5 lg:flex-row lg:items-start">
          <span
            className={cn(
              "flex size-11 shrink-0 items-center justify-center rounded-xl",
              leak.severity === "Critical" ? "bg-red-100 text-red-600" : leak.severity === "High" ? "bg-amber-100 text-amber-700" : "bg-secondary text-muted-foreground"
            )}
          >
            <Icon className="size-5" />
          </span>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-semibold">{leak.type}</h3>
              <SeverityBadge severity={leak.severity} />
              <Badge variant="outline" className="font-mono text-[11px]">{leak.sku}</Badge>
              <span className="text-sm text-muted-foreground">· {leak.productName}</span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-foreground/80">
              <span className="font-medium text-foreground">Root cause: </span>{leak.rootCause}
            </p>
            <div className="mt-3 flex items-start gap-2 rounded-lg border border-brand/20 bg-[var(--brand-soft)] px-3 py-2">
              <Wrench className="mt-0.5 size-4 shrink-0 text-brand-strong" />
              <p className="text-sm text-brand-strong"><span className="font-medium">Suggested action: </span>{leak.suggestedAction}</p>
            </div>
          </div>

          <div className="shrink-0 rounded-xl border border-border bg-secondary/40 px-4 py-3 text-right">
            <p className="text-xs text-muted-foreground">Monthly loss</p>
            <p className="tabular text-xl font-semibold text-red-600">−{formatCurrency(leak.monthlyLoss)}</p>
            <p className="mt-1 text-[11px] text-muted-foreground">{leak.metric}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
