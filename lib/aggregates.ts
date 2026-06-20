import type { Sku, Channel, Market } from "./types";

/**
 * Pure, client-safe aggregations that operate on ANY SKU array — sample or
 * real. These are the parametrized versions of the helpers in mock-data, so
 * the same dashboard code renders sample or real data identically.
 */

export function byChannel(skus: Sku[]) {
  const map = new Map<Channel, { revenue: number; netProfit: number; adSpend: number }>();
  for (const s of skus) {
    const cur = map.get(s.channel) || { revenue: 0, netProfit: 0, adSpend: 0 };
    cur.revenue += s.revenue;
    cur.netProfit += s.netProfit;
    cur.adSpend += s.adSpend;
    map.set(s.channel, cur);
  }
  return [...map.entries()].map(([channel, v]) => ({
    channel,
    ...v,
    margin: v.revenue ? Number(((v.netProfit / v.revenue) * 100).toFixed(1)) : 0,
  }));
}

export function byMarket(skus: Sku[]) {
  const map = new Map<Market, { revenue: number; netProfit: number }>();
  for (const s of skus) {
    const cur = map.get(s.market) || { revenue: 0, netProfit: 0 };
    cur.revenue += s.revenue;
    cur.netProfit += s.netProfit;
    map.set(s.market, cur);
  }
  return [...map.entries()].map(([market, v]) => ({
    market,
    ...v,
    margin: v.revenue ? Number(((v.netProfit / v.revenue) * 100).toFixed(1)) : 0,
  }));
}

export function costBreakdown(skus: Sku[]) {
  const acc = skus.reduce(
    (a, s) => ({
      productCost: a.productCost + s.productCost,
      adSpend: a.adSpend + s.adSpend,
      shippingCost: a.shippingCost + s.shippingCost,
      platformFees: a.platformFees + s.platformFees,
      customsFees: a.customsFees + s.customsFees,
      returnCost: a.returnCost + s.returnCost,
      storageCost: a.storageCost + s.storageCost,
    }),
    { productCost: 0, adSpend: 0, shippingCost: 0, platformFees: 0, customsFees: 0, returnCost: 0, storageCost: 0 }
  );
  return [
    { name: "Product Cost", value: acc.productCost, key: "product" },
    { name: "Ad Spend", value: acc.adSpend, key: "ad" },
    { name: "Shipping", value: acc.shippingCost, key: "shipping" },
    { name: "Platform Fees", value: acc.platformFees, key: "platform" },
    { name: "Customs", value: acc.customsFees, key: "customs" },
    { name: "Returns", value: acc.returnCost, key: "returns" },
    { name: "Storage", value: acc.storageCost, key: "storage" },
  ];
}

export function topProducts(skus: Sku[], n = 5): Sku[] {
  return [...skus].sort((a, b) => b.netProfit - a.netProfit).slice(0, n);
}

export function worstProducts(skus: Sku[], n = 5): Sku[] {
  return [...skus].sort((a, b) => a.netProfit - b.netProfit).slice(0, n);
}
