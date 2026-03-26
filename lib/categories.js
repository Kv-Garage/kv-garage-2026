export const CATEGORY_ORDER = [
  "Watches",
  "Jewelry",
  "Nails & Beauty",
  "Skincare",
  "Sports & Apparel",
  "Glass & Devices",
  "Outdoor",
  "Christian Collection",
  "Essentials",
  "General",
];

export const categoryRules = [
  {
    category: "Watches",
    keywords: ["watch", "timepiece", "chronograph", "wristwatch", "smartwatch", "analog", "digital watch"],
  },
  {
    category: "Jewelry",
    keywords: ["necklace", "bracelet", "ring", "earring", "pendant", "chain", "jewelry", "jewellery", "bangle", "anklet", "brooch"],
  },
  {
    category: "Nails & Beauty",
    keywords: ["nail", "polish", "gel", "manicure", "pedicure", "lash", "eyelash", "makeup", "mascara", "lipstick", "foundation", "concealer", "blush", "eyeshadow", "beauty", "cosmetic"],
  },
  {
    category: "Skincare",
    keywords: ["serum", "moisturizer", "cleanser", "toner", "sunscreen", "spf", "retinol", "vitamin c", "skincare", "face cream", "eye cream", "hyaluronic", "collagen", "acne", "exfoliant"],
  },
  {
    category: "Sports & Apparel",
    keywords: ["dress", "shirt", "pants", "jacket", "hoodie", "sneaker", "shoe", "legging", "shorts", "activewear", "sportswear", "gym", "athletic", "yoga", "running", "jersey", "coat", "blazer", "suit", "apparel", "clothing", "fashion", "outfit"],
  },
  {
    category: "Glass & Devices",
    keywords: ["phone case", "screen protector", "charger", "cable", "earbuds", "headphone", "speaker", "tablet", "laptop", "keyboard", "mouse", "gadget", "electronic", "device", "usb", "bluetooth", "wireless"],
  },
  {
    category: "Outdoor",
    keywords: ["outdoor", "camping", "hiking", "fishing", "garden", "backpack", "tent", "survival", "tactical", "knife", "flashlight", "solar", "waterproof"],
  },
  {
    category: "Christian Collection",
    keywords: ["cross", "christian", "bible", "faith", "jesus", "church", "blessed", "prayer", "gospel", "scripture"],
  },
  {
    category: "Essentials",
    keywords: ["organizer", "storage", "kitchen", "home", "cleaning", "towel", "pillow", "bedding", "curtain", "household", "essential", "daily", "bathroom", "laundry"],
  },
];

const WATCH_MATCHER = /(watch|timepiece|chronograph)/i;

export function autoCategorize(name = "", description = "") {
  const text = `${name} ${description}`.toLowerCase();

  for (const rule of categoryRules) {
    if (rule.keywords.some((keyword) => text.includes(keyword))) {
      return rule.category;
    }
  }

  return "General";
}

export function normalizeCategory(value, fallbackName = "") {
  const raw = String(value || "").trim();

  if (!raw) {
    return autoCategorize(fallbackName || "", "");
  }

  const lower = raw.toLowerCase();

  if (WATCH_MATCHER.test(raw)) return "Watches";
  if (["glass", "glass & devices", "devices", "tech"].includes(lower)) return "Glass & Devices";
  if (["jewelry"].includes(lower)) return "Jewelry";
  if (["nails", "beauty", "nails & beauty", "hair"].includes(lower)) return "Nails & Beauty";
  if (["skincare", "skin care"].includes(lower)) return "Skincare";
  if (["sports", "sports & apparel", "apparel"].includes(lower)) return "Sports & Apparel";
  if (["outdoor"].includes(lower)) return "Outdoor";
  if (["christian", "christian collection"].includes(lower)) return "Christian Collection";
  if (["essentials", "comfort", "school", "accessories"].includes(lower)) return "Essentials";
  if (["general", "uncategorized"].includes(lower)) return autoCategorize(fallbackName || "", "");

  return autoCategorize(fallbackName || "", raw);
}

export function sortCategories(values = []) {
  const unique = Array.from(new Set(values.filter(Boolean)));

  return unique.sort((a, b) => {
    const aIndex = CATEGORY_ORDER.indexOf(a);
    const bIndex = CATEGORY_ORDER.indexOf(b);

    if (aIndex === -1 && bIndex === -1) return a.localeCompare(b);
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });
}
