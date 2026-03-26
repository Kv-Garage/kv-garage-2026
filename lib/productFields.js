export const PUBLIC_PRODUCT_FIELDS = [
  "id",
  "name",
  "slug",
  "description",
  "price",
  "compare_price",
  "image",
  "images",
  "category",
  "sku",
  "variants",
  "top_pick",
  "active",
  "inventory_count",
  "created_at",
  "type",
  "bundle_quantity",
  "moq",
  "wholesale_price",
  "approved",
  "cj_product_id",
  "tags",
  "meta_title",
  "meta_description",
].join(",");

export const ADMIN_PRODUCT_FIELDS = [
  PUBLIC_PRODUCT_FIELDS,
  "supplier_cost",
  "supplier_price",
  "cost",
  "supplier",
  "fulfillment_type",
].join(",");

export function getPrimaryProductImage(product) {
  if (!product) return "/placeholder.jpg";

  if (Array.isArray(product.images) && product.images.length > 0) {
    return product.images[0];
  }

  if (typeof product.images === "string") {
    const splitImages = product.images
      .split(",")
      .map((image) => image.trim())
      .filter(Boolean);

    if (splitImages.length > 0) {
      return splitImages[0];
    }
  }

  return product.image || "/placeholder.jpg";
}

export function getProductImageArray(product) {
  if (!product) return [];

  const imageSet = new Set();

  if (Array.isArray(product.images)) {
    product.images.filter(Boolean).forEach((image) => imageSet.add(image));
  } else if (typeof product.images === "string") {
    product.images
      .split(",")
      .map((image) => image.trim())
      .filter(Boolean)
      .forEach((image) => imageSet.add(image));
  }

  if (product.image) {
    imageSet.add(product.image);
  }

  return Array.from(imageSet);
}

export function isProductVisible(product) {
  if (!product) return false;
  if (typeof product.is_active === "boolean") return product.is_active;
  if (product.is_active == null) return product.active !== false;
  return product.active !== false;
}
