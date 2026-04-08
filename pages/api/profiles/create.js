/**
 * POST /api/profiles/create
 * Create a user profile (server-side, bypasses RLS)
 * Verifies the auth user exists before creating profile
 */

import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { 
      id, 
      email, 
      full_name, 
      phone, 
      company, 
      role, 
      partner, 
      reseller, 
      monthly_volume, 
      has_license, 
      approved 
    } = req.body;

    // Validate required fields
    if (!id || !email) {
      return res.status(400).json({ error: 'User ID and email are required' });
    }

    // Create Supabase admin client with service role key
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // First, verify the auth user exists
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.getUserById(id);
    
    if (authError || !authUser) {
      console.error('Auth user not found:', authError);
      return res.status(404).json({ error: 'User not found in auth system' });
    }

    // Check if profile already exists
    const { data: existingProfile } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('id', id)
      .maybeSingle();

    if (existingProfile) {
      return res.status(409).json({ error: 'Profile already exists', existing: true });
    }

    // Create the profile
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .insert([{
        id,
        email,
        full_name: full_name || null,
        phone: phone || null,
        company: company || null,
        role: role || 'customer',
        partner: partner || null,
        reseller: reseller || false,
        monthly_volume: monthly_volume || null,
        has_license: has_license || false,
        approved: approved !== undefined ? approved : true,
      }]);

    if (error) {
      // If it's a duplicate key error, the profile already exists
      if (error.code === '23505') {
        return res.status(409).json({ error: 'Profile already exists', existing: true });
      }
      
      console.error('Profile creation error:', error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('Profile creation error:', error);
    return res.status(500).json({ error: 'Internal server error: ' + error.message });
  }
}