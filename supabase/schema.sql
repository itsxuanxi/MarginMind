-- ============================================================
-- MarginMind — PostgreSQL / Supabase schema
-- Run in the Supabase SQL editor (or `supabase db push`).
--
-- Multi-tenant by Clerk user. Each tenant table carries `user_id`
-- for fast, simple Row Level Security. RLS maps the Clerk JWT `sub`
-- claim to a row in `users` (configure a Clerk JWT template named
-- "supabase" so requests carry the auth.jwt() -> 'sub' claim).
-- ============================================================

create extension if not exists "pgcrypto";

-- ---------- Enums ----------
do $$ begin
  create type plan_tier as enum ('starter','growth','scale','enterprise');
exception when duplicate_object then null; end $$;

do $$ begin
  create type subscription_status as enum ('trialing','active','past_due','canceled','unpaid');
exception when duplicate_object then null; end $$;

do $$ begin
  create type sales_channel as enum ('Shopify','Amazon','TikTok Shop','Walmart');
exception when duplicate_object then null; end $$;

do $$ begin
  create type sku_status as enum ('Healthy','Good','Low Margin','At Risk','Losing Money');
exception when duplicate_object then null; end $$;

do $$ begin
  create type leak_severity as enum ('Critical','High','Medium','Low');
exception when duplicate_object then null; end $$;

do $$ begin
  create type upload_status as enum ('Processing','Completed','Failed');
exception when duplicate_object then null; end $$;

-- ---------- Core ----------
create table if not exists public.users (
  id                  uuid primary key default gen_random_uuid(),
  clerk_user_id       text unique,
  email               text not null,
  full_name           text,
  company             text,
  role                text default 'Founder',
  is_admin            boolean not null default false,
  -- Subscription & usage (kept in sync by the Stripe webhook + export/AI routes)
  is_paid_user        boolean not null default false,
  free_analysis_used  integer not null default 0,
  export_count        integer not null default 0,
  created_at          timestamptz not null default now()
);

-- For existing databases, add the columns idempotently:
alter table public.users add column if not exists is_paid_user boolean not null default false;
alter table public.users add column if not exists free_analysis_used integer not null default 0;
alter table public.users add column if not exists export_count integer not null default 0;

create table if not exists public.stores (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.users(id) on delete cascade,
  name        text not null,
  channel     sales_channel not null,
  market      text not null default 'US',
  currency    text not null default 'USD',
  created_at  timestamptz not null default now()
);

create table if not exists public.products (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.users(id) on delete cascade,
  store_id      uuid not null references public.stores(id) on delete cascade,
  sku           text not null,
  name          text not null,
  category      text,
  unit_cost     numeric(12,2) not null default 0,
  unit_price    numeric(12,2) not null default 0,
  created_at    timestamptz not null default now(),
  unique (store_id, sku)
);

create table if not exists public.orders (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.users(id) on delete cascade,
  store_id      uuid not null references public.stores(id) on delete cascade,
  external_id   text,
  channel       sales_channel not null,
  market        text not null default 'US',
  ordered_at    date not null default current_date,
  revenue       numeric(12,2) not null default 0,
  status        text not null default 'Fulfilled',
  created_at    timestamptz not null default now()
);

create table if not exists public.order_items (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.users(id) on delete cascade,
  order_id    uuid not null references public.orders(id) on delete cascade,
  product_id  uuid references public.products(id) on delete set null,
  quantity    integer not null default 1,
  unit_price  numeric(12,2) not null default 0,
  unit_cost   numeric(12,2) not null default 0
);

create table if not exists public.ad_spend (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.users(id) on delete cascade,
  product_id  uuid references public.products(id) on delete cascade,
  platform    text not null,
  spend       numeric(12,2) not null default 0,
  spent_on    date not null default current_date
);

create table if not exists public.shipping_costs (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.users(id) on delete cascade,
  order_id    uuid references public.orders(id) on delete cascade,
  product_id  uuid references public.products(id) on delete cascade,
  carrier     text,
  cost        numeric(12,2) not null default 0
);

create table if not exists public.customs_fees (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.users(id) on delete cascade,
  product_id  uuid references public.products(id) on delete cascade,
  market      text not null,
  duty_rate   numeric(6,4) not null default 0,
  fee         numeric(12,2) not null default 0
);

create table if not exists public.returns (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references public.users(id) on delete cascade,
  order_id        uuid references public.orders(id) on delete cascade,
  product_id      uuid references public.products(id) on delete cascade,
  reason          text,
  refund_amount   numeric(12,2) not null default 0,
  returned_at     date not null default current_date
);

-- ---------- Derived / intelligence ----------
create table if not exists public.profit_reports (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references public.users(id) on delete cascade,
  product_id          uuid references public.products(id) on delete cascade,
  period_start        date not null,
  period_end          date not null,
  revenue             numeric(12,2) not null default 0,
  product_cost        numeric(12,2) not null default 0,
  shipping_cost       numeric(12,2) not null default 0,
  customs_fees        numeric(12,2) not null default 0,
  ad_spend            numeric(12,2) not null default 0,
  platform_fees       numeric(12,2) not null default 0,
  return_cost         numeric(12,2) not null default 0,
  storage_cost        numeric(12,2) not null default 0,
  gross_profit        numeric(12,2) not null default 0,
  contribution_margin numeric(12,2) not null default 0,
  net_profit          numeric(12,2) not null default 0,
  margin_pct          numeric(6,2) not null default 0,
  status              sku_status not null default 'Good',
  created_at          timestamptz not null default now()
);

create table if not exists public.profit_alerts (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references public.users(id) on delete cascade,
  product_id      uuid references public.products(id) on delete cascade,
  leak_type       text not null,
  severity        leak_severity not null,
  monthly_loss    numeric(12,2) not null default 0,
  root_cause      text,
  suggested_action text,
  resolved        boolean not null default false,
  created_at      timestamptz not null default now()
);

create table if not exists public.ai_recommendations (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references public.users(id) on delete cascade,
  product_id      uuid references public.products(id) on delete set null,
  category        text not null,
  title           text not null,
  priority        leak_severity not null default 'Medium',
  confidence      integer not null default 80,
  monthly_impact  numeric(12,2) not null default 0,
  explanation     text,
  suggested_action text,
  status          text not null default 'open',
  created_at      timestamptz not null default now()
);

create table if not exists public.uploads (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.users(id) on delete cascade,
  file_name   text not null,
  dataset     text not null,
  row_count   integer not null default 0,
  status      upload_status not null default 'Processing',
  created_at  timestamptz not null default now()
);

create table if not exists public.integrations (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.users(id) on delete cascade,
  provider    text not null,
  status      text not null default 'available',
  synced_at   timestamptz,
  created_at  timestamptz not null default now(),
  unique (user_id, provider)
);

-- ---------- Billing ----------
create table if not exists public.stripe_customers (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references public.users(id) on delete cascade,
  stripe_customer_id  text unique not null,
  created_at          timestamptz not null default now()
);

create table if not exists public.subscriptions (
  id                      uuid primary key default gen_random_uuid(),
  user_id                 uuid not null references public.users(id) on delete cascade,
  stripe_subscription_id  text unique,
  stripe_customer_id      text,
  plan                    plan_tier not null default 'starter',
  status                  subscription_status not null default 'trialing',
  current_period_end      timestamptz,
  cancel_at_period_end    boolean not null default false,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

create table if not exists public.billing_events (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references public.users(id) on delete cascade,
  event_type  text not null,
  stripe_event_id text unique,
  payload     jsonb,
  created_at  timestamptz not null default now()
);

-- ---------- Indexes ----------
create index if not exists idx_stores_user on public.stores(user_id);
create index if not exists idx_products_user on public.products(user_id);
create index if not exists idx_products_store on public.products(store_id);
create index if not exists idx_orders_user on public.orders(user_id);
create index if not exists idx_orders_store on public.orders(store_id);
create index if not exists idx_orders_date on public.orders(ordered_at);
create index if not exists idx_order_items_order on public.order_items(order_id);
create index if not exists idx_ad_spend_product on public.ad_spend(product_id);
create index if not exists idx_returns_product on public.returns(product_id);
create index if not exists idx_profit_reports_user on public.profit_reports(user_id);
create index if not exists idx_profit_alerts_user on public.profit_alerts(user_id);
create index if not exists idx_ai_recs_user on public.ai_recommendations(user_id);
create index if not exists idx_subscriptions_user on public.subscriptions(user_id);

-- ---------- RLS ----------
-- Maps the current Clerk JWT subject to a users.id.
create or replace function public.current_app_user_id()
returns uuid
language sql
stable
as $$
  select id from public.users where clerk_user_id = (auth.jwt() ->> 'sub')
$$;

do $$
declare t text;
begin
  foreach t in array array[
    'users','stores','products','orders','order_items','ad_spend',
    'shipping_costs','customs_fees','returns','profit_reports','profit_alerts',
    'ai_recommendations','uploads','integrations','stripe_customers',
    'subscriptions','billing_events'
  ]
  loop
    execute format('alter table public.%I enable row level security;', t);
  end loop;
end $$;

-- users: a user can see/update only their own row
drop policy if exists users_self on public.users;
create policy users_self on public.users
  for all using (clerk_user_id = (auth.jwt() ->> 'sub'))
  with check (clerk_user_id = (auth.jwt() ->> 'sub'));

-- tenant tables: rows owned by the current app user
do $$
declare t text;
begin
  foreach t in array array[
    'stores','products','orders','order_items','ad_spend',
    'shipping_costs','customs_fees','returns','profit_reports','profit_alerts',
    'ai_recommendations','uploads','integrations','stripe_customers',
    'subscriptions','billing_events'
  ]
  loop
    execute format('drop policy if exists %I_tenant on public.%I;', t, t);
    execute format(
      'create policy %I_tenant on public.%I for all
         using (user_id = public.current_app_user_id())
         with check (user_id = public.current_app_user_id());',
      t, t
    );
  end loop;
end $$;

-- ============================================================
-- Real Data Mode (see migrations/0001_real_data_mode.sql)
-- Uploaded customer data → real per-account dashboard metrics.
-- ============================================================

alter table public.users add column if not exists workspace_token text unique;
alter table public.users add column if not exists data_source text not null default 'sample';

create table if not exists public.uploaded_reports (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references public.users(id) on delete cascade,
  dataset         text not null,
  source          text not null default 'csv',
  file_name       text not null,
  file_size_bytes integer not null default 0,
  row_count       integer not null default 0,
  imported_rows   integer not null default 0,
  status          text not null default 'processing' check (status in ('processing','completed','failed')),
  error           text,
  created_at      timestamptz not null default now()
);

create table if not exists public.profit_metrics (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references public.users(id) on delete cascade,
  upload_id           uuid references public.uploaded_reports(id) on delete cascade,
  source              text not null default 'csv',
  external_order_id   text,
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

create or replace view public.subscription_status as
select s.user_id, s.plan, s.status, s.current_period_end, s.cancel_at_period_end,
       s.stripe_customer_id, (s.status in ('active','trialing')) as is_paid
from public.subscriptions s;

create index if not exists idx_uploaded_reports_user on public.uploaded_reports(user_id);
create index if not exists idx_profit_metrics_user on public.profit_metrics(user_id);
create index if not exists idx_profit_metrics_sku on public.profit_metrics(user_id, sku);

alter table public.uploaded_reports enable row level security;
alter table public.profit_metrics enable row level security;
drop policy if exists uploaded_reports_tenant on public.uploaded_reports;
create policy uploaded_reports_tenant on public.uploaded_reports for all
  using (user_id = public.current_app_user_id()) with check (user_id = public.current_app_user_id());
drop policy if exists profit_metrics_tenant on public.profit_metrics;
create policy profit_metrics_tenant on public.profit_metrics for all
  using (user_id = public.current_app_user_id()) with check (user_id = public.current_app_user_id());
