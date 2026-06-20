"use client";

import * as React from "react";
import Link from "next/link";
import {
  DollarSign,
  TrendingUp,
  Wallet,
  Percent,
  Megaphone,
  Ship,
  Globe2,
  Undo2,
  Warehouse,
  Layers3,
  AlertTriangle,
  ArrowRight,
  Trophy,
  Sparkles,
  Download,
} from "lucide-react";
import { PageHeader, StatCard, SectionHeading, DemoModeBanner } from "@/components/shared";
import { ExportMenu } from "@/components/export-menu";
import { CheckoutSuccessToast } from "@/components/checkout-success-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import {
  RevenueProfitChart,
  NetProfitTrend,
  MarginTrend,
  CostBreakdownDonut,
  PerformanceBars,
} from "@/components/charts";
import { byChannel, byMarket, costBreakdown, topProducts, worstProducts } from "@/lib/aggregates";
import { summarize } from "@/lib/profit";
import { buildRecommendations } from "@/lib/ai";
import { useDataset } from "@/components/use-dataset";
import { formatCurrency, formatPercent } from "@/lib/format";
import type { Sku } from "@/lib/types";

export default function DashboardPage() {
  const { skus: allSkus, trend, dataMode } = useDataset();
  const [store, setStore] = React.useState("all");
  const stores = React.useMemo(
    () => Array.from(new Set(allSkus.map((k) => k.store).filter(Boolean))),
    [allSkus]
  );
  const skus = React.useMemo(
    () => (store === "all" ? allSkus : allSkus.filter((k) => k.store === store)),
    [store, allSkus]
  );
  const s = React.useMemo(() => summarize(skus), [skus]);
  const recommendations = React.useMemo(() => buildRecommendations(skus), [skus]);

  const hasTrend = trend.length >= 2;
  const lastMonth = trend[trend.length - 1];
  const prevMonth = trend[trend.length - 2];
  const revDelta = hasTrend ? +(((lastMonth.revenue - prevMonth.revenue) / prevMonth.revenue) * 100).toFixed(1) : undefined;
  const profitDelta = hasTrend ? +(((lastMonth.netProfit - prevMonth.netProfit) / prevMonth.netProfit) * 100).toFixed(1) : undefined;
  const marginDelta = hasTrend ? +(lastMonth.margin - prevMonth.margin).toFixed(1) : undefined;

  const best = topProducts(skus, 1)[0];
  const worst = worstProducts(skus, 1)[0];
  const top = [...skus].sort((a, b) => b.netProfit - a.netProfit).slice(0, 5);
  const bottom = [...skus].sort((a, b) => a.netProfit - b.netProfit).slice(0, 5);

  const secondary = [
    { label: "Contribution Margin", value: formatCurrency(s.contributionMargin), icon: Layers3 },
    { label: "Ad Spend", value: formatCurrency(s.adSpend), icon: Megaphone },
    { label: "Shipping Cost", value: formatCurrency(s.shippingCost), icon: Ship },
    { label: "Customs Fees", value: formatCurrency(s.customsFees), icon: Globe2 },
    { label: "Return Cost", value: formatCurrency(s.returnCost), icon: Undo2 },
    { label: "Storage Cost", value: formatCurrency(s.storageCost), icon: Warehouse },
  ];

  return (
    <div className="space-y-6">
      <CheckoutSuccessToast />
      <PageHeader title="Profit Dashboard" description="Where you're making money — and where you're losing it.">
        <Select value={store} onChange={(e) => setStore(e.target.value)} size="sm" className="w-44">
          <option value="all">All stores</option>
          {stores.map((name) => (
            <option key={name} value={name}>{name}</option>
          ))}
        </Select>
        <Select size="sm" defaultValue="30d" className="w-36">
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
          <option value="12m">Last 12 months</option>
        </Select>
        <ExportMenu />
      </PageHeader>

      {dataMode === "sample" && <DemoModeBanner />}

      {/* Primary KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Revenue" value={formatCurrency(s.revenue)} delta={revDelta} deltaLabel="vs last month" icon={DollarSign} />
        <StatCard label="Gross Profit" value={formatCurrency(s.grossProfit)} delta={8.2} deltaLabel="vs last month" icon={TrendingUp} tone="positive" />
        <StatCard label="Net Profit" value={formatCurrency(s.netProfit)} delta={profitDelta} deltaLabel="vs last month" icon={Wallet} tone={s.netProfit >= 0 ? "positive" : "negative"} />
        <StatCard label="Average Margin" value={formatPercent(s.avgMargin)} delta={marginDelta} deltaLabel="margin pts vs last month" icon={Percent} />
      </div>

      {/* Profit leakage highlight + Best/Worst */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="border-red-200 bg-gradient-to-br from-red-50/70 to-card lg:col-span-1">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-[13px] font-medium text-muted-foreground">Profit Leakage</p>
              <span className="flex size-9 items-center justify-center rounded-lg bg-red-100 text-red-600">
                <AlertTriangle className="size-[18px]" />
              </span>
            </div>
            <p className="tabular mt-2 text-[26px] font-semibold leading-none text-red-600">
              {formatCurrency(s.profitLeakage)}
            </p>
            <p className="mt-2.5 text-xs text-muted-foreground">
              Monthly loss from {skus.filter((k) => k.netProfit < 0).length} money-losing SKUs
            </p>
            <Button asChild variant="outline" size="sm" className="mt-4 w-full">
              <Link href="/profit-leaks">Investigate leaks <ArrowRight className="size-4" /></Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-brand-strong">
              <Trophy className="size-4" /> Best SKU
            </div>
            <p className="mt-3 font-semibold">{best.productName}</p>
            <p className="text-xs text-muted-foreground">{best.sku} · {best.market} · {best.channel}</p>
            <div className="mt-3 flex items-end justify-between">
              <div>
                <p className="tabular text-xl font-semibold text-brand-strong">{formatCurrency(best.netProfit)}</p>
                <p className="text-xs text-muted-foreground">net profit / mo</p>
              </div>
              <StatusBadge status={best.status} />
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-red-600">
              <AlertTriangle className="size-4" /> Worst SKU
            </div>
            <p className="mt-3 font-semibold">{worst.productName}</p>
            <p className="text-xs text-muted-foreground">{worst.sku} · {worst.market} · {worst.channel}</p>
            <div className="mt-3 flex items-end justify-between">
              <div>
                <p className="tabular text-xl font-semibold text-red-600">{formatCurrency(worst.netProfit)}</p>
                <p className="text-xs text-muted-foreground">net profit / mo</p>
              </div>
              <StatusBadge status={worst.status} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary metrics */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {secondary.map((m) => (
          <Card key={m.label} className="p-4">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <m.icon className="size-3.5" />
              <span className="text-[11px] font-medium">{m.label}</span>
            </div>
            <p className="tabular mt-1.5 text-lg font-semibold">{m.value}</p>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle>Revenue vs Net Profit</CardTitle>
          </CardHeader>
          <CardContent>
            {hasTrend ? <RevenueProfitChart data={trend} /> : <TrendEmpty />}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Cost Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <CostBreakdownDonut data={costBreakdown(skus)} />
            <div className="mt-3 grid grid-cols-2 gap-1.5">
              {costBreakdown(skus).map((c, i) => {
                const colors = ["var(--chart-2)","var(--chart-5)","var(--chart-4)","var(--chart-3)","var(--chart-6)","var(--chart-1)","var(--muted-foreground)"];
                return (
                  <div key={c.name} className="flex items-center gap-1.5 text-xs">
                    <span className="size-2 rounded-full" style={{ background: colors[i] }} />
                    <span className="text-muted-foreground">{c.name}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="trend" className="space-y-4">
        <TabsList>
          <TabsTrigger value="trend">Net Profit Trend</TabsTrigger>
          <TabsTrigger value="margin">Margin Trend</TabsTrigger>
          <TabsTrigger value="market">Market Performance</TabsTrigger>
          <TabsTrigger value="channel">Channel Performance</TabsTrigger>
        </TabsList>
        <TabsContent value="trend">
          <Card><CardContent className="pt-6">{hasTrend ? <NetProfitTrend data={trend} /> : <TrendEmpty />}</CardContent></Card>
        </TabsContent>
        <TabsContent value="margin">
          <Card><CardContent className="pt-6">{hasTrend ? <MarginTrend data={trend} /> : <TrendEmpty />}</CardContent></Card>
        </TabsContent>
        <TabsContent value="market">
          <Card><CardContent className="pt-6"><PerformanceBars data={byMarket(skus)} nameKey="market" /></CardContent></Card>
        </TabsContent>
        <TabsContent value="channel">
          <Card><CardContent className="pt-6"><PerformanceBars data={byChannel(skus)} nameKey="channel" /></CardContent></Card>
        </TabsContent>
      </Tabs>

      {/* Tables */}
      <div className="grid gap-4 lg:grid-cols-2">
        <ProductTable title="Top Products" subtitle="Highest net profit" rows={top} positive />
        <ProductTable title="Worst Products" subtitle="Biggest drag on profit" rows={bottom} />
      </div>

      {/* AI Insights */}
      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <SectionHeading title="AI Insights" description="Top actions to grow profit this month" />
          <Button asChild variant="brand" size="sm"><Link href="/ai-agent"><Sparkles className="size-4" /> Open Agent</Link></Button>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-3">
          {recommendations.slice(0, 3).map((r) => (
            <Link key={r.id} href="/ai-agent" className="rounded-xl border border-border p-4 transition-shadow hover:shadow-md">
              <div className="flex items-center justify-between">
                <Badge variant="purple">{r.category}</Badge>
                <span className="text-xs font-medium text-brand-strong">+{formatCurrency(r.monthlyImpact)}/mo</span>
              </div>
              <p className="mt-2.5 text-sm font-semibold leading-snug">{r.title}</p>
              <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{r.explanation}</p>
            </Link>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function TrendEmpty() {
  return (
    <div className="flex h-[260px] items-center justify-center px-4 text-center text-sm text-muted-foreground">
      Trends appear here as you upload more periods of data.
    </div>
  );
}

function ProductTable({ title, subtitle, rows, positive }: { title: string; subtitle: string; rows: Sku[]; positive?: boolean }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <SectionHeading title={title} description={subtitle} action={<Button asChild variant="ghost" size="xs"><Link href="/sku-analysis">View all</Link></Button>} />
      </CardHeader>
      <CardContent className="px-0 pb-2">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Product</TableHead>
              <TableHead className="text-right">Revenue</TableHead>
              <TableHead className="text-right">Net Profit</TableHead>
              <TableHead className="text-right">Margin</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.id}>
                <TableCell>
                  <p className="font-medium leading-tight">{r.productName}</p>
                  <p className="text-xs text-muted-foreground">{r.sku} · {r.channel}</p>
                </TableCell>
                <TableCell className="tabular text-right">{formatCurrency(r.revenue)}</TableCell>
                <TableCell className={`tabular text-right font-medium ${r.netProfit >= 0 ? "text-brand-strong" : "text-red-600"}`}>
                  {formatCurrency(r.netProfit)}
                </TableCell>
                <TableCell className="text-right">
                  <span className={`tabular text-sm font-medium ${r.marginPct >= 0 ? "text-foreground" : "text-red-600"}`}>{formatPercent(r.marginPct)}</span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
