update products
set category = 'Watches'
where (
  coalesce(name, '') ilike '%watch%'
  or coalesce(name, '') ilike '%timepiece%'
  or coalesce(name, '') ilike '%chronograph%'
)
and (
  category is null
  or category in ('General', 'general', 'Jewelry', 'jewelry', 'uncategorized')
);
