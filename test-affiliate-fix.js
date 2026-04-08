/**
 * Test script to verify affiliate application system
 * Run with: node test-affiliate-fix.js
 */

const fetch = require('node-fetch');

async function testAffiliateApplication() {
  console.log('Testing Affiliate Application System...\n');
  
  const testEmail = `test_${Date.now()}@example.com`;
  const testData = {
    name: 'Test User',
    email: testEmail,
    platform: 'Instagram',
    experience: '5 years of social media marketing'
  };

  try {
    console.log('1. Testing application submission...');
    console.log('   Sending data:', JSON.stringify(testData, null, 2));
    
    const response = await fetch('http://localhost:3000/api/affiliate/apply', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testData)
    });

    const result = await response.json();

    if (response.ok) {
      console.log('   ✅ Application submitted successfully!');
      console.log('   Response:', JSON.stringify(result, null, 2));
    } else {
      console.log('   ❌ Application failed!');
      console.log('   Status:', response.status);
      console.log('   Error:', result.error);
    }

    // Test duplicate submission
    console.log('\n2. Testing duplicate email prevention...');
    const duplicateResponse = await fetch('http://localhost:3000/api/affiliate/apply', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testData)
    });

    const duplicateResult = await duplicateResponse.json();
    
    if (duplicateResponse.status === 400 && duplicateResult.error.includes('already exists')) {
      console.log('   ✅ Duplicate prevention working!');
    } else {
      console.log('   ⚠️ Duplicate prevention may not be working');
    }

  } catch (error) {
    console.log('   ❌ Error during test:', error.message);
    console.log('   Make sure the development server is running on http://localhost:3000');
  }

  console.log('\n--- Test Complete ---');
}

// Run the test
if (require.main === module) {
  testAffiliateApplication();
}

module.exports = testAffiliateApplication;