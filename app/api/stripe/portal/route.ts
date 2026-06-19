import { NextResponse } from "next/server";
import { features } from "@/lib/config";
import { getStripe, getBaseUrl } from "@/lib/stripe";
import { getEntitlements } from "@/lib/entitlements";

export const runtime = "nodejs";

/**
 * Opens the Stripe Customer Portal (cancel, update payment method, invoices).
 * Resolves the customer from the verified entitlements (DB or post-checkout
 * cookie), so it works without a separate database.
 */
export async function POST(req: Request) {
  if (!features.stripe) {
    return NextResponse.json({ url: null, error: "unavailable" }, { status: 503 });
  }

  const ent = await getEntitlements();
  const customerId = ent.customerId || process.env.STRIPE_DEMO_CUSTOMER_ID;
  if (!customerId) {
    return NextResponse.json({ url: null, error: "no_customer" }, { status: 400 });
  }

  try {
    const stripe = getStripe();
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${getBaseUrl(req)}/billing`,
    });
    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe portal error:", err);
    return NextResponse.json({ url: null, error: "stripe_error" }, { status: 500 });
  }
}
