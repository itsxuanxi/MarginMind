import type { Sku, SkuCosts, SkuStatus } from "./types";

/**
 * The MarginMind Profit Engine.
 * Reusable, pure functions — the single source of truth for every
 * profitability calculation in the product.
 */

export function grossProfit(c: Pick<SkuCosts, "revenue" | "productCost">): number {
  return c.revenue - c.productCost;
}

export function contributionMargin(
  c: Pick<SkuCosts, "revenue" | "productCost" | "adSpend" | "shippingCost" | "platformFees">
): number {
  return c.revenue - c.productCost - c.adSpend - c.shippingCost - c.platformFees;
}

export function netProfit(c: SkuCosts): number {
  return (
    c.revenue -
    c.productCost -
    c.adSpend -
    c.shippingCost -
    c.customsFees -
    c.platformFees -
    c.returnCost -
    c.storageCost
  );
}

export function marginPct(c: SkuCosts): number {
  if (c.revenue === 0) return 0;
  return (netProfit(c) / c.revenue) * 100;
}

export function contributionMarginPct(c: SkuCosts): number {
  if (c.revenue === 0) return 0;
  return (contributionMargin(c) / c.revenue) * 100;
}

/** Classify a SKU's health from its margin and absolute profit. */
export function classifyStatus(c: SkuCosts): SkuStatus {
  const np = netProfit(c);
  const m = marginPct(c);
  const cm = contributionMargin(c);
  if (np < 0 || cm < 0) return "Losing Money";
  if (m < 5) return "At Risk";
  if (m < 12) return "Low Margin";
  if (m < 22) return "Good";
  return "Healthy";
}

/** Aggregate a list of SKUs into a single rolled-up cost object. */
export function aggregateCosts(skus: SkuCosts[]): SkuCosts {
  return skus.reduce<SkuCosts>(
    (acc, s) => ({
      revenue: acc.revenue + s.revenue,
      unitsSold: acc.unitsSold + s.unitsSold,
      productCost: acc.productCost + s.productCost,
      shippingCost: acc.shippingCost + s.shippingCost,
      customsFees: acc.customsFees + s.customsFees,
      adSpend: acc.adSpend + s.adSpend,
      platformFees: acc.platformFees + s.platformFees,
      returnCost: acc.returnCost + s.returnCost,
      storageCost: acc.storageCost + s.storageCost,
    }),
    {
      revenue: 0,
      unitsSold: 0,
      productCost: 0,
      shippingCost: 0,
      customsFees: 0,
      adSpend: 0,
      platformFees: 0,
      returnCost: 0,
      storageCost: 0,
    }
  );
}

export interface ProfitSummary extends SkuCosts {
  grossProfit: number;
  contributionMargin: number;
  netProfit: number;
  marginPct: number;
  avgMargin: number;
  profitLeakage: number;
}

/**
 * Build a complete summary for a dashboard from a list of SKUs.
 * `profitLeakage` is the total monthly loss attributable to
 * money-losing SKUs (the recoverable opportunity).
 */
export function summarize(skus: Sku[]): ProfitSummary {
  const agg = aggregateCosts(skus);
  const avgMargin =
    skus.length === 0
      ? 0
      : skus.reduce((s, k) => s + k.marginPct, 0) / skus.length;
  const profitLeakage = skus
    .filter((s) => s.netProfit < 0)
    .reduce((s, k) => s + Math.abs(k.netProfit), 0);

  return {
    ...agg,
    grossProfit: grossProfit(agg),
    contributionMargin: contributionMargin(agg),
    netProfit: netProfit(agg),
    marginPct: marginPct(agg),
    avgMargin,
    profitLeakage,
  };
}

/** Decorate a raw cost object with all derived metrics. */
export function deriveSku(
  base: Omit<Sku, "grossProfit" | "contributionMargin" | "netProfit" | "marginPct" | "status">
): Sku {
  return {
    ...base,
    grossProfit: grossProfit(base),
    contributionMargin: contributionMargin(base),
    netProfit: netProfit(base),
    marginPct: marginPct(base),
    status: classifyStatus(base),
  };
}
