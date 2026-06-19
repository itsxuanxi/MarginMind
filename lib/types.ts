export type Channel = "Shopify" | "Amazon" | "TikTok Shop" | "Walmart";
export type Market = "US" | "Canada" | "UK" | "Germany" | "Australia";

export type SkuStatus =
  | "Healthy"
  | "Good"
  | "Low Margin"
  | "At Risk"
  | "Losing Money";

export type LeakType =
  | "High Shipping Cost"
  | "High Return Rate"
  | "Customs Heavy"
  | "Unprofitable Ad Campaign"
  | "Declining Margin"
  | "Negative Contribution Margin";

export type Severity = "Critical" | "High" | "Medium" | "Low";

export interface Store {
  id: string;
  name: string;
  channel: Channel;
  market: Market;
  currency: string;
  createdAt: string;
}

/** Raw cost inputs for a single SKU over the reporting period. */
export interface SkuCosts {
  revenue: number;
  unitsSold: number;
  productCost: number;
  shippingCost: number;
  customsFees: number;
  adSpend: number;
  platformFees: number;
  returnCost: number;
  storageCost: number;
}

/** Fully-derived SKU metrics used throughout the app. */
export interface Sku extends SkuCosts {
  id: string;
  productName: string;
  sku: string;
  category: string;
  storeId: string;
  store: string;
  market: Market;
  channel: Channel;
  returns: number;
  returnRate: number; // 0..1
  grossProfit: number;
  contributionMargin: number;
  netProfit: number;
  marginPct: number;
  status: SkuStatus;
}

export interface ProfitLeak {
  id: string;
  skuId: string;
  sku: string;
  productName: string;
  type: LeakType;
  severity: Severity;
  monthlyLoss: number;
  rootCause: string;
  suggestedAction: string;
  metric: string;
}

export interface AiRecommendation {
  id: string;
  title: string;
  category:
    | "Pricing"
    | "Ad Budget"
    | "Market Expansion"
    | "Shipping"
    | "Inventory"
    | "Margin"
    | "Discontinuation";
  priority: Severity;
  confidence: number; // 0..100
  monthlyImpact: number;
  explanation: string;
  suggestedAction: string;
  relatedSku?: string;
}

export interface TrendPoint {
  month: string;
  revenue: number;
  grossProfit: number;
  netProfit: number;
  adSpend: number;
  margin: number;
}
