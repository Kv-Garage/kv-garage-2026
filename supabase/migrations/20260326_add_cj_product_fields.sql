alter table if exists public.products
  add column if not exists compare_price numeric;

alter table if exists public.products
  add column if not exists images jsonb default '[]'::jsonb;

alter table if exists public.products
  add column if not exists variants jsonb default '[]'::jsonb;

alter table if exists public.products
  add column if not exists supplier text;

alter table if exists public.products
  add column if not exists description text;

alter table if exists public.products
  add column if not exists supplier_cost numeric;
