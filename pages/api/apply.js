import { supabase } from "../../lib/supabase";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const {
      name,
      email,
      business_type,
      volume,
      sales_channel,
      experience,
    } = req.body;

    // 🔥 VALIDATION
    if (!name || !email) {
      return res.status(400).json({
        error: "Missing required fields",
      });
    }

    const { error } = await supabase
      .from("applications")
      .insert([
        {
          name,
          email,
          business_type,
          volume,
          sales_channel,
          experience,
          status: "pending",
        },
      ]);

    if (error) {
      console.error("SUPABASE ERROR:", error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({
      success: true,
    });

  } catch (err) {
    console.error("SERVER ERROR:", err);

    return res.status(500).json({
      error: err.message,
    });
  }
}