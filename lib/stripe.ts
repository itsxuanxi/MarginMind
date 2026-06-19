import Stripe from "stripe";
import type { Plan } from "./entitlements";

/** Server-side Stripe client. Throws if the secret key is missing. */
export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
  return new Stripe(key);
}

/**
 * Derive the public base URL for redirect URLs WITHOUT requiring an env var.
 * Order: request Origin → NEXT_PUBLIC_APP_URL → Vercel URL → Host header → localhost.
 */
export function getBaseUrl(req: Request): string {
  const origin = req.headers.get("origin");
  if (origin && /^https?:\/\//.test(origin)) return origin;
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  const host = req.headers.get("host");
  if (host) return `${host.startsWith("localhost") ? "http" : "https"}://${host}`;
  return "http://localhost:3000";
}

type PaidPlan = Exclude<Plan, "free">;

const PLAN_META: Record<PaidPlan, { amount: number; nameRe: RegExp; envKey: string }> = {
  founding: { amount: 999, nameRe: /found/i, envKey: "STRIPE_FOUNDING_PRICE_ID" },
  pro: { amount: 2999, nameRe: /\bpro\b/i, envKey: "STRIPE_PRO_PRICE_ID" },
};

const priceCache = new Map<PaidPlan, string>();

/**
 * Resolve the Stripe Price ID for a plan from YOUR existing products — no
 * price-ID env vars required. Resolution order:
 *   1. Explicit env override (STRIPE_FOUNDING_PRICE_ID / STRIPE_PRO_PRICE_ID)
 *   2. Active monthly price whose product name matches the plan
 *   3. Active monthly price whose amount matches ($9.99 / $29.99)
 */
export async function resolvePriceId(plan: PaidPlan): Promise<string> {
  if (priceCache.has(plan)) return priceCache.get(plan)!;

  const meta = PLAN_META[plan];
  const envId = process.env[meta.envKey];
  if (envId) {
    priceCache.set(plan, envId);
    return envId;
  }

  const stripe = getStripe();
  const prices = await stripe.prices.list({
    active: true,
    type: "recurring",
    limit: 100,
    expand: ["data.product"],
  });

  const monthly = prices.data.filter((p) => p.recurring?.interval === "month");
  const productName = (p: Stripe.Price) =>
    typeof p.product === "object" && p.product && !("deleted" in p.product) ? p.product.name : "";

  let match =
    monthly.find((p) => meta.nameRe.test(productName(p))) ||
    monthly.find((p) => p.unit_amount === meta.amount);

  if (!match) {
    throw new Error(
      `No active monthly Stripe price found for the "${plan}" plan. Create a $${meta.amount / 100} recurring price, or set ${meta.envKey}.`
    );
  }

  priceCache.set(plan, match.id);
  return match.id;
}
