import { supabase } from "./supabase";
import { supabaseAdmin } from "./supabaseAdmin";
import bcrypt from "bcryptjs";

export const AFFILIATE_COMMISSION_RATE = 0.15; // 15% commission

// Affiliate Application Functions
export async function submitAffiliateApplication(data) {
  try {
    const { data: application, error } = await supabase
      .from("affiliate_applications")
      .insert({
        name: data.name,
        email: data.email,
        reason: data.reason,
        status: "pending"
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return { success: true, data: application };
  } catch (err) {
    console.error("Error submitting affiliate application:", err);
    return { success: false, error: err.message };
  }
}

export async function getAffiliateApplicationByEmail(email) {
  try {
    const { data, error } = await supabase
      .from("affiliate_applications")
      .select("*")
      .eq("email", email)
      .single();

    if (error && error.code !== "PGRST116") {
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Error fetching affiliate application:", err);
    return null;
  }
}

// Affiliate Account Functions
export async function createAffiliateAccount(application) {
  try {
    const referralCode = generateReferralCode();
    const passwordHash = await bcrypt.hash("Test1234!", 10); // Default password for approved apps

    const { data: affiliate, error } = await supabaseAdmin
      .from("affiliates")
      .insert({
        name: application.name,
        email: application.email,
        password_hash: passwordHash,
        status: "approved",
        referral_code: referralCode
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return { success: true, data: affiliate };
  } catch (err) {
    console.error("Error creating affiliate account:", err);
    return { success: false, error: err.message };
  }
}

export async function getAffiliateByEmail(email) {
  try {
    const { data, error } = await supabase
      .from("affiliates")
      .select("*")
      .eq("email", email)
      .single();

    if (error && error.code !== "PGRST116") {
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Error fetching affiliate:", err);
    return null;
  }
}

export async function getAffiliateById(id) {
  try {
    const { data, error } = await supabase
      .from("affiliates")
      .select(`
        *,
        affiliate_payouts (
          id,
          amount,
          status,
          payment_method,
          created_at
        ),
        affiliate_conversions (
          id,
          commission_amount,
          created_at,
          orders (
            id,
            order_number,
            total,
            created_at
          )
        ),
        affiliate_clicks (
          id,
          timestamp,
          products (
            id,
            name
          )
        )
      `)
      .eq("id", id)
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Error fetching affiliate by ID:", err);
    return null;
  }
}

export async function authenticateAffiliate(email, password) {
  try {
    const affiliate = await getAffiliateByEmail(email);
    
    if (!affiliate) {
      return { success: false, error: "Invalid credentials" };
    }

    if (affiliate.status !== "approved") {
      return { success: false, error: "Account not approved yet" };
    }

    const isValid = await bcrypt.compare(password, affiliate.password_hash);
    
    if (!isValid) {
      return { success: false, error: "Invalid credentials" };
    }

    return { success: true, data: affiliate };
  } catch (err) {
    console.error("Error authenticating affiliate:", err);
    return { success: false, error: "Authentication failed" };
  }
}

export async function updateAffiliatePassword(affiliateId, newPassword) {
  try {
    const passwordHash = await bcrypt.hash(newPassword, 10);
    
    const { data, error } = await supabaseAdmin
      .from("affiliates")
      .update({ password_hash: passwordHash })
      .eq("id", affiliateId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return { success: true, data };
  } catch (err) {
    console.error("Error updating affiliate password:", err);
    return { success: false, error: err.message };
  }
}

// Tracking Functions
export async function trackAffiliateClick(affiliateId, productId = null) {
  try {
    const { data, error } = await supabase
      .from("affiliate_clicks")
      .insert({
        affiliate_id: affiliateId,
        product_id: productId
      });

    if (error) {
      throw error;
    }

    return { success: true };
  } catch (err) {
    console.error("Error tracking affiliate click:", err);
    return { success: false, error: err.message };
  }
}

export async function createAffiliateConversion(affiliateId, orderId, commissionAmount) {
  try {
    const { data: conversion, error } = await supabaseAdmin
      .from("affiliate_conversions")
      .insert({
        affiliate_id: affiliateId,
        order_id: orderId,
        commission_amount: commissionAmount
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Update affiliate earnings
    await updateAffiliateEarnings(affiliateId, commissionAmount);

    return { success: true, data: conversion };
  } catch (err) {
    console.error("Error creating affiliate conversion:", err);
    return { success: false, error: err.message };
  }
}

export async function updateAffiliateEarnings(affiliateId, commissionAmount) {
  try {
    const { data, error } = await supabaseAdmin.rpc('update_affiliate_earnings', {
      p_affiliate_id: affiliateId,
      p_commission_amount: commissionAmount
    });

    if (error) {
      throw error;
    }

    return { success: true, data };
  } catch (err) {
    console.error("Error updating affiliate earnings:", err);
    return { success: false, error: err.message };
  }
}

// Payout Functions
export async function createPayoutRequest(affiliateId, amount, paymentMethod, paymentDetails) {
  try {
    const { data: payout, error } = await supabaseAdmin
      .from("affiliate_payouts")
      .insert({
        affiliate_id: affiliateId,
        amount: amount,
        status: "pending",
        payment_method: paymentMethod,
        payment_details: paymentDetails
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return { success: true, data: payout };
  } catch (err) {
    console.error("Error creating payout request:", err);
    return { success: false, error: err.message };
  }
}

export async function markPayoutAsPaid(payoutId, affiliateId) {
  try {
    const { data: payout, error } = await supabaseAdmin
      .from("affiliate_payouts")
      .update({ status: "paid" })
      .eq("id", payoutId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Update affiliate earnings
    await updateAffiliatePaidEarnings(affiliateId, payout.amount);

    return { success: true, data: payout };
  } catch (err) {
    console.error("Error marking payout as paid:", err);
    return { success: false, error: err.message };
  }
}

export async function updateAffiliatePaidEarnings(affiliateId, amount) {
  try {
    const { data, error } = await supabaseAdmin.rpc('update_affiliate_paid_earnings', {
      p_affiliate_id: affiliateId,
      p_amount: amount
    });

    if (error) {
      throw error;
    }

    return { success: true, data };
  } catch (err) {
    console.error("Error updating affiliate paid earnings:", err);
    return { success: false, error: err.message };
  }
}

// Admin Functions
export async function getAffiliateApplications(status = null) {
  try {
    let query = supabaseAdmin
      .from("affiliate_applications")
      .select("*")
      .order("created_at", { ascending: false });

    if (status) {
      query = query.eq("status", status);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return data || [];
  } catch (err) {
    console.error("Error fetching affiliate applications:", err);
    return [];
  }
}

export async function getAffiliates(status = null) {
  try {
    let query = supabaseAdmin
      .from("affiliates")
      .select(`
        *,
        affiliate_payouts (
          count
        ),
        affiliate_conversions (
          count
        ),
        affiliate_clicks (
          count
        )
      `)
      .order("created_at", { ascending: false });

    if (status) {
      query = query.eq("status", status);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return data || [];
  } catch (err) {
    console.error("Error fetching affiliates:", err);
    return [];
  }
}

export async function approveAffiliateApplication(applicationId) {
  try {
    const { data: application, error: appError } = await supabaseAdmin
      .from("affiliate_applications")
      .select("*")
      .eq("id", applicationId)
      .single();

    if (appError) {
      throw appError;
    }

    if (!application) {
      throw new Error("Application not found");
    }

    // Update application status
    await supabaseAdmin
      .from("affiliate_applications")
      .update({ status: "approved" })
      .eq("id", applicationId);

    // Create affiliate account
    const result = await createAffiliateAccount(application);

    if (!result.success) {
      throw new Error(result.error);
    }

    return { success: true, affiliate: result.data };
  } catch (err) {
    console.error("Error approving affiliate application:", err);
    return { success: false, error: err.message };
  }
}

export async function rejectAffiliateApplication(applicationId, reason = null) {
  try {
    const { data, error } = await supabaseAdmin
      .from("affiliate_applications")
      .update({ 
        status: "rejected",
        reason: reason 
      })
      .eq("id", applicationId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return { success: true, data };
  } catch (err) {
    console.error("Error rejecting affiliate application:", err);
    return { success: false, error: err.message };
  }
}

export async function getAffiliateAnalytics(affiliateId) {
  try {
    const { data, error } = await supabase
      .from("affiliates")
      .select(`
        total_earnings,
        pending_earnings,
        paid_earnings,
        affiliate_clicks (
          count
        ),
        affiliate_conversions (
          count,
          commission_amount
        ),
        affiliate_payouts (
          count,
          amount
        )
      `)
      .eq("id", affiliateId)
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Error fetching affiliate analytics:", err);
    return null;
  }
}

// Helper Functions
function generateReferralCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export function getReferralUrl(code) {
  return `${process.env.NEXT_PUBLIC_BASE_URL}?ref=${code}`;
}

export function calculateCommission(orderTotal) {
  return orderTotal * AFFILIATE_COMMISSION_RATE;
}