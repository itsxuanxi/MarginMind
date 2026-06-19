// Creates the two MarginMind CAD subscription prices in your Stripe account.
// Idempotent: re-running reuses existing prices (matched by lookup_key).
//
//   npm run setup:stripe        (loads .env.local automatically)
//
import Stripe from "stripe";

const key = process.env.STRIPE_SECRET_KEY;
if (!key || key === "sk_test_") {
  console.error("✖ STRIPE_SECRET_KEY is not set in .env.local");
  process.exit(1);
}
if (!key.startsWith("sk_test_")) {
  console.warn("⚠ This is NOT a test key. Use a sk_test_ key while setting up.\n");
}

const stripe = new Stripe(key);

const PLANS = [
  { lookup: "marginmind_founding", product: "MarginMind — Founding Customer", amount: 999, env: "STRIPE_FOUNDING_PRICE_ID" },
  { lookup: "marginmind_pro", product: "MarginMind — Pro", amount: 2999, env: "STRIPE_PRO_PRICE_ID" },
];

const results = [];

for (const p of PLANS) {
  // Reuse an existing price with this lookup_key if present.
  const existing = await stripe.prices.list({ lookup_keys: [p.lookup], active: true, limit: 1 });
  if (existing.data.length) {
    const price = existing.data[0];
    console.log(`• ${p.product}: reusing existing price ${price.id} (${price.unit_amount / 100} ${price.currency.toUpperCase()})`);
    results.push([p.env, price.id]);
    continue;
  }

  const product = await stripe.products.create({
    name: p.product,
    metadata: { app: "marginmind", plan: p.lookup },
  });
  const price = await stripe.prices.create({
    product: product.id,
    currency: "cad",
    unit_amount: p.amount,
    recurring: { interval: "month" },
    lookup_key: p.lookup,
    metadata: { app: "marginmind" },
  });
  console.log(`✓ ${p.product}: created price ${price.id} ($${p.amount / 100} CAD/mo)`);
  results.push([p.env, price.id]);
}

console.log("\n──────────────────────────────────────────");
console.log("Paste these into .env.local:\n");
for (const [env, id] of results) console.log(`${env}=${id}`);
console.log("──────────────────────────────────────────");
console.log("Then run:  npm run verify:stripe");
