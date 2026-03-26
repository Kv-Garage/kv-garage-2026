export function stripHtml(html) {
  if (!html) return "";

  return String(html)
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function buildCanonicalUrl(path = "") {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://www.kvgarage.com";
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function buildProductDescription(product) {
  const plainText = stripHtml(product?.description || "");

  if (plainText) {
    return plainText.slice(0, 155);
  }

  return `Shop ${product?.name || "verified inventory"} at KV Garage. Verified supplier pricing with wholesale and retail options available.`;
}
