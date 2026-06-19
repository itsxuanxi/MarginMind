import { NextResponse } from "next/server";
import { appUrl, features } from "@/lib/config";

export const runtime = "nodejs";

/**
 * Opens the Stripe Customer Portal. In a live setup you would look up the
 * signed-in user's `stripe_customer_id` from the database. In demo mode we
 * return null so the UI shows the in-app billing view instead.
 */
export async function POST() {
  if (!features.stripe) {
    return NextResponse.json({ url: null, demo: true });
  }

  const customerId = process.env.STRIPE_DEMO_CUSTOMER_ID; // wire to your DB in production
  if (!customerId) {
    return NextResponse.json({ url: null, demo: true, reason: "no_customer" });
  }

  try {
    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${appUrl}/billing`,
    });
    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe portal error:", err);
    return NextResponse.json({ url: null, demo: true, reason: "stripe_error" });
  }
}
