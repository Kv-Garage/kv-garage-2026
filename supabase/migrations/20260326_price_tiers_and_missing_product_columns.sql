alter table products
  add column if not exists compare_price numeric,
  add column if not exists supplier_cost numeric,
  add column if not exists retail_price numeric,
  add column if not exists wholesale_price numeric,
  add column if not exists student_price numeric,
  add column if not exists is_active boolean default true,
  add column if not exists top_pick boolean default false,
  add column if not exists slug text,
  add column if not exists meta_title text,
  add column if not exists meta_description text,
  add column if not exists stock_quantity integer default 0,
  add column if not exists cj_product_id text,
  add column if not exists variants jsonb default '[]'::jsonb,
  add column if not exists images jsonb default '[]'::jsonb,
  add column if not exists category text default 'General',
  add column if not exists sku text;

update products
set slug = lower(regexp_replace(coalesce(name, ''), '[^a-zA-Z0-9]+', '-', 'g'))
where slug is null or slug = '';

update products
set images = jsonb_build_array(images::text)
where images is not null
  and jsonb_typeof(images) != 'array';

alter table products enable row level security;

drop policy if exists "Public can read active products" on products;
create policy "Public can read active products"
  on products for select
  using (coalesce(is_active, active, true));
