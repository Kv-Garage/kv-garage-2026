import { supabase } from "../../lib/supabase";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { confirm } = req.body;

    if (confirm !== "DELETE_ALL") {
      return res.status(400).json({
        error: "Confirmation required",
      });
    }

    const { error } = await supabase
      .from("products")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000");

    if (error) {
      return res.status(500).json({
        error: error.message,
      });
    }

    return res.status(200).json({
      message: "🔥 ALL PRODUCTS DELETED",
    });

  } catch (err) {
    return res.status(500).json({
      error: err.message || "Server error",
    });
  }
}