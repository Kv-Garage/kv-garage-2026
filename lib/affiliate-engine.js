/**
 * KV Garage Affiliate Engine - Core Business Logic
 * Institutional-grade commission calculation and genealogy management
 */

import { prisma } from './prisma';
import crypto from 'crypto';

// ============================================
// CONSTANTS & CONFIGURATION
// ============================================

export const COMMISSION_CONFIG = {
  MINIMUM_ORDER_TOTAL: 250, // Commission only applies if order >= $250
  LEVELS: {
    1: 0.07, // 7% for direct referrer
    2: 0.04, // 4% for parent
    3: 0.02, // 2% for grandparent
  },
  MAX_LEVEL: 3,
};

export const PAYOUT_CONFIG = {
  MINIMUM_WITHDRAWAL: 250,
};

// ============================================
// AFFILIATE CODE GENERATION
// ============================================

/**
 * Generate a unique affiliate code for a user
 */
export function generateAffiliateCode(email) {
  const timestamp = Date.now().toString(36);
  const random = crypto.randomBytes(4).toString('hex');
  const base = email.split('@')[0].toUpperCase().slice(0, 4);
  return `${base}-${timestamp}-${random.slice(0, 4)}`.toUpperCase();
}

/**
 * Get user by affiliate code
 */
export async function getUserByAffiliateCode(code) {
  if (!code) return null;
  
  return prisma.user.findUnique({
    where: { affiliateCode: code },
    include: {
      wallet: true,
    },
  });
}

// ============================================
// GENEALOGY TREE MANAGEMENT
// ============================================

/**
 * Build the genealogy path for a user
 * Returns array of ancestor user IDs from immediate referrer to root
 */
export async function buildGenealogyPath(userId, maxDepth = COMMISSION_CONFIG.MAX_LEVEL) {
  const path = [];
  let currentUserId = userId;
  
  for (let i = 0; i < maxDepth; i++) {
    const user = await prisma.user.findUnique({
      where: { id: currentUserId },
      select: { referredBy: true },
    });
    
    if (!user || !user.referredBy) break;
    
    path.push({
      userId: user.referredBy,
      level: i + 1,
    });
    
    currentUserId = user.referredBy;
  }
  
  return path;
}

/**
 * Get the full genealogy tree for an affiliate
 */
export async function getGenealogyTree(userId, depth = 5) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      referrals: {
        include: {
          wallet: true,
        },
      },
    },
  });
  
  if (!user) return null;
  
  return {
    id: user.id,
    email: user.email,
    affiliateCode: user.affiliateCode,
    level: 0,
    children: await buildTreeChildren(user.id, 1, depth),
  };
}

async function buildTreeChildren(parentId, currentLevel, maxDepth) {
  if (currentLevel > maxDepth) return [];
  
  const children = await prisma.user.findMany({
    where: { referredBy: parentId },
    include: {
      wallet: true,
    },
  });
  
  const tree = [];
  for (const child of children) {
    tree.push({
      id: child.id,
      email: child.email,
      affiliateCode: child.affiliateCode,
      level: currentLevel,
      wallet: child.wallet,
      children: await buildTreeChildren(child.id, currentLevel + 1, maxDepth),
    });
  }
  
  return tree;
}

// ============================================
// COMMISSION CALCULATION
// ============================================

/**
 * Calculate commissions for an order
 * Returns array of commission objects for each level
 */
export function calculateCommissions(orderTotal, genealogyPath) {
  // No commission if order is below minimum
  if (orderTotal < COMMISSION_CONFIG.MINIMUM_ORDER_TOTAL) {
    return [];
  }
  
  const commissions = [];
  
  for (const { userId, level } of genealogyPath) {
    const rate = COMMISSION_CONFIG.LEVELS[level];
    if (!rate) continue;
    
    const amount = orderTotal * rate;
    
    commissions.push({
      userId,
      level,
      amount: Math.round(amount * 100) / 100, // Round to 2 decimal places
    });
  }
  
  return commissions;
}

/**
 * Create commissions for an order and save to database
 */
export async function createCommissions(orderId, commissions) {
  if (commissions.length === 0) return [];
  
  const createdCommissions = [];
  
  for (const commission of commissions) {
    try {
      const created = await prisma.commission.create({
        data: {
          orderId,
          userId: commission.userId,
          level: commission.level,
          amount: commission.amount,
          status: 'pending',
        },
      });
      createdCommissions.push(created);
    } catch (error) {
      // Skip if duplicate (unique constraint)
      if (error.code !== 'P2002') {
        console.error(`Error creating commission for user ${commission.userId}:`, error);
      }
    }
  }
  
  return createdCommissions;
}

// ============================================
// WALLET MANAGEMENT
// ============================================

/**
 * Create a wallet for a user
 */
export async function createWallet(userId) {
  return prisma.wallet.create({
    data: {
      userId,
      balance: 0,
      pendingBalance: 0,
      lifetimeEarnings: 0,
    },
  });
}

/**
 * Get wallet for a user
 */
export async function getWallet(userId) {
  return prisma.wallet.findUnique({
    where: { userId },
  });
}

/**
 * Move pending commissions to available balance
 */
export async function movePendingToAvailable(userId) {
  const wallet = await getWallet(userId);
  if (!wallet) return null;
  
  const pendingCommissions = await prisma.commission.findMany({
    where: {
      userId,
      status: 'pending',
    },
  });
  
  if (pendingCommissions.length === 0) return wallet;
  
  const totalPending = pendingCommissions.reduce((sum, c) => sum + c.amount.toNumber(), 0);
  
  // Update commissions to available
  await prisma.commission.updateMany({
    where: {
      userId,
      status: 'pending',
    },
    data: {
      status: 'available',
    },
  });
  
  // Update wallet
  return prisma.wallet.update({
    where: { userId },
    data: {
      pendingBalance: {
        decrement: totalPending,
      },
      balance: {
        increment: totalPending,
      },
    },
  });
}

/**
 * Update wallet with commission
 */
export async function creditCommission(userId, amount) {
  return prisma.wallet.update({
    where: { userId },
    data: {
      pendingBalance: {
        increment: amount,
      },
      lifetimeEarnings: {
        increment: amount,
      },
    },
  });
}

// ============================================
// PAYOUT MANAGEMENT
// ============================================

/**
 * Create a payout request
 */
export async function createPayoutRequest(userId, amount, paymentMethod, paymentDetails) {
  const wallet = await getWallet(userId);
  
  if (!wallet) {
    throw new Error('Wallet not found');
  }
  
  if (amount < PAYOUT_CONFIG.MINIMUM_WITHDRAWAL) {
    throw new Error(`Minimum withdrawal is $${PAYOUT_CONFIG.MINIMUM_WITHDRAWAL}`);
  }
  
  if (wallet.balance < amount) {
    throw new Error('Insufficient balance');
  }
  
  // Create payout request
  const payout = await prisma.payout.create({
    data: {
      userId,
      amount,
      status: 'pending',
      paymentMethod,
      paymentDetails,
    },
  });
  
  // Deduct from balance immediately (hold the funds)
  await prisma.wallet.update({
    where: { userId },
    data: {
      balance: {
        decrement: amount,
      },
    },
  });
  
  return payout;
}

/**
 * Approve and process a payout
 */
export async function approvePayout(payoutId, adminNotes = null) {
  const payout = await prisma.payout.findUnique({
    where: { id: payoutId },
    include: { user: true },
  });
  
  if (!payout) {
    throw new Error('Payout not found');
  }
  
  if (payout.status !== 'pending') {
    throw new Error('Payout is not pending');
  }
  
  return prisma.payout.update({
    where: { id: payoutId },
    data: {
      status: 'paid',
      adminNotes,
      processedAt: new Date(),
    },
  });
}

/**
 * Reject a payout and return funds to balance
 */
export async function rejectPayout(payoutId, adminNotes = null) {
  const payout = await prisma.payout.findUnique({
    where: { id: payoutId },
    include: { user: true },
  });
  
  if (!payout) {
    throw new Error('Payout not found');
  }
  
  if (payout.status !== 'pending') {
    throw new Error('Payout is not pending');
  }
  
  // Return funds to user's balance
  await prisma.wallet.update({
    where: { userId: payout.userId },
    data: {
      balance: {
        increment: payout.amount,
      },
    },
  });
  
  return prisma.payout.update({
    where: { id: payoutId },
    data: {
      status: 'rejected',
      adminNotes,
      processedAt: new Date(),
    },
  });
}

// ============================================
// AFFILIATE TRACKING
// ============================================

/**
 * Track an affiliate click
 */
export async function trackAffiliateClick(affiliateCode, req) {
  return prisma.affiliateClick.create({
    data: {
      affiliateCode,
      visitorId: req.cookies?.visitorId || crypto.randomBytes(16).toString('hex'),
      ipAddress: req.ip || req.headers['x-forwarded-for'],
      userAgent: req.headers['user-agent'],
      referer: req.headers['referer'],
      path: req.url,
    },
  });
}

/**
 * Track an affiliate conversion
 */
export async function trackAffiliateConversion(affiliateCode, orderId, conversionValue) {
  return prisma.affiliateConversion.create({
    data: {
      affiliateCode,
      orderId,
      conversionValue,
    },
  });
}

// ============================================
// USER MANAGEMENT
// ============================================

/**
 * Register a new user with optional affiliate application
 */
export async function registerUser(email, password, name, wantAffiliate = false, referredBy = null) {
  // Check if user exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });
  
  if (existingUser) {
    throw new Error('User already exists');
  }
  
  // Generate affiliate code if applying for affiliate
  const affiliateCode = wantAffiliate ? generateAffiliateCode(email) : null;
  
  // Hash password (using bcrypt in production)
  const bcrypt = require('bcryptjs');
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
  
  // Create genealogy node
  if (referredBy) {
    await createGenealogyNode(user.id, referredBy);
  }
  
  return user;
}

/**
 * Approve an affiliate application
 */
export async function approveAffiliate(userId) {
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      role: 'affiliate',
    },
  });
  
  return user;
}

/**
 * Create a genealogy node for a user
 */
async function createGenealogyNode(userId, parentId) {
  const parentNode = await prisma.genealogyNode.findUnique({
    where: { userId: parentId },
  });
  
  const parentPath = parentNode ? parentNode.path : '/';
  const newPath = `${parentPath}${userId}/`;
  
  return prisma.genealogyNode.create({
    data: {
      userId,
      parentId,
      level: (parentNode?.level || 0) + 1,
      path: newPath,
    },
  });
}

// ============================================
// ANALYTICS & REPORTING
// ============================================

/**
 * Get affiliate statistics
 */
export async function getAffiliateStats(userId) {
  const wallet = await getWallet(userId);
  
  const totalCommissions = await prisma.commission.aggregate({
    where: { userId },
    _sum: { amount: true },
    _count: true,
  });
  
  const referrals = await prisma.user.count({
    where: { referredBy: userId },
  });
  
  return {
    wallet,
    totalCommissions: totalCommissions._sum.amount || 0,
    commissionCount: totalCommissions._count,
    referrals,
  };
}

/**
 * Get admin dashboard statistics
 */
export async function getAdminStats() {
  const totalAffiliates = await prisma.user.count({
    where: { role: { in: ['affiliate', 'affiliate_pending'] } },
  });
  
  const activeAffiliates = await prisma.user.count({
    where: { role: 'affiliate' },
  });
  
  const totalCommissions = await prisma.commission.aggregate({
    _sum: { amount: true },
  });
  
  const pendingPayouts = await prisma.payout.aggregate({
    where: { status: 'pending' },
    _sum: { amount: true },
    _count: true,
  });
  
  const totalOrders = await prisma.order.count();
  
  return {
    totalAffiliates,
    activeAffiliates,
    totalCommissions: totalCommissions._sum.amount || 0,
    pendingPayouts: pendingPayouts._sum.amount || 0,
    pendingPayoutCount: pendingPayouts._count,
    totalOrders,
  };
}