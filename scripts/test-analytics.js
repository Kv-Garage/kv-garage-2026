/**
 * Analytics System Test Script
 * Run this to verify the analytics tracking is working correctly
 */

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

async function testAnalytics() {
  console.log('🧪 Testing Analytics System...\n');
  
  const tests = [
    {
      name: 'Page View Event',
      payload: {
        event_type: 'Page View',
        properties: { page: '/test' },
        profile: {}
      }
    },
    {
      name: 'Active on Site Event',
      payload: {
        event_type: 'Active on Site',
        properties: { page: '/test', session_id: 'test_session_123' },
        profile: { id: 'test_user_1', email: 'test@example.com' }
      }
    },
    {
      name: 'Product View Event',
      payload: {
        event_type: 'Viewed Product',
        properties: {
          product_id: 'prod_123',
          product_name: 'Test Product',
          price: 99.99
        },
        profile: { id: 'test_user_1', email: 'test@example.com' }
      }
    },
    {
      name: 'Add to Cart Event',
      payload: {
        event_type: 'Added to Cart',
        properties: {
          product_id: 'prod_123',
          product_name: 'Test Product',
          quantity: 2,
          price: 99.99,
          total: 199.98
        },
        profile: { id: 'test_user_1', email: 'test@example.com' }
      }
    },
    {
      name: 'Order Placed Event',
      payload: {
        event_type: 'Placed Order',
        properties: {
          order_id: 'order_123',
          order_number: 'ORD-001',
          value: 199.98,
          items: [{ id: 'prod_123', name: 'Test Product', quantity: 2 }]
        },
        profile: { id: 'test_user_1', email: 'test@example.com' }
      }
    },
    {
      name: 'Email Subscription Event',
      payload: {
        event_type: 'Subscribed to Email',
        properties: {
          email: 'test@example.com',
          source: 'test'
        },
        profile: { email: 'test@example.com' }
      }
    }
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      const response = await fetch(`${BASE_URL}/api/traffic-event`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(test.payload)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        console.log(`✅ ${test.name}: PASSED`);
        passed++;
      } else {
        console.log(`❌ ${test.name}: FAILED`);
        console.log(`   Error: ${result.error || 'Unknown error'}`);
        if (result.details) console.log(`   Details: ${result.details}`);
        if (result.code) console.log(`   Code: ${result.code}`);
        if (result.hint) console.log(`   Hint: ${result.hint}`);
        failed++;
      }
    } catch (error) {
      console.log(`❌ ${test.name}: ERROR - ${error.message}`);
      failed++;
    }
  }

  console.log(`\n📊 Results: ${passed} passed, ${failed} failed`);
  
  if (failed === 0) {
    console.log('🎉 All analytics tests passed!');
    process.exit(0);
  } else {
    console.log('⚠️  Some tests failed. Please check the analytics system.');
    process.exit(1);
  }
}

testAnalytics().catch(err => {
  console.error('Test script error:', err);
  process.exit(1);
});