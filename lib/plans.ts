export type PlanId = "starter" | "growth" | "scale" | "enterprise";

export interface Plan {
  id: PlanId;
  name: string;
  price: number | null; // null = custom
  foundingPrice: number | null;
  cadence: string;
  tagline: string;
  popular?: boolean;
  cta: string;
  limits: { stores: string; orders: string };
  features: string[];
  priceEnv?: string;
}

export const PLANS: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    price: 29,
    foundingPrice: 17,
    cadence: "/month",
    tagline: "For solo sellers getting a grip on profit.",
    cta: "Subscribe",
    limits: { stores: "1 Store", orders: "500 orders / month" },
    features: [
      "1 Store",
      "500 orders / month",
      "Profit Dashboard",
      "SKU Analysis",
      "CSV Uploads",
      "Email support",
    ],
    priceEnv: "STRIPE_PRICE_STARTER",
  },
  {
    id: "growth",
    name: "Growth",
    price: 99,
    foundingPrice: 59,
    cadence: "/month",
    tagline: "For growing brands scaling across channels.",
    popular: true,
    cta: "Subscribe",
    limits: { stores: "3 Stores", orders: "5,000 orders / month" },
    features: [
      "3 Stores",
      "5,000 orders / month",
      "Everything in Starter",
      "AI Profit Recommendations",
      "Multi-Channel Analysis",
      "Profit Leak Detection",
      "Weekly profit reports",
    ],
    priceEnv: "STRIPE_PRICE_GROWTH",
  },
  {
    id: "scale",
    name: "Scale",
    price: 299,
    foundingPrice: 179,
    cadence: "/month",
    tagline: "For multi-brand operators and agencies.",
    cta: "Subscribe",
    limits: { stores: "Unlimited Stores", orders: "50,000 orders / month" },
    features: [
      "Unlimited Stores",
      "50,000 orders / month",
      "Everything in Growth",
      "Advanced AI Profit Agent",
      "Team access & roles",
      "API access",
      "Priority support",
    ],
    priceEnv: "STRIPE_PRICE_SCALE",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: null,
    foundingPrice: null,
    cadence: "",
    tagline: "For large operations with custom needs.",
    cta: "Contact Sales",
    limits: { stores: "Unlimited", orders: "Unlimited" },
    features: [
      "Everything in Scale",
      "Custom data integrations",
      "Dedicated success manager",
      "SSO & advanced security",
      "Custom SLAs",
      "White-glove onboarding",
    ],
  },
];

export const FOUNDING_PROGRAM = {
  totalSeats: 50,
  claimedSeats: 31,
  discountPct: 40,
  get remaining() {
    return this.totalSeats - this.claimedSeats;
  },
};

export function planById(id: PlanId): Plan | undefined {
  return PLANS.find((p) => p.id === id);
}

export type SubscriptionStatus =
  | "trialing"
  | "active"
  | "past_due"
  | "canceled"
  | "unpaid";

export const PLAN_RANK: Record<PlanId, number> = {
  starter: 1,
  growth: 2,
  scale: 3,
  enterprise: 4,
};

/** Feature gating by plan tier. */
export function planAllows(plan: PlanId, feature: "ai" | "advanced_ai" | "team" | "api" | "multichannel"): boolean {
  const rank = PLAN_RANK[plan];
  switch (feature) {
    case "multichannel":
    case "ai":
      return rank >= PLAN_RANK.growth;
    case "advanced_ai":
    case "team":
    case "api":
      return rank >= PLAN_RANK.scale;
    default:
      return true;
  }
}
