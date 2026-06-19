import { NextResponse } from "next/server";
import { features } from "@/lib/config";
import { getStripe } from "@/lib/stripe";
import { setSubscriptionCookie, type Plan } from "@/lib/entitlements";

export const runtime = "nodejs";

/**
 * Called by /billing/success after Stripe redirects back. Verifies the
 * Checkout Session server-side against Stripe and, only if it's genuinely
 * paid/subscribed, activates the subscription (cookie entitlement + DB sync).
 * This ties feature unlocking to a real, verified payment.
 */
export async function POST(req: Request) {
  const { session_id } = (await req.json().catch(() => ({}))) as { session_id?: string };
  if (!session_id) return NextResponse.json({ ok: false, error: "missing_session" }, { status: 400 });
  if (!features.stripe) return NextResponse.json({ ok: false, error: "stripe_unavailable" }, { status: 503 });

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["subscription", "subscription.items.data.price"],
    });

    const paid = session.status === "complete" || session.payment_status === "paid";
    const sub = session.subscription as any;
    const active = sub && ["active", "trialing"].includes(sub.status);
    if (!paid || !active) {
      return NextResponse.json({ ok: false, error: "not_paid" }, { status: 402 });
    }

    const plan = ((session.metadata?.plan || sub?.metadata?.plan) as Plan) || "founding";
    const periodEnd = sub.current_period_end ? new Date(sub.current_period_end * 1000).toISOString() : undefined;

    // Cookie entitlement (works without a database).
    if (plan === "founding" || plan === "pro") {
      await setSubscriptionCookie(plan, {
        customerId: typeof session.customer === "string" ? session.customer : undefined,
        currentPeriodEnd: periodEnd,
        status: sub.status,
      });
    }

    // Database sync when Supabase + Clerk are configured (authoritative).
    if (features.supabase && features.clerk) {
      try {
        const { auth } = await import("@clerk/nextjs/server");
        const { getSupabaseAdmin } = await import("@/lib/supabase");
        const { userId } = await auth();
        const supabase = await getSupabaseAdmin();
        if (userId && supabase) {
          const { data: u } = await supabase.from("users").select("id").eq("clerk_user_id", userId).maybeSingle();
          if (u) {
            await supabase.from("subscriptions").upsert(
              {
                user_id: u.id,
                stripe_subscription_id: sub.id,
                stripe_customer_id: typeof session.customer === "string" ? session.customer : null,
                plan,
                status: sub.status,
                current_period_end: periodEnd ?? null,
                updated_at: new Date().toISOString(),
              },
              { onConflict: "stripe_subscription_id" }
            );
            await supabase.from("users").update({ is_paid_user: true }).eq("id", u.id);
          }
        }
      } catch {
        /* cookie already set — non-fatal */
      }
    }

    return NextResponse.json({ ok: true, plan });
  } catch (err) {
    console.error("checkout confirm error:", err);
    return NextResponse.json({ ok: false, error: "verify_failed" }, { status: 500 });
  }
}
