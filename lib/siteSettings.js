import { supabase } from "./supabase";
import { supabaseAdmin } from "./supabaseAdmin";

export const DEFAULT_SITE_SETTINGS = {
  site_name: "KV Garage",
  tagline: "Verified Supplies",
  logo_url: "/logo/Kv%20garage%20icon.png",
  markup_multiplier: 3.2,
  default_currency: "USD",
};

export async function getSiteSettingsClient() {
  const { data, error } = await supabase
    .from("site_settings")
    .select("site_name,tagline,logo_url,markup_multiplier,default_currency")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) {
    return DEFAULT_SITE_SETTINGS;
  }

  return {
    ...DEFAULT_SITE_SETTINGS,
    ...(data || {}),
  };
}

export async function getSiteSettingsAdmin() {
  const { data, error } = await supabaseAdmin
    .from("site_settings")
    .select("site_name,tagline,logo_url,markup_multiplier,default_currency")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) {
    return DEFAULT_SITE_SETTINGS;
  }

  return {
    ...DEFAULT_SITE_SETTINGS,
    ...(data || {}),
  };
}
