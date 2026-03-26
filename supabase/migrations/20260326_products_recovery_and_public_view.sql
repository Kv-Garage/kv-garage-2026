create table if not exists products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text unique,
  description text,
  price numeric not null default 0,
  compare_price numeric,
  supplier_cost numeric,
  images jsonb default '[]'::jsonb,
  variants jsonb default '[]'::jsonb,
  category text default 'General',
  sku text,
  cj_product_id text,
  top_pick boolean default false,
  is_active boolean default true,
  stock_quantity integer default 0,
  meta_title text,
  meta_description text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table if exists products
  add column if not exists description text,
  add column if not exists compare_price numeric,
  add column if not exists supplier_cost numeric,
  add column if not exists images jsonb default '[]'::jsonb,
  add column if not exists variants jsonb default '[]'::jsonb,
  add column if not exists category text default 'General',
  add column if not exists sku text,
  add column if not exists cj_product_id text,
  add column if not exists top_pick boolean default false,
  add column if not exists is_active boolean default true,
  add column if not exists stock_quantity integer default 0,
  add column if not exists meta_title text,
  add column if not exists meta_description text,
  add column if not exists updated_at timestamptz default now();

update products
set is_active = coalesce(is_active, active, true)
where is_active is null;

alter table products enable row level security;

drop policy if exists "Public read products" on products;
create policy "Public read products" on products
  for select using (true);

drop policy if exists "Admin full access" on products;
create policy "Admin full access" on products
  for all using (auth.role() = 'authenticated');

create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists products_updated_at on products;
create trigger products_updated_at
  before update on products
  for each row execute function update_updated_at();

create or replace view public_products as
select
  id,
  name,
  slug,
  description,
  price,
  compare_price,
  images,
  variants,
  category,
  sku,
  top_pick,
  coalesce(is_active, active, true) as is_active,
  coalesce(stock_quantity, inventory_count, 0) as stock_quantity,
  created_at
from products
where coalesce(is_active, active, true) = true;
