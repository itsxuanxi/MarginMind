export type IntegrationStatus = "Connected" | "Available" | "Coming Soon";

export interface Integration {
  id: string;
  name: string;
  category: "Sales Channel" | "Advertising" | "Payments" | "Logistics";
  description: string;
  status: IntegrationStatus;
  syncedAt?: string;
}

export const INTEGRATIONS: Integration[] = [
  { id: "shopify", name: "Shopify", category: "Sales Channel", description: "Sync orders, products, fees and payouts.", status: "Connected", syncedAt: "2026-06-18T08:12:00Z" },
  { id: "amazon", name: "Amazon", category: "Sales Channel", description: "Import Seller Central orders, FBA fees and refunds.", status: "Connected", syncedAt: "2026-06-18T07:40:00Z" },
  { id: "tiktok", name: "TikTok Shop", category: "Sales Channel", description: "Pull orders, commissions and creator-ad costs.", status: "Available" },
  { id: "walmart", name: "Walmart Marketplace", category: "Sales Channel", description: "Sync orders and marketplace referral fees.", status: "Available" },
  { id: "meta", name: "Meta Ads", category: "Advertising", description: "Attribute Facebook & Instagram ad spend to SKUs.", status: "Connected", syncedAt: "2026-06-18T06:55:00Z" },
  { id: "google", name: "Google Ads", category: "Advertising", description: "Map Performance Max & Shopping spend to products.", status: "Available" },
  { id: "stripe", name: "Stripe", category: "Payments", description: "Reconcile processing fees, disputes and payouts.", status: "Connected", syncedAt: "2026-06-18T08:01:00Z" },
  { id: "shipbob", name: "ShipBob", category: "Logistics", description: "Per-order fulfillment and storage cost ingestion.", status: "Available" },
  { id: "flexport", name: "Flexport", category: "Logistics", description: "Freight, duties and landed-cost allocation.", status: "Coming Soon" },
  { id: "easyship", name: "Easyship", category: "Logistics", description: "Carrier rates and per-shipment cost capture.", status: "Coming Soon" },
];
