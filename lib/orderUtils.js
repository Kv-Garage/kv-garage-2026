const ORDER_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function buildOrderItems(items = []) {
  return items.map((item) => ({
    product_id: item.id || null,
    name: item.name || "Product",
    qty: Math.max(1, Number(item.quantity) || 1),
    price: Number(item.price) || 0,
    image: item.image || null,
    category: item.category || "general",
    applied_tier: item.applied_tier || null,
  }));
}

export function generateCandidateOrderNumber() {
  let suffix = "";

  for (let index = 0; index < 6; index += 1) {
    suffix += ORDER_CHARS[Math.floor(Math.random() * ORDER_CHARS.length)];
  }

  return `KVG-${suffix}`;
}

export async function generateUniqueOrderNumber(supabase) {
  for (let attempt = 0; attempt < 25; attempt += 1) {
    const orderNumber = generateCandidateOrderNumber();
    const { data } = await supabase
      .from("orders")
      .select("id")
      .eq("order_number", orderNumber)
      .maybeSingle();

    if (!data) {
      return orderNumber;
    }
  }

  throw new Error("Could not generate a unique order number");
}

export function getOrderStatusSteps() {
  return ["pending", "confirmed", "shipped", "delivered"];
}

export function deriveStudentSpendCategory(items = []) {
  const category = items.find((item) => item?.category)?.category;
  return category || "general";
}
