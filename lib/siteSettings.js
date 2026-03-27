import { supabase } from "./supabase";
import { supabaseAdmin } from "./supabaseAdmin";

export const DEFAULT_SITE_SETTINGS = {
  // Basic Information
  site_name: "KV Garage",
  tagline: "Verified Supplies",
  logo_url: "/logo/Kv%20garage%20icon.png",
  favicon_url: "/favicon.ico",
  
  // Business Information
  business_name: "KV Garage",
  business_address: "Grand Rapids, Michigan\nUnited States",
  business_phone: "+1 (555) 123-4567",
  business_email: "support@kvgarage.com",
  business_hours: "Monday - Friday: 9:00 AM - 6:00 PM EST",
  
  // Legal Information
  terms_url: "/terms-and-conditions",
  privacy_url: "/privacy-policy",
  refund_url: "/refund-policy",
  shipping_url: "/shipping-policy",
  risk_disclosure_url: "/risk-disclosure",
  
  // SEO Configuration
  meta_title: "KV Garage | Premium Products & Wholesale Distribution",
  meta_description: "Discover premium products at wholesale prices. KV Garage offers verified supplies with fast shipping and excellent customer service.",
  meta_keywords: "wholesale, products, distribution, premium, verified supplies",
  meta_author: "KV Garage",
  
  // Social Media
  facebook_url: "https://facebook.com/kvgarage",
  instagram_url: "https://instagram.com/kvgarage",
  twitter_url: "https://twitter.com/kvgarage",
  linkedin_url: "https://linkedin.com/company/kvgarage",
  
  // Commerce Settings
  markup_multiplier: 3.2,
  default_currency: "USD",
  currency_symbol: "$",
  tax_rate: 0.08,
  shipping_fee: 9.99,
  free_shipping_threshold: 100.00,
  timezone: "America/New_York",
  
  // System Settings
  maintenance_mode: false,
  allow_registration: true,
  require_email_verification: true,
  
  // Integration Keys
  google_analytics_id: "",
  google_tag_manager_id: "",
  facebook_pixel_id: "",
  mailchimp_api_key: "",
  mailchimp_list_id: "",
  
  // Contact Information
  contact_email: "support@kvgarage.com",
  support_email: "support@kvgarage.com",
  sales_email: "sales@kvgarage.com",
  billing_email: "billing@kvgarage.com",
  
  // Payment Processing
  stripe_publishable_key: "",
  stripe_secret_key: "",
  paypal_client_id: "",
  
  // Shipping & Fulfillment
  default_shipping_method: "standard",
  processing_time_days: 1,
  international_shipping_enabled: true,
  return_policy_days: 30,
  
  // Marketing
  newsletter_enabled: true,
  affiliate_program_enabled: true,
  referral_program_enabled: true,
  
  // Security
  ssl_enabled: true,
  https_redirect: true,
  cookie_consent_enabled: true,
};

export async function getSiteSettingsClient() {
  try {
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.warn("Could not load site settings:", error);
      return DEFAULT_SITE_SETTINGS;
    }

    return {
      ...DEFAULT_SITE_SETTINGS,
      ...(data || {}),
    };
  } catch (err) {
    console.error("Error loading site settings:", err);
    return DEFAULT_SITE_SETTINGS;
  }
}

export async function getSiteSettingsAdmin() {
  try {
    const { data, error } = await supabaseAdmin
      .from("site_settings")
      .select("*")
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.warn("Could not load site settings:", error);
      return DEFAULT_SITE_SETTINGS;
    }

    return {
      ...DEFAULT_SITE_SETTINGS,
      ...(data || {}),
    };
  } catch (err) {
    console.error("Error loading site settings:", err);
    return DEFAULT_SITE_SETTINGS;
  }
}

export async function updateSiteSettings(settings) {
  try {
    const { error } = await supabaseAdmin
      .from("site_settings")
      .upsert(settings, { onConflict: "id" });

    if (error) {
      throw error;
    }

    return { success: true };
  } catch (err) {
    console.error("Error updating site settings:", err);
    return { success: false, error: err.message };
  }
}

// Helper functions for specific settings
export function getBusinessAddress() {
  return DEFAULT_SITE_SETTINGS.business_address;
}

export function getContactEmail() {
  return DEFAULT_SITE_SETTINGS.contact_email;
}

export function getSupportEmail() {
  return DEFAULT_SITE_SETTINGS.support_email;
}

export function getBusinessPhone() {
  return DEFAULT_SITE_SETTINGS.business_phone;
}

export function getBusinessHours() {
  return DEFAULT_SITE_SETTINGS.business_hours;
}

export function getSocialMediaUrls() {
  return {
    facebook: DEFAULT_SITE_SETTINGS.facebook_url,
    instagram: DEFAULT_SITE_SETTINGS.instagram_url,
    twitter: DEFAULT_SITE_SETTINGS.twitter_url,
    linkedin: DEFAULT_SITE_SETTINGS.linkedin_url,
  };
}

export function getLegalUrls() {
  return {
    terms: DEFAULT_SITE_SETTINGS.terms_url,
    privacy: DEFAULT_SITE_SETTINGS.privacy_url,
    refund: DEFAULT_SITE_SETTINGS.refund_url,
    shipping: DEFAULT_SITE_SETTINGS.shipping_url,
    risk: DEFAULT_SITE_SETTINGS.risk_disclosure_url,
  };
}

export function getCommerceSettings() {
  return {
    currency: DEFAULT_SITE_SETTINGS.default_currency,
    currency_symbol: DEFAULT_SITE_SETTINGS.currency_symbol,
    tax_rate: DEFAULT_SITE_SETTINGS.tax_rate,
    shipping_fee: DEFAULT_SITE_SETTINGS.shipping_fee,
    free_shipping_threshold: DEFAULT_SITE_SETTINGS.free_shipping_threshold,
    timezone: DEFAULT_SITE_SETTINGS.timezone,
  };
}

export function getSystemStatus() {
  return {
    maintenance_mode: DEFAULT_SITE_SETTINGS.maintenance_mode,
    allow_registration: DEFAULT_SITE_SETTINGS.allow_registration,
    require_email_verification: DEFAULT_SITE_SETTINGS.require_email_verification,
  };
}

export function getIntegrationKeys() {
  return {
    google_analytics: DEFAULT_SITE_SETTINGS.google_analytics_id,
    google_tag_manager: DEFAULT_SITE_SETTINGS.google_tag_manager_id,
    facebook_pixel: DEFAULT_SITE_SETTINGS.facebook_pixel_id,
    mailchimp_api: DEFAULT_SITE_SETTINGS.mailchimp_api_key,
    mailchimp_list: DEFAULT_SITE_SETTINGS.mailchimp_list_id,
  };
}

export function getPaymentKeys() {
  return {
    stripe_publishable: DEFAULT_SITE_SETTINGS.stripe_publishable_key,
    stripe_secret: DEFAULT_SITE_SETTINGS.stripe_secret_key,
    paypal_client: DEFAULT_SITE_SETTINGS.paypal_client_id,
  };
}

export function getMarketingSettings() {
  return {
    newsletter_enabled: DEFAULT_SITE_SETTINGS.newsletter_enabled,
    affiliate_program_enabled: DEFAULT_SITE_SETTINGS.affiliate_program_enabled,
    referral_program_enabled: DEFAULT_SITE_SETTINGS.referral_program_enabled,
  };
}

export function getSecuritySettings() {
  return {
    ssl_enabled: DEFAULT_SITE_SETTINGS.ssl_enabled,
    https_redirect: DEFAULT_SITE_SETTINGS.https_redirect,
    cookie_consent_enabled: DEFAULT_SITE_SETTINGS.cookie_consent_enabled,
  };
}