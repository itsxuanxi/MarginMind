"use client";

import {
  LayoutDashboard,
  Table2,
  TrendingDown,
  Sparkles,
  Plug,
  Settings,
  Search,
  Bell,
  Lock,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Download,
  Ship,
  Globe2,
  Megaphone,
  Undo2,
} from "lucide-react";
import { MiniSparkline } from "@/components/charts";
import { TREND, SKUS, byMarket } from "@/lib/mock-data";
import { summarize } from "@/lib/profit";
import { formatCurrency, formatPercent } from "@/lib/format";
import type { Sku, SkuStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const NAV = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: Table2, label: "SKU Analysis" },
  { icon: TrendingDown, label: "Profit Leaks" },
  { icon: Sparkles, label: "AI Profit Agent", badge: "AI" },
  { icon: Plug, label: "Integrations" },
  { icon: Settings, label: "Settings" },
];

const STATUS_DOT: Record<SkuStatus, string> = {
  Healthy: "bg-emerald-500",
  Good: "bg-blue-500",
  "Low Margin": "bg-amber-500",
  "At Risk": "bg-orange-500",
  "Losing Money": "bg-red-500",
};

export function DashboardMock() {
  const s = summarize(SKUS);
  const rows = [...SKUS].sort((a, b) => b.revenue - a.revenue).slice(0, 6);
  const markets = [...byMarket()].sort((a, b) => b.revenue - a.revenue);
  const maxMarket = Math.max(...markets.map((m) => m.revenue));

  const kpis = [
    { label: "Net Profit", value: formatCurrency(s.netProfit, { compact: true }), delta: 6.1, up: true, spark: TREND.map((t) => t.netProfit) },
    { label: "Avg Margin", value: formatPercent(s.avgMargin), delta: 2.1, up: false, spark: TREND.map((t) => t.margin) },
    { label: "Ad Spend", value: formatCurrency(s.adSpend, { compact: true }), delta: 4.4, up: false, spark: TREND.map((t) => t.adSpend) },
    { label: "Profit Leakage", value: formatCurrency(s.profitLeakage, { compact: true }), delta: 8, up: false, spark: TREND.map((t) => t.adSpend), danger: true },
  ];

  const costs = [
    { icon: Ship, label: "Shipping", value: formatCurrency(s.shippingCost, { compact: true }) },
    { icon: Globe2, label: "Customs", value: formatCurrency(s.customsFees, { compact: true }) },
    { icon: Megaphone, label: "Ad spend", value: formatCurrency(s.adSpend, { compact: true }) },
    { icon: Undo2, label: "Returns", value: formatCurrency(s.returnCost, { compact: true }) },
  ];

  const c = (v: number) => formatCurrency(v, { compact: true });

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[0_40px_80px_-24px_rgba(10,12,16,0.35)] ring-1 ring-black/5">
      {/* Browser chrome */}
      <div className="flex items-center gap-2 border-b border-border bg-secondary/70 px-4 py-3">
        <span className="size-3 rounded-full bg-[#ff5f57]" />
        <span className="size-3 rounded-full bg-[#febc2e]" />
        <span className="size-3 rounded-full bg-[#28c840]" />
        <div className="mx-auto flex items-center gap-1.5 rounded-md bg-card px-3 py-1 text-[11px] text-muted-foreground shadow-sm">
          <Lock className="size-3 text-brand" /> app.marginmind.io/dashboard
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden w-44 shrink-0 flex-col bg-sidebar p-3 md:flex">
          <div className="flex items-center gap-2 px-2 py-2">
            <span className="flex size-6 items-center justify-center rounded-md bg-brand">
              <svg viewBox="0 0 24 24" className="size-3.5 text-white" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 18 L9 11 L13 14 L20 5" /><path d="M15 5 H20 V10" />
              </svg>
            </span>
            <span className="text-[13px] font-semibold text-white">MarginMind</span>
          </div>
          <div className="mt-3 space-y-0.5">
            {NAV.map((n) => (
              <div key={n.label} className={cn("flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[11px] font-medium", n.active ? "bg-sidebar-accent text-white" : "text-sidebar-foreground")}>
                <n.icon className={cn("size-3.5", n.active ? "text-brand" : "text-sidebar-muted")} />
                <span className="flex-1">{n.label}</span>
                {n.badge && <span className="rounded bg-brand/15 px-1 py-0.5 text-[9px] font-semibold text-brand">{n.badge}</span>}
              </div>
            ))}
          </div>
          <div className="mt-auto rounded-lg bg-sidebar-accent p-2.5">
            <div className="flex items-center justify-between">
              <p className="text-[10px] text-sidebar-muted">Growth plan</p>
              <span className="rounded bg-brand/15 px-1 text-[9px] font-semibold text-brand">Trial</span>
            </div>
            <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-sidebar">
              <div className="h-full w-[65%] rounded-full bg-brand" />
            </div>
          </div>
        </aside>

        {/* Main */}
        <div className="min-w-0 flex-1">
          {/* topbar */}
          <div className="flex items-center gap-3 border-b border-border px-4 py-3">
            <div>
              <p className="text-[13px] font-semibold leading-none">Profit Dashboard</p>
              <p className="mt-1 text-[11px] text-muted-foreground">Where you&apos;re making money</p>
            </div>
            <div className="ml-auto hidden items-center gap-1.5 rounded-md border border-border px-2 py-1.5 text-[10px] text-muted-foreground lg:flex">
              <Calendar className="size-3" /> Last 12 months
            </div>
            <div className="hidden items-center gap-1.5 rounded-md border border-border px-2 py-1.5 text-[10px] text-muted-foreground lg:flex">
              <Download className="size-3" /> Export
            </div>
            <span className="flex size-7 items-center justify-center rounded-md border border-border text-muted-foreground"><Bell className="size-3.5" /></span>
            <span className="flex size-7 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">XZ</span>
          </div>

          <div className="space-y-3 p-3.5">
            {/* KPI tiles */}
            <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
              {kpis.map((k) => (
                <div key={k.label} className="rounded-xl border border-border p-2.5">
                  <p className="text-[10px] text-muted-foreground">{k.label}</p>
                  <p className={cn("tabular mt-0.5 text-base font-semibold", k.danger && "text-red-600")}>{k.value}</p>
                  <div className="mt-1 flex items-center justify-between">
                    <span className={cn("inline-flex items-center gap-0.5 text-[9px] font-medium", k.up ? "text-brand-strong" : "text-red-600")}>
                      {k.up ? <ArrowUpRight className="size-2.5" /> : <ArrowDownRight className="size-2.5" />}{k.delta}%
                    </span>
                    <div className="h-4 w-12"><MiniSparkline data={k.spark} color={k.danger ? "var(--chart-5)" : k.up ? "var(--chart-1)" : "var(--chart-4)"} /></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid gap-3 lg:grid-cols-5">
              {/* SKU profit table */}
              <div className="overflow-hidden rounded-xl border border-border lg:col-span-3">
                <div className="flex items-center justify-between border-b border-border px-3 py-2">
                  <p className="text-[11px] font-semibold">SKU Profit Analysis</p>
                  <span className="rounded bg-secondary px-1.5 py-0.5 text-[9px] text-muted-foreground">20 SKUs · 5 markets</span>
                </div>
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-border text-[8.5px] uppercase tracking-wide text-muted-foreground">
                      <th className="px-3 py-1.5 font-semibold">Product</th>
                      <th className="px-1 py-1.5 text-right font-semibold">Rev</th>
                      <th className="px-1 py-1.5 text-right font-semibold">Ad</th>
                      <th className="px-1 py-1.5 text-right font-semibold">Ship</th>
                      <th className="px-1 py-1.5 text-right font-semibold">Duty</th>
                      <th className="px-1 py-1.5 text-right font-semibold">Ret</th>
                      <th className="px-1 py-1.5 text-right font-semibold">Net</th>
                      <th className="px-2 py-1.5 text-right font-semibold">Margin</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r: Sku) => (
                      <tr key={r.id} className="border-b border-border/70 last:border-0">
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-1.5">
                            <span className={cn("size-1.5 shrink-0 rounded-full", STATUS_DOT[r.status])} />
                            <div className="min-w-0">
                              <p className="truncate text-[10px] font-medium leading-tight">{r.productName}</p>
                              <p className="text-[8.5px] text-muted-foreground">{r.sku} · {r.channel}</p>
                            </div>
                          </div>
                        </td>
                        <td className="tabular px-1 py-2 text-right text-[10px]">{c(r.revenue)}</td>
                        <td className="tabular px-1 py-2 text-right text-[10px] text-muted-foreground">{c(r.adSpend)}</td>
                        <td className="tabular px-1 py-2 text-right text-[10px] text-muted-foreground">{c(r.shippingCost)}</td>
                        <td className="tabular px-1 py-2 text-right text-[10px] text-muted-foreground">{c(r.customsFees)}</td>
                        <td className="tabular px-1 py-2 text-right text-[10px] text-muted-foreground">{c(r.returnCost)}</td>
                        <td className={cn("tabular px-1 py-2 text-right text-[10px] font-semibold", r.netProfit >= 0 ? "text-brand-strong" : "text-red-600")}>{r.netProfit < 0 ? "−" : ""}{c(Math.abs(r.netProfit))}</td>
                        <td className={cn("tabular px-2 py-2 text-right text-[10px] font-medium", r.marginPct >= 0 ? "text-foreground" : "text-red-600")}>{formatPercent(r.marginPct)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Right rail */}
              <div className="space-y-3 lg:col-span-2">
                <div className="rounded-xl border border-brand/30 bg-[var(--brand-soft)] p-3">
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-brand-strong"><Sparkles className="size-3.5" /> AI Profit Agent</div>
                  <p className="mt-1.5 text-[11px] leading-relaxed text-foreground/80">Cut ad spend on <b>SUM-212</b> by 35% — ROAS no longer covers fulfillment.</p>
                  <p className="mt-1.5 text-[10px] font-semibold text-brand-strong">+{formatCurrency(4400)}/mo · 91% confidence</p>
                </div>

                <div className="rounded-xl border border-border p-3">
                  <p className="mb-2 text-[11px] font-semibold">Profit by market</p>
                  <div className="space-y-1.5">
                    {markets.map((m) => (
                      <div key={m.market}>
                        <div className="mb-0.5 flex items-center justify-between text-[9.5px]">
                          <span className="text-muted-foreground">{m.market}</span>
                          <span className={cn("tabular font-medium", m.margin >= 0 ? "text-foreground" : "text-red-600")}>{formatPercent(m.margin)}</span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
                          <div className={cn("h-full rounded-full", m.margin >= 0 ? "bg-brand" : "bg-red-400")} style={{ width: `${Math.max(6, (m.revenue / maxMarket) * 100)}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {costs.map((cost) => (
                    <div key={cost.label} className="rounded-lg border border-border p-2">
                      <div className="flex items-center gap-1 text-[9px] text-muted-foreground"><cost.icon className="size-3" /> {cost.label}</div>
                      <p className="tabular mt-0.5 text-[12px] font-semibold">{cost.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
