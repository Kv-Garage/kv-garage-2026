import { calculatePrice } from "./pricing";
import { autoCategorize, normalizeCategory } from "./categories";

function toNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function asArray(value) {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [value];
}

function uniqueStrings(values) {
  return Array.from(new Set(values.filter((value) => typeof value === "string" && value.trim()))).map((value) =>
    value.trim()
  );
}

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function buildImages(cjProduct) {
  const candidateImages = uniqueStrings([
    ...asArray(cjProduct?.images),
    ...asArray(cjProduct?.productImages),
    ...asArray(cjProduct?.productImageList),
    ...asArray(cjProduct?.extraImage),
    ...asArray(cjProduct?.extraImages),
    cjProduct?.productImage,
    cjProduct?.mainImage,
    ...asArray(cjProduct?.variantImage),
    ...asArray(cjProduct?.variantImages),
    ...asArray(cjProduct?.variants).flatMap((variant) =>
      uniqueStrings([
        variant?.variantImage,
        variant?.image,
        variant?.variantImg,
      ])
    ),
  ]);

  return candidateImages.filter((image) => /^https?:\/\//i.test(image));
}

function buildVariants(cjProduct) {
  const variants = asArray(
    cjProduct?.variants ||
      cjProduct?.variantList ||
      cjProduct?.skuList ||
      cjProduct?.productSku ||
      cjProduct?.skus
  );

  return variants.map((variant, index) => {
    const supplierCost =
      toNumber(variant?.sellPrice) ??
      toNumber(variant?.price) ??
      toNumber(variant?.variantPrice) ??
      null;

    const sellPrice =
      supplierCost != null
        ? calculatePrice({
            cost: supplierCost,
            quantity: 1,
            role: "retail",
            cartTotal: 0,
          })
        : null;

    return {
      id: variant?.id || variant?.vid || variant?.sku || variant?.variantKey || `cj-variant-${index + 1}`,
      sku: variant?.sku || variant?.productSku || variant?.variantKey || null,
      name: variant?.variantName || variant?.name || variant?.skuName || null,
      image: variant?.variantImage || variant?.image || variant?.variantImg || null,
      supplier_cost: supplierCost,
      price: sellPrice,
      compare_price:
        toNumber(variant?.marketPrice) ??
        toNumber(variant?.comparePrice) ??
        toNumber(variant?.msrp) ??
        null,
      raw: variant,
    };
  });
}

export function normalizeCJProduct(cjProduct, options = {}) {
  const name =
    cjProduct?.productNameEn ||
    cjProduct?.productName ||
    cjProduct?.name ||
    "CJ Product";

  const description = (
    cjProduct?.descriptionHtml ||
      cjProduct?.productDescription ||
      cjProduct?.description ||
      cjProduct?.desc ||
      ""
  ).trim();

  const images = buildImages(cjProduct);
  const variants = buildVariants(cjProduct);

  const supplierCost =
    toNumber(cjProduct?.sellPrice) ??
    toNumber(cjProduct?.price) ??
    toNumber(cjProduct?.productPrice) ??
    variants.find((variant) => variant.supplier_cost != null)?.supplier_cost ??
    0;

  const price = calculatePrice({
    cost: supplierCost,
    quantity: 1,
    role: "retail",
    cartTotal: 0,
    markupMultiplier: Number(options.markupMultiplier || 0) || undefined,
  });

  const comparePrice =
    toNumber(cjProduct?.marketPrice) ??
    toNumber(cjProduct?.comparePrice) ??
    toNumber(cjProduct?.msrp) ??
    variants.find((variant) => variant.compare_price)?.compare_price ??
    null;

  const slugBase = slugify(name) || "cj-product";
  const slugSuffix = slugify(cjProduct?.productCode || cjProduct?.pid || cjProduct?.id || "");
  const slug = slugSuffix ? `${slugBase}-${slugSuffix}` : slugBase;

  return {
    name,
    description,
    image: images[0] || null,
    images,
    variants,
    supplier_cost: supplierCost,
    price,
    compare_price: comparePrice,
    supplier: "cj",
    category:
      normalizeCategory(cjProduct?.categoryName, name) ||
      autoCategorize(name, description),
    sku: cjProduct?.productSku || cjProduct?.productCode || null,
    cj_product_id: cjProduct?.pid || cjProduct?.id || null,
    slug,
    supplier_price: supplierCost,
    cost: supplierCost,
    fulfillment_type: "dropship",
    inventory_count: 0,
    is_active: true,
    active: true,
    raw: cjProduct,
  };
}
