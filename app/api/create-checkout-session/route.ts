import { NextResponse } from "next/server";
import { features } from "@/lib/config";
import { getStripe, getBaseUrl, resolvePriceId } from "@/lib/stripe";

export const runtime = "nodejs";

/**
 * Creates a real Stripe Checkout Session for a subscription plan and returns
 * its hosted-checkout URL. Uses your existing Stripe products/prices (resolved
 * dynamically) — only STRIPE_SECRET_KEY is required.
 */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { plan?: string };
  const plan = body.plan === "pro" ? "pro" : body.plan === "founding" ? "founding" : null;
  if (!plan) {
    return NextResponse.json({ error: "Invalid plan." }, { status: 400 });
  }

  if (!features.stripe) {
    return NextResponse.json(
      { error: "Payments are temporarily unavailable. Please try again shortly." },
      { status: 503 }
    );
  }

  // Require sign-in in production (when Clerk is enabled).
  let userId = "";
  let email: string | undefined;
  if (features.clerk) {
    try {
      const { auth, currentUser } = await import("@clerk/nextjs/server");
      const a = await auth();
      if (!a.userId) {
        return NextResponse.json({ redirect: `/sign-up?plan=${plan}&checkout=1` });
      }
      userId = a.userId;
      const u = await currentUser();
      email = u?.primaryEmailAddress?.emailAddress;
    } catch {
      return NextResponse.json({ redirect: `/sign-up?plan=${plan}&checkout=1` });
    }
  }

  try {
    const stripe = getStripe();
    const price = await resolvePriceId(plan);
    const baseUrl = getBaseUrl(req);

    // Reuse a stored Stripe customer when Supabase is wired; otherwise let
    // Stripe collect the email at checkout.
    let customer: string | undefined;
    if (features.supabase && userId) {
      try {
        const { getSupabaseAdmin } = await import("@/lib/supabase");
        const supabase = await getSupabaseAdmin();
        if (supabase) {
          const { data: u } = await supabase.from("users").select("id").eq("clerk_user_id", userId).maybeSingle();
          if (u) {
            const { data: cust } = await supabase
              .from("stripe_customers")
              .select("stripe_customer_id")
              .eq("user_id", u.id)
              .maybeSingle();
            customer = cust?.stripe_customer_id;
            if (!customer) {
              const created = await stripe.customers.create({ email, metadata: { userId } });
              customer = created.id;
              await supabase.from("stripe_customers").insert({ user_id: u.id, stripe_customer_id: customer });
            }
          }
        }
      } catch {
        /* non-fatal — fall back to email checkout */
      }
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price, quantity: 1 }],
      ...(customer ? { customer } : email ? { customer_email: email } : {}),
      subscription_data: {
        metadata: { plan, userId },
      },
      metadata: { plan, userId },
      allow_promotion_codes: true,
      success_url: `${baseUrl}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/billing/cancel`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("create-checkout-session error:", err);
    const message = err instanceof Error ? err.message : "Unable to start checkout.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
