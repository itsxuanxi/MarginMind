-- ============================================================
-- MarginMind — Real Data Mode migration
-- Additive & idempotent. Safe to run on top of schema.sql.
--
-- Adds the tables that turn uploaded customer CSVs into real,
-- per-account dashboard metrics, and prepares for future Shopify sync.
-- ============================================================

create extension if not exists "pgcrypto";

-- ---------- users: anonymous workspace + data-source tracking ----------
alter table public.users add column if not exists workspace_token text unique;
alter table public.users add column if not exists data_source text not null default 'sample';
-- data_source: 'sample' | 'csv' | 'shopify'

-- ---------- uploaded_reports: one row per CSV import (or future sync) ----------
create table if not exists public.uploaded_reports (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references public.users(id) on delete cascade,
  dataset         text not null,                         -- products | orders | costs | ...
  source          text not null default 'csv',           -- 'csv' | 'shopify' (future)
  file_name       text not null,
  file_size_bytes integer not null default 0,
  row_count       integer not null default 0,
  imported_rows   integer not null default 0,
  status          text not null default 'processing'
                    check (status in ('processing','completed','failed')),
  error           text,
  created_at      timestamptz not null default now()
);

-- ---------- profit_metrics: normalized per-SKU profit rows ----------
create table if not exists public.profit_metrics (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references public.users(id) on delete cascade,
  upload_id           uuid references public.uploaded_reports(id) on delete cascade,
  source              text not null default 'csv',         -- 'csv' | 'shopify' (future)
  external_order_id   text,                                 -- reserved for Shopify order mapping
  sku                 text not null,
  product_name        text,
  store               text,
  market              text,
  channel             text,
  units               integer not null default 0,
  revenue             numeric(14,2) not null default 0,
  product_cost        numeric(14,2) not null default 0,
  shipping_cost       numeric(14,2) not null default 0,
  customs_fees        numeric(14,2) not null default 0,
  ad_spend            numeric(14,2) not null default 0,
  platform_fees       numeric(14,2) not null default 0,
  return_cost         numeric(14,2) not null default 0,
  storage_cost        numeric(14,2) not null default 0,
  gross_profit        numeric(14,2) not null default 0,
  contribution_margin numeric(14,2) not null default 0,
  net_profit          numeric(14,2) not null default 0,
  margin_pct          numeric(8,2)  not null default 0,
  status              text not null default 'Good',
  period_start        date,
  period_end          date,
  created_at          timestamptz not null default now()
);

-- ---------- ai_recommendations: ensure present (also in schema.sql) ----------
create table if not exists public.ai_recommendations (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references public.users(id) on delete cascade,
  product_id      uuid,
  category        text not null,
  title           text not null,
  priority        text not null default 'Medium',
  confidence      integer not null default 80,
  monthly_impact  numeric(12,2) not null default 0,
  explanation     text,
  suggested_action text,
  related_sku     text,
  status          text not null default 'open',
  created_at      timestamptz not null default now()
);

-- ---------- subscription_status: clean read model over Stripe-synced subs ----------
create or replace view public.subscription_status as
select
  s.user_id,
  s.plan,
  s.status,
  s.current_period_end,
  s.cancel_at_period_end,
  s.stripe_customer_id,
  (s.status in ('active', 'trialing')) as is_paid
from public.subscriptions s;

-- ---------- Indexes ----------
create index if not exists idx_uploaded_reports_user on public.uploaded_reports(user_id);
create index if not exists idx_profit_metrics_user on public.profit_metrics(user_id);
create index if not exists idx_profit_metrics_upload on public.profit_metrics(upload_id);
create index if not exists idx_profit_metrics_sku on public.profit_metrics(user_id, sku);
create index if not exists idx_users_workspace on public.users(workspace_token);

-- ---------- RLS (server uses the service role; these guard client/Clerk access) ----------
alter table public.uploaded_reports enable row level security;
alter table public.profit_metrics enable row level security;

drop policy if exists uploaded_reports_tenant on public.uploaded_reports;
create policy uploaded_reports_tenant on public.uploaded_reports
  for all using (user_id = public.current_app_user_id())
  with check (user_id = public.current_app_user_id());

drop policy if exists profit_metrics_tenant on public.profit_metrics;
create policy profit_metrics_tenant on public.profit_metrics
  for all using (user_id = public.current_app_user_id())
  with check (user_id = public.current_app_user_id());
