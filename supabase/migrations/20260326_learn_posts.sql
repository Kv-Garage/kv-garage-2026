create table if not exists learn_posts (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text unique not null,
  category text not null,
  excerpt text,
  content_html text,
  cover_image text,
  featured boolean default false,
  is_published boolean default true,
  related_product_slug text,
  published_at timestamptz default now(),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table learn_posts enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'learn_posts'
      and policyname = 'Public read learn posts'
  ) then
    create policy "Public read learn posts"
      on learn_posts
      for select
      using (is_published = true);
  end if;
end $$;

insert into learn_posts (title, slug, category, excerpt, content_html, cover_image, featured)
select *
from (
  values
    (
      'How to Build a Reselling System That Scales',
      'how-to-build-a-reselling-system-that-scales',
      'Business & Reselling',
      'Build a repeatable resale business with stronger supplier sourcing, margin discipline, and fulfillment systems.',
      '<p>Scaling a resale business starts with verified supplier access, pricing discipline, and a repeatable operating cadence. Entrepreneurs who build durable margin do not guess on sourcing. They standardize supplier qualification, track landed cost, and create a predictable merchandising rhythm that compounds over time.</p><p>At KV Garage, we focus on moving beyond random product flipping into structured inventory operations. That means understanding margin bands, reordering the right products, and building a storefront that converts trust into revenue. The result is a supply chain business, not just a side hustle.</p>',
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=80',
      true
    ),
    (
      'Inventory Trading Systems for Modern Operators',
      'inventory-trading-systems-for-modern-operators',
      'Markets & Investing',
      'Treat inventory like an asset class by balancing rotation speed, downside protection, and capital velocity.',
      '<p>Inventory trading is a discipline built around capital velocity. Products become far more powerful when you evaluate them the way sophisticated operators evaluate positions: downside risk, return window, and liquidity. The most resilient operators are not simply buying cheap. They are buying with structure.</p><p>That means using pricing tiers, supply chain timing, and marketing leverage to increase turnover without wrecking margin. The goal is consistent decision quality across every buying cycle.</p>',
      'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80',
      true
    ),
    (
      'Using AI to Create Leverage in Ecommerce',
      'using-ai-to-create-leverage-in-ecommerce',
      'AI & Technology',
      'AI can automate catalog cleanup, content workflows, support triage, and operational decision-making across the store.',
      '<p>AI becomes truly valuable in ecommerce when it reduces decision fatigue and compresses execution time. Instead of only generating copy, strong operators use AI for catalog normalization, support routing, marketing ideation, and workflow acceleration.</p><p>The brands that win with AI do not bolt it on as a novelty feature. They weave it into merchandising, conversion, and customer communication so the system becomes faster, more consistent, and more profitable.</p>',
      'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80',
      true
    )
) as seed(title, slug, category, excerpt, content_html, cover_image, featured)
where not exists (select 1 from learn_posts where learn_posts.slug = seed.slug);
