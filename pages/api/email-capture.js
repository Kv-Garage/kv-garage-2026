import { supabaseAdmin } from "../../lib/supabaseAdmin";

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim());
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const firstName = String(req.body?.firstName || "").trim();
    const email = String(req.body?.email || "").trim().toLowerCase();
    const interest = String(req.body?.interest || "All of the Above").trim();
    const source = String(req.body?.source || "footer").trim();

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: "Please enter a valid email address." });
    }

    const { error } = await supabaseAdmin.from("email_subscribers").upsert(
      [
        {
          first_name: firstName || null,
          email,
          interest,
          source,
          is_active: true,
        },
      ],
      { onConflict: "email" }
    );

    if (error) {
      throw error;
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("EMAIL CAPTURE ERROR:", error);
    return res.status(500).json({ error: "Something went wrong. Please try again." });
  }
}

