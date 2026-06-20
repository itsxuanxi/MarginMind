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

## 💳 Payments, plans & exports (Stripe — test mode → production)

Without keys the app runs a **demo billing flow**: clicking a plan instantly activates a simulated
subscription (HTTP-only cookie) and unlocks paid features, so the whole funnel is testable. Free
users get **1 export + 1 AI analysis**, then the paywall appears — all enforced **server-side**
([`lib/entitlements.ts`](lib/entitlements.ts), [`app/api/export/route.ts`](app/api/export/route.ts)).

### 1. Create the two CAD prices (Stripe Test Mode first)
In the [Stripe Dashboard → Test mode](https://dashboard.stripe.com/test/products), create two
**recurring monthly** prices in **CAD** and copy their `price_…` IDs:

| Plan | Price | Env var |
| --- | --- | --- |
| Founding Customer | **$9.99 CAD / month** | `STRIPE_FOUNDING_PRICE_ID` |
| Pro | **$29.99 CAD / month** | `STRIPE_PRO_PRICE_ID` |

### 2. Add env vars (`.env.local`)
```
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...        # from step 3
STRIPE_FOUNDING_PRICE_ID=price_...
STRIPE_PRO_PRICE_ID=price_...
```

### 3. Test the webhook locally
```bash
stripe login
stripe listen --forward-to localhost:3000/api/stripe/webhook   # prints whsec_… → STRIPE_WEBHOOK_SECRET
```
The webhook ([`app/api/stripe/webhook/route.ts`](app/api/stripe/webhook/route.ts)) verifies the
signature and handles `checkout.session.completed`, `customer.subscription.created|updated|deleted`,
and `invoice.payment_succeeded|payment_failed`, syncing to Supabase when configured.

### 4. Test the payment
Use Stripe's test card **`4242 4242 4242 4242`**, any future expiry, any CVC/ZIP. Flow: pricing CTA →
(sign in) → Stripe Checkout → pay → redirect to `/dashboard?checkout=success` → subscription active →
paid features unlocked. Manage/cancel via the **Customer Portal** ([`/api/stripe/portal`](app/api/stripe/portal/route.ts)).

### 5. Vercel env vars
Add all six vars above in **Project → Settings → Environment Variables** (set
`NEXT_PUBLIC_APP_URL` to your production URL, e.g. `https://margin-mind.vercel.app`). Add a Vercel
webhook endpoint in Stripe pointing at `https://<your-domain>/api/stripe/webhook`.

### 6. Go live (production switch)
Swap test keys for **live** keys (`sk_live_…`, `pk_live_…`), recreate the two CAD prices in live mode,
update the price-ID + webhook-secret env vars, and redeploy. No code changes required.

### Export (CSV + PDF)
The dashboard / SKU / Settings **Export ▾** menu generates a **CSV** (full metrics, SKU table, leaks,
markets) and a branded **executive PDF** (jsPDF). Access is gated server-side by `/api/export`
(free = 1 export, paid = unlimited). Filenames: `marginmind-report-YYYY-MM-DD.csv`,
`marginmind-executive-report-YYYY-MM-DD.pdf`.

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

## 🟢 Real Data Mode (Supabase)

By default the app runs in **Sample Mode** — every dashboard shows clearly-labeled
sample data. Connect Supabase and upload a CSV, and each account flips to
**Real Data Mode** automatically (the sample banner disappears and metrics are
computed from the uploaded rows).

### 1. Create the database
1. Create a project at [supabase.com](https://supabase.com).
2. SQL Editor → run [`supabase/schema.sql`](supabase/schema.sql) (full schema), or
   apply the migration [`supabase/migrations/0001_real_data_mode.sql`](supabase/migrations/0001_real_data_mode.sql)
   on top of an existing schema.

### 2. Environment variables (local `.env.local` **and** Vercel)
```
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...          # public — safe in the browser
SUPABASE_SERVICE_ROLE_KEY=eyJ...              # SECRET — server only, never expose
```
All server data access uses the **service-role** key and is always scoped to the
current account's `user_id`, so data is isolated per account.

### 3. How accounts are isolated
- With **Clerk** configured → each customer is keyed by `clerk_user_id` (true multi-tenant).
- Without auth yet → an anonymous workspace keyed by an HTTP-only `mm_workspace`
  cookie (per-browser isolation that upgrades cleanly when Clerk is added).

### 4. CSV ingestion
- Upload Data → drop a CSV → **Import**. `POST /api/upload` parses it, auto-detects
  columns (SKU, revenue, product cost, shipping, customs, ad spend, returns, …),
  computes profit via the engine, and writes isolated `profit_metrics` rows.
- Required columns: an **SKU/product** identifier and a **Revenue/Sales** column.
  Everything else is optional (defaults to 0). Invalid/empty files return a clear error.
- The dashboard reads `/api/dataset` and shows real metrics; time-series charts fill
  in as more periods are uploaded.

### 5. Tables (also Shopify-ready)
`users` (+ `workspace_token`, `data_source`), `uploaded_reports`, `profit_metrics`
(carry a `source` column = `csv` today, `shopify` later), `ai_recommendations`,
and a `subscription_status` view over Stripe-synced `subscriptions`. Future Shopify
sync simply writes `source='shopify'` rows into the same `profit_metrics` table — no
schema change needed.
