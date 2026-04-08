/**
 * POST /api/auth/signup
 * Register a new user with optional affiliate application
 */

import { prisma } from '../../../lib/prisma';
import { generateAffiliateCode, createWallet } from '../../../lib/affiliate-engine';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password, name, wantAffiliate = false, referredBy = null } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Validate password strength
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Verify referrer exists if referredBy is provided
    if (referredBy) {
      const referrer = await prisma.user.findUnique({
        where: { id: referredBy },
      });

      if (!referrer) {
        return res.status(400).json({ error: 'Invalid referral code' });
      }
    }

    // Generate affiliate code if applying for affiliate
    const affiliateCode = wantAffiliate ? generateAffiliateCode(email) : null;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: wantAffiliate ? 'affiliate_pending' : 'customer',
        affiliateCode,
        referredBy,
      },
    });

    // Create wallet for user
    await createWallet(user.id);

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;

    return res.status(201).json({
      success: true,
      user: userWithoutPassword,
      message: wantAffiliate 
        ? 'Account created! Your affiliate application is pending approval.' 
        : 'Account created successfully!',
    });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}