#!/usr/bin/env node

/**
 * Test Script for Affiliate System
 * Run this script to verify the affiliate system is working correctly
 */

import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000';

async function testAffiliateSystem() {
  console.log('🧪 Testing Affiliate System...\n');

  // Test 1: Check affiliate application endpoint
  console.log('1. Testing affiliate application endpoint...');
  try {
    const response = await fetch(`${BASE_URL}/api/affiliate/apply`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        reason: 'Testing affiliate system'
      })
    });

    const data = await response.json();
    console.log(`   Status: ${response.status}`);
    console.log(`   Response: ${JSON.stringify(data, null, 2)}`);
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
  }

  // Test 2: Check affiliate login endpoint
  console.log('\n2. Testing affiliate login endpoint...');
  try {
    const response = await fetch(`${BASE_URL}/api/affiliate/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'testaffiliate@example.com',
        password: 'Test1234!'
      })
    });

    const data = await response.json();
    console.log(`   Status: ${response.status}`);
    console.log(`   Response: ${JSON.stringify(data, null, 2)}`);
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
  }

  // Test 3: Check affiliate payout endpoint
  console.log('\n3. Testing affiliate payout endpoint...');
  try {
    const response = await fetch(`${BASE_URL}/api/affiliate/payout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        affiliateId: 'test-affiliate-id',
        amount: 50,
        paymentMethod: 'PayPal',
        paymentDetails: 'test@example.com'
      })
    });

    const data = await response.json();
    console.log(`   Status: ${response.status}`);
    console.log(`   Response: ${JSON.stringify(data, null, 2)}`);
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
  }

  // Test 4: Check affiliate click tracking endpoint
  console.log('\n4. Testing affiliate click tracking endpoint...');
  try {
    const response = await fetch(`${BASE_URL}/api/affiliate/track-click`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        affiliateId: 'test-affiliate-id',
        productId: 'test-product-id'
      })
    });

    const data = await response.json();
    console.log(`   Status: ${response.status}`);
    console.log(`   Response: ${JSON.stringify(data, null, 2)}`);
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
  }

  console.log('\n✅ Affiliate system tests completed!');
  console.log('\n📋 Test Affiliate Account:');
  console.log('   Email: testaffiliate@example.com');
  console.log('   Password: Test1234!');
  console.log('   Referral Code: TEST123');
  console.log('\n🔗 Test URLs:');
  console.log('   Affiliate Login: /affiliate/login');
  console.log('   Affiliate Dashboard: /affiliate/dashboard');
  console.log('   Admin Affiliate Management: /admin/affiliates');
}

// Run the test if this script is executed directly
if (require.main === module) {
  testAffiliateSystem().catch(console.error);
}

module.exports = { testAffiliateSystem };