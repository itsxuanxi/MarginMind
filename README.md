# MarginMind

**AI Profit Agent for Cross-Border E-commerce Sellers.**

Know your real profit across every product, market, and channel. MarginMind tracks true
margins, detects profit leaks, and recommends the actions that grow your bottom line.

> Built to feel like Ramp × Stripe × Linear × Shopify Analytics — premium, trustworthy, and AI-native.

---

## ✨ Highlights

- **Runs with zero API keys.** Every integration (Clerk, Supabase, OpenAI, Stripe) degrades
  gracefully into a high-fidelity **demo mode** backed by a realistic mock dataset. `npm install
  && npm run dev` and you're exploring the full product in under a minute.
- **A real profit engine.** Reusable, pure functions compute gross profit, contribution margin,
  net profit and margin % per SKU — across 5 markets and 4 channels.
- **Profit Leak Detection.** Automatically surfaces high-shipping, return-heavy, customs-heavy,
  unprofitable-ad, declining-margin and negative-contribution SKUs — each quantified with a fix.
- **AI Profit Agent.** Prioritized recommendations with confidence scores and dollar impact,
  plus a grounded chat. Uses OpenAI when configured, otherwise high-quality deterministic answers.

## 🧱 Tech Stack

| Layer | Tech |
| --- | --- |
| Framework | Next.js 15 (App Router) · React 19 · TypeScript |
| Styling | Tailwind CSS v4 · custom shadcn-style UI · Lucide icons |
| Charts | Recharts |
| Auth | Clerk (optional — demo session fallback) |
| Database | Supabase / PostgreSQL with Row Level Security (optional) |
| AI | OpenAI API (optional — mock fallback) |
| Billing | Stripe Checkout · Customer Portal · Webhooks (optional) |
| Deploy | Vercel |

## 🚀 Quick start

```bash
npm install
npm run dev
# open http://localhost:3000
```

That's it. With no `.env` the app runs in demo mode:
- Landing → Pricing → Sign up (demo) → Onboarding → Dashboard all work.
- All app pages render with the bundled mock dataset.
- The AI agent answers from the deterministic engine.
- Billing/checkout flows simulate without charging.

To enable live services, copy `.env.example` to `.env.local` and fill in any subset of keys.

## 🔑 Environment variables

Everything is optional. See [`.env.example`](.env.example) for the full list. Feature detection
lives in [`lib/config.ts`](lib/config.ts).

| Group | Keys | Effect when set |
| --- | --- | --- |
| Clerk | `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY` | Real auth + protected routes |
| Supabase | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` | Live data |
| OpenAI | `OPENAI_API_KEY`, `OPENAI_MODEL` | Live AI chat |
| Stripe | `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_PRICE_*` | Real checkout & billing |
| Admin | `ADMIN_EMAILS` | Gates `/admin` Founder Analytics |

## 🗄️ Database setup (optional)

1. Create a Supabase project.
2. In the SQL editor, run [`supabase/schema.sql`](supabase/schema.sql) then
   [`supabase/seed.sql`](supabase/seed.sql).
3. Add a Clerk **JWT template** named `supabase` so RLS can map `auth.jwt() ->> 'sub'`
   to a `users.clerk_user_id`.
4. Set the Supabase env vars.

The schema includes all 17 tables (`users`, `stores`, `products`, `orders`, `order_items`,
`ad_spend`, `shipping_costs`, `customs_fees`, `returns`, `profit_reports`, `profit_alerts`,
`ai_recommendations`, `uploads`, `integrations`, `subscriptions`, `stripe_customers`,
`billing_events`) with UUID keys, foreign keys, indexes and RLS policies.

## 💳 Stripe setup (optional)

1. Create the three subscription **Products/Prices** and put their IDs in `STRIPE_PRICE_STARTER`,
   `STRIPE_PRICE_GROWTH`, `STRIPE_PRICE_SCALE`.
2. Add `STRIPE_SECRET_KEY` and `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.
3. Create a webhook to `/api/stripe/webhook` and set `STRIPE_WEBHOOK_SECRET`.
4. Checkout includes a **14-day trial**; subscription states map to
   `trialing | active | past_due | canceled | unpaid`.

## 🤖 OpenAI setup (optional)

Set `OPENAI_API_KEY` (and optionally `OPENAI_MODEL`, default `gpt-4o-mini`). The AI route
([`app/api/ai/route.ts`](app/api/ai/route.ts)) grounds the model in your live profit context and
falls back to the deterministic engine on any error — so the agent never breaks.

## 🔐 Auth setup (optional)

Add the Clerk keys and the app automatically mounts `<ClerkProvider>`, real sign-in/up pages and
route protection via [`middleware.ts`](middleware.ts). Without keys, a demo session is used.

## ☁️ Deploy to Vercel

1. Push this repo to GitHub.
2. Import it in Vercel (framework auto-detected as Next.js).
3. Add any env vars you want live (none are required to deploy).
4. Deploy. `.npmrc` sets `legacy-peer-deps=true` so installs are reproducible.

## 🧮 Profit engine reference

```
Gross Profit         = Revenue − Product Cost
Contribution Margin  = Revenue − Product Cost − Ad Spend − Shipping − Platform Fees
Net Profit           = Revenue − Product Cost − Ad Spend − Shipping − Customs
                       − Platform Fees − Return Cost − Storage Cost
Margin %             = (Net Profit / Revenue) × 100
```

Implemented in [`lib/profit.ts`](lib/profit.ts).

## 📁 Project structure

```
app/
  (app)/            authenticated shell + pages (dashboard, sku-analysis, …)
  api/              ai + stripe routes (graceful fallbacks)
  sign-in / sign-up auth (Clerk or demo)
  onboarding/       6-step activation wizard
  page.tsx          landing  ·  pricing/ terms/ privacy/ contact/
components/         ui primitives, charts, layout shell, marketing, admin
lib/                profit engine, mock data, AI, leaks, plans, config, supabase
supabase/           schema.sql + seed.sql (RLS, indexes, seed)
```

## 📄 License

Provided as an MVP reference implementation. Replace legal templates and review security before
commercial launch.
