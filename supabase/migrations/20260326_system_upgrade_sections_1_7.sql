create table if not exists site_settings (
  id uuid primary key default gen_random_uuid(),
  site_name text default 'KV Garage',
  tagline text default 'Verified Supplies',
  logo_url text,
  markup_multiplier numeric default 3.2,
  default_currency text default 'USD',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists student_spend (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users,
  order_id uuid references orders(id),
  amount numeric,
  category text,
  created_at timestamptz default now()
);

create table if not exists wishlists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users,
  product_id uuid,
  created_at timestamptz default now()
);

create unique index if not exists wishlists_user_product_idx
  on wishlists(user_id, product_id);

alter table if exists products
  add column if not exists meta_title text,
  add column if not exists meta_description text,
  add column if not exists tags jsonb default '[]'::jsonb,
  add column if not exists is_active boolean default true;

alter table if exists profiles
  add column if not exists is_active boolean default true;

insert into site_settings (site_name, tagline, logo_url, markup_multiplier, default_currency)
select 'KV Garage', 'Verified Supplies', '/logo/Kv%20garage%20icon.png', 3.2, 'USD'
where not exists (select 1 from site_settings);
