-- ============================================================
-- MarginMind — Seed data
-- Run AFTER schema.sql. Safe to re-run (uses fixed UUIDs + upserts).
-- Mirrors the in-app demo dataset: 1 founder, 3 stores, sample
-- products/orders, a trialing subscription and AI insights.
-- ============================================================

-- Demo founder
insert into public.users (id, clerk_user_id, email, full_name, company, role, is_admin)
values ('00000000-0000-0000-0000-000000000001', 'demo_clerk_sub',
        'zhang2543723434@gmail.com', 'Alex Rivera', 'Northwind Goods Co.', 'Founder', true)
on conflict (id) do nothing;

-- Stores
insert into public.stores (id, user_id, name, channel, market, currency) values
  ('10000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000001','Aurora Living','Shopify','US','USD'),
  ('10000000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000001','Summit Outdoors','Amazon','US','USD'),
  ('10000000-0000-0000-0000-000000000003','00000000-0000-0000-0000-000000000001','Glow Beauty Co.','TikTok Shop','US','USD')
on conflict (id) do nothing;

-- Products (sample of the catalog)
insert into public.products (user_id, store_id, sku, name, category, unit_cost, unit_price) values
  ('00000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000001','AUR-101','Aurora Ceramic Pour-Over Set','Home & Kitchen',19.20,64.00),
  ('00000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000001','AUR-118','Linen Weighted Blanket','Home & Kitchen',45.00,119.00),
  ('00000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000001','AUR-124','Stoneware Dinner Set (12pc)','Home & Kitchen',55.00,142.00),
  ('00000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000002','SUM-201','TrailLite 45L Hiking Pack','Outdoors',46.00,128.00),
  ('00000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000002','SUM-204','Insulated Trail Bottle 32oz','Outdoors',15.60,39.00),
  ('00000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000002','SUM-212','Ultralight 2-Person Tent','Outdoors',81.00,219.00),
  ('00000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000003','GLW-301','Glow Vitamin-C Serum','Beauty',9.60,32.00),
  ('00000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000003','GLW-315','Lip Oil Gloss Duo','Beauty',7.00,19.00)
on conflict (store_id, sku) do nothing;

-- A trialing subscription on the Growth plan (founding price)
insert into public.subscriptions (user_id, plan, status, current_period_end, cancel_at_period_end)
values ('00000000-0000-0000-0000-000000000001','growth','trialing', now() + interval '9 days', false)
on conflict do nothing;

-- Integrations
insert into public.integrations (user_id, provider, status, synced_at) values
  ('00000000-0000-0000-0000-000000000001','shopify','connected', now()),
  ('00000000-0000-0000-0000-000000000001','amazon','connected', now()),
  ('00000000-0000-0000-0000-000000000001','meta','connected', now()),
  ('00000000-0000-0000-0000-000000000001','stripe','connected', now()),
  ('00000000-0000-0000-0000-000000000001','tiktok','available', null),
  ('00000000-0000-0000-0000-000000000001','walmart','available', null)
on conflict (user_id, provider) do nothing;

-- A couple of profit alerts (leaks)
insert into public.profit_alerts (user_id, leak_type, severity, monthly_loss, root_cause, suggested_action) values
  ('00000000-0000-0000-0000-000000000001','High Return Rate','Critical',4200,
   'Insulated Trail Bottle (SUM-204) return rate at 24% vs 5% benchmark.',
   'Audit lid/seal complaints and improve PDP guidance to cut returns.'),
  ('00000000-0000-0000-0000-000000000001','Unprofitable Ad Campaign','Critical',3800,
   'Ultralight Tent (SUM-212) ad spend is 42% of revenue at unprofitable ROAS.',
   'Pause lowest-ROAS ad sets and reallocate to higher-margin winners.')
on conflict do nothing;

-- A starter AI recommendation
insert into public.ai_recommendations (user_id, category, title, priority, confidence, monthly_impact, explanation, suggested_action) values
  ('00000000-0000-0000-0000-000000000001','Ad Budget','Cut ad spend on SUM-212 by 35%','Critical',91,4400,
   'ROAS no longer covers fulfillment on this SKU; the bottom 35% of ad sets are pure leakage.',
   'Pause the lowest-ROAS ad sets and reallocate half the budget to GLW-301.')
on conflict do nothing;
