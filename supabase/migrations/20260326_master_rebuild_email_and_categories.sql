create table if not exists email_subscribers (
  id uuid default gen_random_uuid() primary key,
  first_name text,
  email text unique not null,
  interest text,
  source text default 'footer',
  subscribed_at timestamptz default now(),
  is_active boolean default true
);

alter table email_subscribers enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'email_subscribers'
      and policyname = 'Admin manages email subscribers'
  ) then
    create policy "Admin manages email subscribers"
      on email_subscribers
      for all
      using (auth.role() = 'authenticated')
      with check (auth.role() = 'authenticated');
  end if;
end $$;

update products
set category = case
  when lower(coalesce(name, '') || ' ' || coalesce(description, '')) like any (array['%watch%','%timepiece%','%chronograph%','%wristwatch%','%smartwatch%','%analog%','%digital watch%']) then 'Watches'
  when lower(coalesce(name, '') || ' ' || coalesce(description, '')) like any (array['%necklace%','%bracelet%','%ring%','%earring%','%pendant%','%chain%','%jewelry%','%jewellery%','%bangle%','%anklet%','%brooch%']) then 'Jewelry'
  when lower(coalesce(name, '') || ' ' || coalesce(description, '')) like any (array['%nail%','%polish%','%gel%','%manicure%','%pedicure%','%lash%','%eyelash%','%makeup%','%mascara%','%lipstick%','%foundation%','%concealer%','%blush%','%eyeshadow%','%beauty%','%cosmetic%']) then 'Nails & Beauty'
  when lower(coalesce(name, '') || ' ' || coalesce(description, '')) like any (array['%serum%','%moisturizer%','%cleanser%','%toner%','%sunscreen%','%spf%','%retinol%','%vitamin c%','%skincare%','%face cream%','%eye cream%','%hyaluronic%','%collagen%','%acne%','%exfoliant%']) then 'Skincare'
  when lower(coalesce(name, '') || ' ' || coalesce(description, '')) like any (array['%dress%','%shirt%','%pants%','%jacket%','%hoodie%','%sneaker%','%shoe%','%legging%','%shorts%','%activewear%','%sportswear%','%gym%','%athletic%','%yoga%','%running%','%jersey%','%coat%','%blazer%','%suit%','%apparel%','%clothing%','%fashion%','%outfit%']) then 'Sports & Apparel'
  when lower(coalesce(name, '') || ' ' || coalesce(description, '')) like any (array['%phone case%','%screen protector%','%charger%','%cable%','%earbuds%','%headphone%','%speaker%','%tablet%','%laptop%','%keyboard%','%mouse%','%gadget%','%electronic%','%device%','%usb%','%bluetooth%','%wireless%']) then 'Glass & Devices'
  when lower(coalesce(name, '') || ' ' || coalesce(description, '')) like any (array['%outdoor%','%camping%','%hiking%','%fishing%','%garden%','%backpack%','%tent%','%survival%','%tactical%','%knife%','%flashlight%','%solar%','%waterproof%']) then 'Outdoor'
  when lower(coalesce(name, '') || ' ' || coalesce(description, '')) like any (array['%cross%','%christian%','%bible%','%faith%','%jesus%','%church%','%blessed%','%prayer%','%gospel%','%scripture%']) then 'Christian Collection'
  when lower(coalesce(name, '') || ' ' || coalesce(description, '')) like any (array['%organizer%','%storage%','%kitchen%','%home%','%cleaning%','%towel%','%pillow%','%bedding%','%curtain%','%household%','%essential%','%daily%','%bathroom%','%laundry%']) then 'Essentials'
  else 'General'
end
where category is null or category = 'General';
