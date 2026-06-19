import { cookies } from "next/headers";
import { features } from "./config";

/**
 * Server-side entitlements & usage limits.
 *
 * Source of truth:
 *  - Production (Supabase + Stripe configured): the `subscriptions` / `users`
 *    tables, kept in sync by the Stripe webhook. Authoritative.
 *  - Demo mode (no keys): HTTP-only cookies set by the server. The client
 *    cannot read or forge these via JS, so limits are still enforced
 *    server-side (never trust client-supplied plan state).
 */

export type Plan = "free" | "founding" | "pro";
export type SubStatus =
  | "none"
  | "trialing"
  | "active"
  | "past_due"
  | "canceled"
  | "unpaid";

export interface Entitlements {
  plan: Plan;
  status: SubStatus;
  isPaid: boolean;
  exportCount: number;
  analysisCount: number;
  currentPeriodEnd: string | null;
  customerId: string | null;
  source: "supabase" | "cookie";
}

export const FREE_EXPORT_LIMIT = 1;
export const FREE_ANALYSIS_LIMIT = 1;

const SUB_COOKIE = "mm_sub";
const USAGE_COOKIE = "mm_usage";
const COOKIE_OPTS = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 24 * 365,
};

function computeIsPaid(plan: Plan, status: SubStatus): boolean {
  return (plan === "founding" || plan === "pro") && (status === "active" || status === "trialing");
}

function freeEntitlements(usage: { exports: number; analyses: number }): Entitlements {
  return {
    plan: "free",
    status: "none",
    isPaid: false,
    exportCount: usage.exports,
    analysisCount: usage.analyses,
    currentPeriodEnd: null,
    customerId: null,
    source: "cookie",
  };
}

async function readCookieState() {
  const c = await cookies();
  let sub: { plan?: Plan; status?: SubStatus; currentPeriodEnd?: string; customerId?: string } = {};
  let usage = { exports: 0, analyses: 0 };
  try {
    const raw = c.get(SUB_COOKIE)?.value;
    if (raw) sub = JSON.parse(raw);
  } catch {
    /* ignore malformed */
  }
  try {
    const raw = c.get(USAGE_COOKIE)?.value;
    if (raw) usage = { ...usage, ...JSON.parse(raw) };
  } catch {
    /* ignore malformed */
  }
  return { sub, usage };
}

/** Try to read the authenticated Clerk user id (production only). */
async function getUserId(): Promise<string | null> {
  if (!features.clerk) return null;
  try {
    const { auth } = await import("@clerk/nextjs/server");
    const { userId } = await auth();
    return userId ?? null;
  } catch {
    return null;
  }
}

/** Read entitlements. Safe to call from server components & route handlers. */
export async function getEntitlements(): Promise<Entitlements> {
  const { sub, usage } = await readCookieState();
  const cookiePlan = (sub.plan as Plan) || "free";
  const cookieStatus = (sub.status as SubStatus) || "none";

  // Production: prefer the database as the authoritative source.
  if (features.supabase) {
    const userId = await getUserId();
    if (userId) {
      try {
        const { getSupabaseAdmin } = await import("./supabase");
        const supabase = await getSupabaseAdmin();
        if (supabase) {
          const { data: user } = await supabase
            .from("users")
            .select("id, export_count, free_analysis_used, is_paid_user")
            .eq("clerk_user_id", userId)
            .maybeSingle();
          const { data: subRow } = user
            ? await supabase
                .from("subscriptions")
                .select("plan, status, current_period_end, stripe_customer_id")
                .eq("user_id", user.id)
                .order("created_at", { ascending: false })
                .maybeSingle()
            : { data: null };
          const plan = (subRow?.plan as Plan) || "free";
          const status = (subRow?.status as SubStatus) || "none";
          return {
            plan,
            status,
            isPaid: computeIsPaid(plan, status),
            exportCount: user?.export_count ?? 0,
            analysisCount: user?.free_analysis_used ?? 0,
            currentPeriodEnd: subRow?.current_period_end ?? null,
            customerId: subRow?.stripe_customer_id ?? null,
            source: "supabase",
          };
        }
      } catch {
        /* fall through to cookie state */
      }
    }
  }

  return {
    plan: cookiePlan,
    status: cookieStatus,
    isPaid: computeIsPaid(cookiePlan, cookieStatus),
    exportCount: usage.exports,
    analysisCount: usage.analyses,
    currentPeriodEnd: sub.currentPeriodEnd ?? null,
    customerId: sub.customerId ?? null,
    source: "cookie",
  };
}

/** Increment export usage server-side. Call only from a route handler. */
export async function recordExport(): Promise<Entitlements> {
  const before = await getEntitlements();
  const c = await cookies();
  const { usage } = await readCookieState();
  const next = { ...usage, exports: usage.exports + 1 };
  c.set(USAGE_COOKIE, JSON.stringify(next), COOKIE_OPTS);
  // best-effort DB increment in production
  if (before.source === "supabase") await bumpDbCounter("export_count");
  return { ...before, exportCount: next.exports };
}

export async function recordAnalysis(): Promise<Entitlements> {
  const before = await getEntitlements();
  const c = await cookies();
  const { usage } = await readCookieState();
  const next = { ...usage, analyses: usage.analyses + 1 };
  c.set(USAGE_COOKIE, JSON.stringify(next), COOKIE_OPTS);
  if (before.source === "supabase") await bumpDbCounter("free_analysis_used");
  return { ...before, analysisCount: next.analyses };
}

async function bumpDbCounter(column: "export_count" | "free_analysis_used") {
  try {
    const userId = await getUserId();
    if (!userId) return;
    const { getSupabaseAdmin } = await import("./supabase");
    const supabase = await getSupabaseAdmin();
    if (!supabase) return;
    const { data: user } = await supabase
      .from("users")
      .select(`id, ${column}`)
      .eq("clerk_user_id", userId)
      .maybeSingle();
    if (user) {
      await supabase
        .from("users")
        .update({ [column]: ((user as any)[column] ?? 0) + 1 })
        .eq("id", user.id);
    }
  } catch {
    /* non-fatal */
  }
}

/**
 * Persist an active subscription in a server cookie after a Stripe payment has
 * been verified (used when Supabase isn't the source of truth). This is set by
 * the post-checkout confirm route only after the Stripe session is confirmed paid.
 */
export async function setSubscriptionCookie(
  plan: Exclude<Plan, "free">,
  opts?: { customerId?: string; currentPeriodEnd?: string; status?: SubStatus }
): Promise<void> {
  const c = await cookies();
  const periodEnd = opts?.currentPeriodEnd ?? new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString();
  c.set(
    SUB_COOKIE,
    JSON.stringify({
      plan,
      status: opts?.status ?? "active",
      currentPeriodEnd: periodEnd,
      customerId: opts?.customerId ?? null,
    }),
    COOKIE_OPTS
  );
}

export async function clearSubscriptionCookie(): Promise<void> {
  const c = await cookies();
  c.set(SUB_COOKIE, "", { ...COOKIE_OPTS, maxAge: 0 });
}

export function canExport(e: Entitlements): boolean {
  return e.isPaid || e.exportCount < FREE_EXPORT_LIMIT;
}
export function canAnalyze(e: Entitlements): boolean {
  return e.isPaid || e.analysisCount < FREE_ANALYSIS_LIMIT;
}
