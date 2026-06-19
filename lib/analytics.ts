import { PLANS } from "./plans";

/**
 * Founder Analytics — product & revenue metrics for the private admin
 * dashboard. Deterministic mock numbers in demo mode.
 */

export const FOUNDER_METRICS = {
  totalSignups: 1284,
  activeUsers: 742,
  trialUsers: 168,
  paidUsers: 391,
  get conversionRate() {
    return Number(((this.paidUsers / this.totalSignups) * 100).toFixed(1));
  },
  mrr: 38940,
  get arr() {
    return this.mrr * 12;
  },
  churnRate: 3.4,
  stripeRevenue: 51200, // gross processed last 30d incl. annual
  aiQueries: 9420,
};

export const REVENUE_BY_PLAN = [
  { plan: "Starter", customers: 142, mrr: 142 * 17, color: "var(--chart-2)" },
  { plan: "Growth", customers: 186, mrr: 186 * 59, color: "var(--chart-1)" },
  { plan: "Scale", customers: 51, mrr: 51 * 179, color: "var(--chart-3)" },
  { plan: "Enterprise", customers: 12, mrr: 12 * 1200, color: "var(--chart-4)" },
];

export const SIGNUP_TREND = [
  { week: "W1", signups: 38, paid: 9 },
  { week: "W2", signups: 52, paid: 14 },
  { week: "W3", signups: 61, paid: 17 },
  { week: "W4", signups: 74, paid: 23 },
  { week: "W5", signups: 88, paid: 29 },
  { week: "W6", signups: 96, paid: 34 },
  { week: "W7", signups: 113, paid: 41 },
  { week: "W8", signups: 129, paid: 48 },
];

export const TOP_PAGES = [
  { page: "/dashboard", views: 18420, share: 31 },
  { page: "/sku-analysis", views: 11240, share: 19 },
  { page: "/profit-leaks", views: 8930, share: 15 },
  { page: "/ai-agent", views: 7610, share: 13 },
  { page: "/upload", views: 5120, share: 9 },
  { page: "/pricing", views: 4880, share: 8 },
  { page: "/integrations", views: 3010, share: 5 },
];

export const FEATURE_USAGE = [
  { feature: "Profit Dashboard", usage: 94 },
  { feature: "SKU Analysis", usage: 81 },
  { feature: "Profit Leak Detection", usage: 67 },
  { feature: "AI Profit Agent", usage: 58 },
  { feature: "CSV Upload", usage: 49 },
  { feature: "Integrations", usage: 36 },
];

export const PLAN_NAMES = PLANS.map((p) => p.name);
