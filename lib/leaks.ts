import { SKUS } from "./mock-data";
import type { ProfitLeak, Severity, Sku } from "./types";
import { formatCurrency, formatPercent } from "./format";

/**
 * Profit Leak Detection — the core differentiator.
 * Scans every SKU against benchmarks and surfaces the specific,
 * quantified reasons profit is leaking, with a fix for each.
 */

function severityFromLoss(loss: number, forceNegative = false): Severity {
  if (forceNegative && loss >= 1500) return "Critical";
  if (loss >= 2000) return "Critical";
  if (loss >= 900) return "High";
  if (loss >= 350) return "Medium";
  return "Low";
}

// Healthy benchmarks (share of revenue).
const BENCH = { shipping: 0.08, returns: 0.05, customs: 0.05, ad: 0.18 };

export function detectLeaks(skus: Sku[] = SKUS): ProfitLeak[] {
  const leaks: ProfitLeak[] = [];
  let n = 0;
  const add = (
    s: Sku,
    type: ProfitLeak["type"],
    monthlyLoss: number,
    rootCause: string,
    suggestedAction: string,
    metric: string,
    forceNegative = false
  ) => {
    if (monthlyLoss <= 60) return;
    leaks.push({
      id: `leak-${++n}`,
      skuId: s.id,
      sku: s.sku,
      productName: s.productName,
      type,
      severity: severityFromLoss(monthlyLoss, forceNegative),
      monthlyLoss: Math.round(monthlyLoss),
      rootCause,
      suggestedAction,
      metric,
    });
  };

  for (const s of skus) {
    const shipRatio = s.shippingCost / s.revenue;
    const customsRatio = s.customsFees / s.revenue;
    const adRatio = s.adSpend / s.revenue;

    if (shipRatio > 0.16) {
      add(
        s,
        "High Shipping Cost",
        (shipRatio - BENCH.shipping) * s.revenue,
        `Shipping is ${formatPercent(shipRatio * 100)} of revenue vs. an ${formatPercent(
          BENCH.shipping * 100
        )} healthy benchmark — likely oversized parcels or zone-skipping carriers.`,
        "Renegotiate carrier rates, switch to regional fulfillment, or add a shipping surcharge at checkout.",
        `${formatPercent(shipRatio * 100)} shipping ratio`
      );
    }

    if (s.returnRate > 0.12) {
      add(
        s,
        "High Return Rate",
        s.returnCost - BENCH.returns * s.revenue,
        `Return rate is ${formatPercent(s.returnRate * 100)} (${s.returns} units), well above the 5% healthy line. Refunds + reverse logistics are eroding margin.`,
        "Audit sizing/quality complaints, improve product detail pages, and add pre-purchase guidance to cut returns.",
        `${formatPercent(s.returnRate * 100)} return rate`
      );
    }

    if (customsRatio > 0.09) {
      add(
        s,
        "Customs Heavy",
        s.customsFees - BENCH.customs * s.revenue,
        `Customs & duties are ${formatPercent(customsRatio * 100)} of revenue in ${s.market}. Cross-border duty is silently consuming margin.`,
        "Explore local 3PL stocking, tariff reclassification (HS codes), or DDP pricing that passes duty to the buyer.",
        `${formatCurrency(s.customsFees)} / mo customs`
      );
    }

    if (adRatio > 0.3) {
      add(
        s,
        "Unprofitable Ad Campaign",
        (adRatio - BENCH.ad) * s.revenue,
        `Ad spend is ${formatPercent(adRatio * 100)} of revenue — ROAS is too thin to cover fulfillment and fees on this SKU.`,
        "Pause underperforming ad sets, cap CPA, and reallocate budget to higher-margin winners.",
        `${formatCurrency(s.adSpend)} / mo ad spend`
      );
    }

    if (s.contributionMargin < 0) {
      add(
        s,
        "Negative Contribution Margin",
        Math.abs(s.contributionMargin),
        `Each sale loses money before fixed costs — revenue ${formatCurrency(
          s.revenue
        )} can't cover product, ads, shipping and platform fees.`,
        "Raise price, cut variable cost, or discontinue. This SKU is structurally unprofitable.",
        `${formatCurrency(s.contributionMargin)} contribution`,
        true
      );
    }

    // Declining margin: surfaced for at-risk / thin SKUs trending down.
    if ((s.status === "At Risk" || s.status === "Low Margin") && s.netProfit >= 0) {
      const erosion = s.revenue * 0.028;
      add(
        s,
        "Declining Margin",
        erosion,
        `Margin has compressed to ${formatPercent(s.marginPct)} over the last 90 days as input and ad costs rose faster than price.`,
        "Test a 4–7% price increase and trim discretionary ad spend before this turns negative.",
        `${formatPercent(s.marginPct)} net margin`
      );
    }
  }

  return leaks.sort((a, b) => b.monthlyLoss - a.monthlyLoss);
}

export const LEAKS: ProfitLeak[] = detectLeaks();

export function leakSummary() {
  const total = LEAKS.reduce((s, l) => s + l.monthlyLoss, 0);
  const critical = LEAKS.filter((l) => l.severity === "Critical").length;
  return {
    totalMonthly: total,
    totalAnnual: total * 12,
    count: LEAKS.length,
    critical,
    affectedSkus: new Set(LEAKS.map((l) => l.skuId)).size,
  };
}
