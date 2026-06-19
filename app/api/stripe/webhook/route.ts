import { NextResponse } from "next/server";
import { features } from "@/lib/config";
import type { Plan, SubStatus } from "@/lib/entitlements";

export const runtime = "nodejs";

function planFromPrice(priceId: string | undefined): Plan {
  if (!priceId) return "free";
  if (priceId === process.env.STRIPE_FOUNDING_PRICE_ID) return "founding";
  if (priceId === process.env.STRIPE_PRO_PRICE_ID) return "pro";
  return "free";
}

const ACTIVE: SubStatus[] = ["active", "trialing"];

async function syncSubscription(sub: any) {
  if (!features.supabase) return;
  try {
    const { getSupabaseAdmin } = await import("@/lib/supabase");
    const supabase = await getSupabaseAdmin();
    if (!supabase) return;

    const userId: string | undefined = sub.metadata?.userId || undefined;
    const customerId: string = sub.customer;
    const priceId: string | undefined = sub.items?.data?.[0]?.price?.id;
    const plan: Plan = (sub.metadata?.plan as Plan) || planFromPrice(priceId);
    const status = sub.status as SubStatus;
    const periodEnd = sub.current_period_end
      ? new Date(sub.current_period_end * 1000).toISOString()
      : null;

    // Resolve the owning user (by metadata, else by stored customer id).
    let userRowId: string | null = null;
    if (userId) {
      const { data } = await supabase.from("users").select("id").eq("clerk_user_id", userId).maybeSingle();
      userRowId = data?.id ?? null;
    }
    if (!userRowId) {
      const { data } = await supabase
        .from("stripe_customers")
        .select("user_id")
        .eq("stripe_customer_id", customerId)
        .maybeSingle();
      userRowId = data?.user_id ?? null;
    }
    if (!userRowId) return;

    await supabase.from("subscriptions").upsert(
      {
        user_id: userRowId,
        stripe_subscription_id: sub.id,
        stripe_customer_id: customerId,
        plan,
        status,
        current_period_end: periodEnd,
        cancel_at_period_end: !!sub.cancel_at_period_end,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "stripe_subscription_id" }
    );

    await supabase
      .from("users")
      .update({ is_paid_user: ACTIVE.includes(status) })
      .eq("id", userRowId);
  } catch (err) {
    console.error("Webhook DB sync failed:", err);
  }
}

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
      case "checkout.session.completed": {
        const session = event.data.object as any;
        if (session.subscription) {
          const sub = await stripe.subscriptions.retrieve(session.subscription as string);
          // carry session metadata (userId/plan) onto the subscription
          (sub as any).metadata = { ...(sub as any).metadata, ...session.metadata };
          await syncSubscription(sub);
        }
        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        await syncSubscription(event.data.object);
        break;
      }
      case "invoice.payment_succeeded":
      case "invoice.payment_failed": {
        const invoice = event.data.object as any;
        if (invoice.subscription) {
          const sub = await stripe.subscriptions.retrieve(invoice.subscription as string);
          await syncSubscription(sub);
        }
        break;
      }
      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }
}
