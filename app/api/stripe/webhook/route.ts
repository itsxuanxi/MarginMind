import { NextResponse } from "next/server";
import { features } from "@/lib/config";

export const runtime = "nodejs";

/**
 * Stripe webhook handler.
 *
 * Verifies the signature and reacts to subscription lifecycle events.
 * In production, persist these to the `subscriptions` / `billing_events`
 * tables. With no Stripe secret configured the endpoint acks safely.
 */
export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!features.stripe || !secret) {
    return NextResponse.json({ received: true, demo: true });
  }

  const sig = req.headers.get("stripe-signature");
  if (!sig) return NextResponse.json({ error: "Missing signature" }, { status: 400 });

  const payload = await req.text();

  try {
    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    const event = stripe.webhooks.constructEvent(payload, sig, secret);

    switch (event.type) {
      case "checkout.session.completed":
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
      case "invoice.paid":
      case "invoice.payment_failed":
        // TODO: upsert into Supabase `subscriptions` and log to `billing_events`.
        console.log(`Stripe event: ${event.type}`);
        break;
      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }
}
