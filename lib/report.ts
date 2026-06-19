import { SKUS, byMarket, byChannel } from "./mock-data";
import { summarize } from "./profit";
import { LEAKS, leakSummary } from "./leaks";
import { RECOMMENDATIONS } from "./ai";
import { formatCurrency, formatPercent } from "./format";

/**
 * Builds the full report dataset server-side so the exported file content is
 * authoritative (not assembled from untrusted client state).
 */
export interface ReportData {
  generatedAt: string;
  summary: {
    revenue: number;
    grossProfit: number;
    netProfit: number;
    contributionMargin: number;
    avgMargin: number;
    adSpend: number;
    shippingCost: number;
    customsFees: number;
    returnCost: number;
    storageCost: number;
    profitLeakage: number;
  };
  best: { sku: string; name: string; netProfit: number; margin: number };
  worst: { sku: string; name: string; netProfit: number; margin: number };
  skus: Array<{
    sku: string;
    name: string;
    store: string;
    market: string;
    channel: string;
    revenue: number;
    units: number;
    adSpend: number;
    shippingCost: number;
    customsFees: number;
    returnCost: number;
    netProfit: number;
    marginPct: number;
    status: string;
  }>;
  leaks: Array<{ sku: string; type: string; severity: string; monthlyLoss: number; action: string }>;
  markets: Array<{ market: string; revenue: number; netProfit: number; margin: number }>;
  channels: Array<{ channel: string; revenue: number; netProfit: number; margin: number }>;
  recommendations: Array<{ title: string; category: string; priority: string; monthlyImpact: number; confidence: number }>;
  leakTotals: { totalMonthly: number; totalAnnual: number; count: number };
}

export function buildReport(): ReportData {
  const s = summarize(SKUS);
  const sorted = [...SKUS].sort((a, b) => b.netProfit - a.netProfit);
  const best = sorted[0];
  const worst = sorted[sorted.length - 1];
  const ls = leakSummary();

  return {
    generatedAt: new Date().toISOString(),
    summary: {
      revenue: s.revenue,
      grossProfit: s.grossProfit,
      netProfit: s.netProfit,
      contributionMargin: s.contributionMargin,
      avgMargin: s.avgMargin,
      adSpend: s.adSpend,
      shippingCost: s.shippingCost,
      customsFees: s.customsFees,
      returnCost: s.returnCost,
      storageCost: s.storageCost,
      profitLeakage: s.profitLeakage,
    },
    best: { sku: best.sku, name: best.productName, netProfit: best.netProfit, margin: best.marginPct },
    worst: { sku: worst.sku, name: worst.productName, netProfit: worst.netProfit, margin: worst.marginPct },
    skus: SKUS.map((k) => ({
      sku: k.sku,
      name: k.productName,
      store: k.store,
      market: k.market,
      channel: k.channel,
      revenue: k.revenue,
      units: k.unitsSold,
      adSpend: k.adSpend,
      shippingCost: k.shippingCost,
      customsFees: k.customsFees,
      returnCost: k.returnCost,
      netProfit: k.netProfit,
      marginPct: k.marginPct,
      status: k.status,
    })),
    leaks: LEAKS.map((l) => ({
      sku: l.sku,
      type: l.type,
      severity: l.severity,
      monthlyLoss: l.monthlyLoss,
      action: l.suggestedAction,
    })),
    markets: byMarket().map((m) => ({ market: m.market, revenue: m.revenue, netProfit: m.netProfit, margin: m.margin })),
    channels: byChannel().map((c) => ({ channel: c.channel, revenue: c.revenue, netProfit: c.netProfit, margin: c.margin })),
    recommendations: RECOMMENDATIONS.map((r) => ({
      title: r.title,
      category: r.category,
      priority: r.priority,
      monthlyImpact: r.monthlyImpact,
      confidence: r.confidence,
    })),
    leakTotals: { totalMonthly: ls.totalMonthly, totalAnnual: ls.totalAnnual, count: ls.count },
  };
}

/** Helpers re-exported for client formatting convenience. */
export { formatCurrency, formatPercent };
