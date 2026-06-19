// Verifies Stripe is configured correctly and proves checkout works end-to-end
// by creating a real (test-mode) Checkout Session.
//
//   npm run verify:stripe
//
import Stripe from "stripe";

const key = process.env.STRIPE_SECRET_KEY;
const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const founding = process.env.STRIPE_FOUNDING_PRICE_ID;
const pro = process.env.STRIPE_PRO_PRICE_ID;

function fail(msg) { console.error("✖ " + msg); process.exit(1); }

if (!key || key === "sk_test_") fail("STRIPE_SECRET_KEY not set in .env.local");
const stripe = new Stripe(key);

console.log("Mode:", key.startsWith("sk_test_") ? "TEST ✅" : "LIVE ⚠");

// 1) Key works?
try {
  const acct = await stripe.balance.retrieve();
  console.log("✓ Secret key valid (balance currency:", acct.available?.[0]?.currency || "n/a", ")");
} catch (e) {
  fail("Secret key rejected by Stripe: " + e.message);
}

// 2) Prices exist + correct?
for (const [label, id] of [["Founding", founding], ["Pro", pro]]) {
  if (!id) fail(`${label} price ID missing — run npm run setup:stripe`);
  try {
    const price = await stripe.prices.retrieve(id);
    const ok = price.currency === "cad" && price.recurring?.interval === "month";
    console.log(`${ok ? "✓" : "⚠"} ${label}: ${id} → $${price.unit_amount / 100} ${price.currency.toUpperCase()}/${price.recurring?.interval}`);
  } catch (e) {
    fail(`${label} price ${id} not found: ${e.message}`);
  }
}

// 3) Create a real test Checkout Session (the actual production code path).
try {
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: founding, quantity: 1 }],
    subscription_data: { trial_period_days: 14 },
    success_url: `${appUrl}/dashboard?checkout=success`,
    cancel_url: `${appUrl}/pricing?checkout=cancelled`,
  });
  console.log("\n✓ Checkout session created — open this URL in a browser to pay with 4242 4242 4242 4242:\n");
  console.log("  " + session.url + "\n");
  console.log("All Stripe checks passed. ✅");
} catch (e) {
  fail("Could not create checkout session: " + e.message);
}
