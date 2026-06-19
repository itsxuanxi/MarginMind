import { NextResponse } from "next/server";
import { appUrl, features } from "@/lib/config";
import { planById, type PlanId } from "@/lib/plans";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const { plan } = (await req.json().catch(() => ({}))) as { plan?: PlanId };

  // Demo mode: no Stripe keys configured. The UI handles a graceful trial flow.
  if (!features.stripe) {
    return NextResponse.json({ url: null, demo: true });
  }

  const planDef = plan ? planById(plan) : undefined;
  const priceId = planDef?.priceEnv ? process.env[planDef.priceEnv] : undefined;
  if (!priceId) {
    return NextResponse.json({ url: null, demo: true, reason: "missing_price" });
  }

  try {
    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      subscription_data: { trial_period_days: 14 },
      allow_promotion_codes: true,
      success_url: `${appUrl}/dashboard?checkout=success`,
      cancel_url: `${appUrl}/pricing?checkout=cancelled`,
    });
    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json({ url: null, demo: true, reason: "stripe_error" });
  }
}
