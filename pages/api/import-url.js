import { supabase } from "../../lib/supabase";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: "Missing URL" });
    }

    // 🔥 FETCH PAGE HTML
    const response = await fetch(url);
    const html = await response.text();

    // 🔥 BASIC PARSING (WORKS ON MOST SITES)
    const getMatch = (regex) => {
      const match = html.match(regex);
      return match ? match[1] : null;
    };

    // 🔥 TRY MULTIPLE TITLE SOURCES
    const name =
      getMatch(/<title>(.*?)<\/title>/i) ||
      getMatch(/"productName":"(.*?)"/i) ||
      "Imported Product";

    // 🔥 IMAGE (tries og:image)
    const image =
      getMatch(/property="og:image" content="(.*?)"/i) ||
      "https://via.placeholder.com/300";

    // 🔥 PRICE (basic detection)
    let supplier_price =
      getMatch(/"price":"(.*?)"/i) ||
      getMatch(/\$(\d+(\.\d+)?)/i);

    supplier_price = Number(supplier_price) || 10;

    const product = {
      name,
      slug: name.toLowerCase().replaceAll(" ", "-"),
      description: `Imported from ${url}`,
      supplier: url.includes("dhgate") ? "dhgate" : "cj",
      category: "glass",

      cost: supplier_price,
      supplier_price,
      price: supplier_price * 3,

      image,
      images: [image],

      fulfillment_type: "dropship",
      inventory_count: 0
    };

    const { error } = await supabase
      .from("products")
      .insert([product]);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({
      message: "✅ Product imported with real data",
      product
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: err.message || "Import failed"
    });
  }
}