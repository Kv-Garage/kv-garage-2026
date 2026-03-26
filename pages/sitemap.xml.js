import { supabaseAdmin } from "../lib/supabaseAdmin";

const PUBLIC_ROUTES = [
  "",
  "/shop",
  "/wholesale",
  "/mentorship",
  "/trading",
  "/affiliate",
  "/private-preview",
  "/learn",
  "/deals",
  "/contact",
  "/track-order",
];

export async function getServerSideProps({ res }) {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://www.kvgarage.com";
  const { data: products } = await supabaseAdmin
    .from("products")
    .select("slug,updated_at,created_at,active,is_active")
    .or("active.eq.true,is_active.eq.true")
    .limit(500);

  const urls = [
    ...PUBLIC_ROUTES.map((route) => `<url><loc>${base}${route}</loc></url>`),
    ...(products || [])
      .filter((product) => product.slug)
      .map(
        (product) =>
          `<url><loc>${base}/shop/${product.slug}</loc><lastmod>${new Date(
            product.updated_at || product.created_at || Date.now()
          ).toISOString()}</lastmod></url>`
      ),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;

  res.setHeader("Content-Type", "application/xml");
  res.write(xml);
  res.end();

  return {
    props: {},
  };
}

export default function SitemapXml() {
  return null;
}
