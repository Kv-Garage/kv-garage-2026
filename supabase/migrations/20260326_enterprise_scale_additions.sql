alter table if exists public.products
  add column if not exists top_pick boolean default false;

alter table if exists public.products
  add column if not exists category text;

alter table if exists public.products
  add column if not exists sku text;

alter table if exists public.products
  add column if not exists cj_product_id text;

alter table if exists public.products
  add column if not exists active boolean default true;

alter table if exists public.orders
  add column if not exists order_number text;

alter table if exists public.orders
  add column if not exists user_id uuid;

alter table if exists public.orders
  add column if not exists items jsonb default '[]'::jsonb;

alter table if exists public.orders
  add column if not exists total numeric default 0;

alter table if exists public.orders
  add column if not exists status text default 'pending';

alter table if exists public.orders
  add column if not exists tracking_number text;

alter table if exists public.orders
  add column if not exists stripe_session_id text;

alter table if exists public.orders
  add column if not exists stripe_event_id text;

alter table if exists public.orders
  add column if not exists customer_email text;

alter table if exists public.orders
  add column if not exists created_at timestamptz default now();

create unique index if not exists orders_order_number_unique_idx
  on public.orders(order_number)
  where order_number is not null;

create unique index if not exists orders_stripe_session_id_unique_idx
  on public.orders(stripe_session_id)
  where stripe_session_id is not null;

create table if not exists public.webhook_logs (
  id uuid default gen_random_uuid() primary key,
  event_id text,
  type text,
  error text,
  created_at timestamptz default now()
);

create table if not exists public.traffic_events (
  id uuid default gen_random_uuid() primary key,
  user_id uuid null,
  page text,
  event_type text,
  timestamp timestamptz default now()
);
