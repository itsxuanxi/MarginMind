import { deriveSku } from "./profit";
import type {
  Channel,
  Market,
  Sku,
  Store,
  TrendPoint,
} from "./types";

/* ============================================================
   Deterministic mock dataset.
   Seeded so server and client render identical numbers, and the
   same realistic "revenue up, profit down" narrative every load.
   ============================================================ */

function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const round = (n: number) => Math.round(n);

// Platform fee rate by channel (share of revenue).
const PLATFORM_FEE: Record<Channel, number> = {
  Shopify: 0.034,
  Amazon: 0.15,
  "TikTok Shop": 0.06,
  Walmart: 0.12,
};

// Baseline customs/duty rate by destination market.
const CUSTOMS_RATE: Record<Market, number> = {
  US: 0.006,
  Canada: 0.045,
  UK: 0.055,
  Germany: 0.062,
  Australia: 0.05,
};

export const STORES: Store[] = [
  {
    id: "store-aurora",
    name: "Aurora Living",
    channel: "Shopify",
    market: "US",
    currency: "USD",
    createdAt: "2024-08-02",
  },
  {
    id: "store-summit",
    name: "Summit Outdoors",
    channel: "Amazon",
    market: "US",
    currency: "USD",
    createdAt: "2024-10-19",
  },
  {
    id: "store-glow",
    name: "Glow Beauty Co.",
    channel: "TikTok Shop",
    market: "US",
    currency: "USD",
    createdAt: "2025-01-11",
  },
];

type Archetype =
  | "winner"
  | "solid"
  | "thin"
  | "risky"
  | "loser_returns"
  | "loser_ship"
  | "loser_ad"
  | "loser_customs";

interface SkuDef {
  productName: string;
  sku: string;
  category: string;
  storeId: string;
  channel: Channel;
  market: Market;
  unitPrice: number;
  revenue: number;
  archetype: Archetype;
}

// 20 curated products spanning every market, channel, and health band.
const DEFS: SkuDef[] = [
  { productName: "Aurora Ceramic Pour-Over Set", sku: "AUR-101", category: "Home & Kitchen", storeId: "store-aurora", channel: "Shopify", market: "US", unitPrice: 64, revenue: 41200, archetype: "winner" },
  { productName: "Linen Weighted Blanket", sku: "AUR-118", category: "Home & Kitchen", storeId: "store-aurora", channel: "Shopify", market: "Canada", unitPrice: 119, revenue: 28800, archetype: "loser_ship" },
  { productName: "Stoneware Dinner Set (12pc)", sku: "AUR-124", category: "Home & Kitchen", storeId: "store-aurora", channel: "Shopify", market: "UK", unitPrice: 142, revenue: 33400, archetype: "loser_customs" },
  { productName: "Scented Soy Candle Trio", sku: "AUR-132", category: "Home & Kitchen", storeId: "store-aurora", channel: "Shopify", market: "US", unitPrice: 38, revenue: 18600, archetype: "solid" },
  { productName: "Bamboo Bath Caddy", sku: "AUR-140", category: "Home & Kitchen", storeId: "store-aurora", channel: "Walmart", market: "US", unitPrice: 46, revenue: 9200, archetype: "thin" },
  { productName: "Minimalist Wall Clock", sku: "AUR-155", category: "Home & Kitchen", storeId: "store-aurora", channel: "Shopify", market: "Germany", unitPrice: 52, revenue: 12100, archetype: "risky" },
  { productName: "Handwoven Throw Pillow", sku: "AUR-162", category: "Home & Kitchen", storeId: "store-aurora", channel: "Shopify", market: "US", unitPrice: 34, revenue: 7600, archetype: "winner" },

  { productName: "TrailLite 45L Hiking Pack", sku: "SUM-201", category: "Outdoors", storeId: "store-summit", channel: "Amazon", market: "US", unitPrice: 128, revenue: 38900, archetype: "solid" },
  { productName: "Insulated Trail Bottle 32oz", sku: "SUM-204", category: "Outdoors", storeId: "store-summit", channel: "Amazon", market: "US", unitPrice: 39, revenue: 28000, archetype: "loser_returns" },
  { productName: "Ultralight 2-Person Tent", sku: "SUM-212", category: "Outdoors", storeId: "store-summit", channel: "Amazon", market: "Germany", unitPrice: 219, revenue: 31500, archetype: "loser_ad" },
  { productName: "Merino Hiking Socks (3pk)", sku: "SUM-220", category: "Apparel", storeId: "store-summit", channel: "Amazon", market: "US", unitPrice: 28, revenue: 15400, archetype: "winner" },
  { productName: "Carbon Trekking Poles", sku: "SUM-231", category: "Outdoors", storeId: "store-summit", channel: "Amazon", market: "Australia", unitPrice: 96, revenue: 17800, archetype: "thin" },
  { productName: "Packable Down Jacket", sku: "SUM-238", category: "Apparel", storeId: "store-summit", channel: "Amazon", market: "UK", unitPrice: 149, revenue: 22600, archetype: "risky" },
  { productName: "Headlamp Pro 600", sku: "SUM-245", category: "Outdoors", storeId: "store-summit", channel: "Walmart", market: "US", unitPrice: 44, revenue: 8700, archetype: "solid" },

  { productName: "Glow Vitamin-C Serum", sku: "GLW-301", category: "Beauty", storeId: "store-glow", channel: "TikTok Shop", market: "US", unitPrice: 32, revenue: 44800, archetype: "winner" },
  { productName: "Hydra-Dew Moisturizer", sku: "GLW-308", category: "Beauty", storeId: "store-glow", channel: "TikTok Shop", market: "US", unitPrice: 28, revenue: 26900, archetype: "thin" },
  { productName: "Lip Oil Gloss Duo", sku: "GLW-315", category: "Beauty", storeId: "store-glow", channel: "TikTok Shop", market: "UK", unitPrice: 19, revenue: 16200, archetype: "loser_ad" },
  { productName: "Silk Sleep Mask", sku: "GLW-322", category: "Beauty", storeId: "store-glow", channel: "TikTok Shop", market: "Australia", unitPrice: 24, revenue: 9400, archetype: "loser_customs" },
  { productName: "Jade Facial Roller", sku: "GLW-330", category: "Beauty", storeId: "store-glow", channel: "TikTok Shop", market: "Canada", unitPrice: 21, revenue: 7300, archetype: "risky" },
  { productName: "Detox Clay Mask Jar", sku: "GLW-338", category: "Beauty", storeId: "store-glow", channel: "TikTok Shop", market: "US", unitPrice: 26, revenue: 12800, archetype: "solid" },
];

interface Profile {
  cogs: number;
  ship: number;
  ad: number;
  returnRate: number;
  storage: number;
  customsMult: number;
}

const PROFILES: Record<Archetype, Profile> = {
  winner: { cogs: 0.3, ship: 0.06, ad: 0.1, returnRate: 0.02, storage: 0.008, customsMult: 1 },
  solid: { cogs: 0.36, ship: 0.08, ad: 0.14, returnRate: 0.04, storage: 0.012, customsMult: 1 },
  thin: { cogs: 0.42, ship: 0.11, ad: 0.18, returnRate: 0.06, storage: 0.015, customsMult: 1 },
  risky: { cogs: 0.45, ship: 0.13, ad: 0.22, returnRate: 0.09, storage: 0.02, customsMult: 1.1 },
  loser_returns: { cogs: 0.4, ship: 0.1, ad: 0.2, returnRate: 0.24, storage: 0.02, customsMult: 1 },
  loser_ship: { cogs: 0.38, ship: 0.29, ad: 0.16, returnRate: 0.07, storage: 0.03, customsMult: 1 },
  loser_ad: { cogs: 0.37, ship: 0.09, ad: 0.42, returnRate: 0.05, storage: 0.015, customsMult: 1 },
  loser_customs: { cogs: 0.39, ship: 0.1, ad: 0.15, returnRate: 0.06, storage: 0.02, customsMult: 2.6 },
};

function buildSku(def: SkuDef, index: number): Sku {
  const rnd = mulberry32(1337 + index * 97);
  const jit = (base: number, spread = 0.12) => base * (1 + (rnd() - 0.5) * spread);

  const p = PROFILES[def.archetype];
  const revenue = round(def.revenue * (1 + (rnd() - 0.5) * 0.05));
  const unitsSold = Math.max(1, round(revenue / def.unitPrice));

  const productCost = round(revenue * jit(p.cogs));
  const shippingCost = round(revenue * jit(p.ship));
  const adSpend = round(revenue * jit(p.ad));
  const platformFees = round(revenue * PLATFORM_FEE[def.channel]);
  const customsFees = round(
    revenue * CUSTOMS_RATE[def.market] * p.customsMult * jit(1, 0.06)
  );
  const storageCost = round(revenue * jit(p.storage));
  const returnRate = jit(p.returnRate, 0.18);
  const returns = round(unitsSold * returnRate);
  // Cost of a return = refunded value + reverse logistics & restocking.
  const returnCost = round(returns * def.unitPrice * 1.12);

  const store = STORES.find((s) => s.id === def.storeId)!;

  return deriveSku({
    id: `sku-${def.sku.toLowerCase()}`,
    productName: def.productName,
    sku: def.sku,
    category: def.category,
    storeId: def.storeId,
    store: store.name,
    market: def.market,
    channel: def.channel,
    revenue,
    unitsSold,
    productCost,
    shippingCost,
    customsFees,
    adSpend,
    platformFees,
    returnCost,
    storageCost,
    returns,
    returnRate,
  });
}

export const SKUS: Sku[] = DEFS.map(buildSku);

/* ---------- Orders (sampled, last 30 days) ---------- */

export interface OrderRow {
  id: string;
  date: string;
  sku: string;
  productName: string;
  store: string;
  channel: Channel;
  market: Market;
  qty: number;
  total: number;
  status: "Fulfilled" | "Refunded" | "Pending";
}

function buildOrders(count: number): OrderRow[] {
  const rnd = mulberry32(909);
  const orders: OrderRow[] = [];
  for (let i = 0; i < count; i++) {
    const sku = SKUS[Math.floor(rnd() * SKUS.length)];
    const qty = 1 + Math.floor(rnd() * 3);
    const unit = round(sku.revenue / sku.unitsSold);
    const daysAgo = Math.floor(rnd() * 30);
    const date = new Date(Date.now() - daysAgo * 86400000)
      .toISOString()
      .slice(0, 10);
    const roll = rnd();
    const status: OrderRow["status"] =
      roll < 0.08 ? "Refunded" : roll < 0.14 ? "Pending" : "Fulfilled";
    orders.push({
      id: `#${10248 + i}`,
      date,
      sku: sku.sku,
      productName: sku.productName,
      store: sku.store,
      channel: sku.channel,
      market: sku.market,
      qty,
      total: unit * qty,
      status,
    });
  }
  return orders.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export const ORDERS: OrderRow[] = buildOrders(100);

/* ---------- 12-month trend ---------- */

export function buildTrend(): TrendPoint[] {
  const rnd = mulberry32(42);
  const months = [
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  ];
  // Story: revenue climbs steadily, but net margin erodes from rising
  // ad spend, shipping and returns — the core pain MarginMind surfaces.
  const baseRev = 168000;
  return months.map((m, i) => {
    const growth = 1 + i * 0.052 + (rnd() - 0.5) * 0.03;
    const revenue = round(baseRev * growth);
    const grossRate = 0.6 - i * 0.004;
    const netRate = 0.158 - i * 0.0072 + (rnd() - 0.5) * 0.006;
    const grossProfit = round(revenue * grossRate);
    const netProfit = round(revenue * netRate);
    const adSpend = round(revenue * (0.14 + i * 0.0055));
    return {
      month: m,
      revenue,
      grossProfit,
      netProfit,
      adSpend,
      margin: Number((netRate * 100).toFixed(1)),
    };
  });
}

export const TREND: TrendPoint[] = buildTrend();

/* ---------- Aggregations ---------- */

export function byChannel() {
  const map = new Map<Channel, { revenue: number; netProfit: number; adSpend: number }>();
  for (const s of SKUS) {
    const cur = map.get(s.channel) || { revenue: 0, netProfit: 0, adSpend: 0 };
    cur.revenue += s.revenue;
    cur.netProfit += s.netProfit;
    cur.adSpend += s.adSpend;
    map.set(s.channel, cur);
  }
  return [...map.entries()].map(([channel, v]) => ({
    channel,
    ...v,
    margin: Number(((v.netProfit / v.revenue) * 100).toFixed(1)),
  }));
}

export function byMarket() {
  const map = new Map<Market, { revenue: number; netProfit: number }>();
  for (const s of SKUS) {
    const cur = map.get(s.market) || { revenue: 0, netProfit: 0 };
    cur.revenue += s.revenue;
    cur.netProfit += s.netProfit;
    map.set(s.market, cur);
  }
  return [...map.entries()].map(([market, v]) => ({
    market,
    ...v,
    margin: Number(((v.netProfit / v.revenue) * 100).toFixed(1)),
  }));
}

export function costBreakdown() {
  const acc = SKUS.reduce(
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

export function topProducts(n = 5): Sku[] {
  return [...SKUS].sort((a, b) => b.netProfit - a.netProfit).slice(0, n);
}

export function worstProducts(n = 5): Sku[] {
  return [...SKUS].sort((a, b) => a.netProfit - b.netProfit).slice(0, n);
}

export const CHANNELS: Channel[] = ["Shopify", "Amazon", "TikTok Shop", "Walmart"];
export const MARKETS: Market[] = ["US", "Canada", "UK", "Germany", "Australia"];
