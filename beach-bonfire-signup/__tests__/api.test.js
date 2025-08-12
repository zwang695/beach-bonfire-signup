/**
 * Integration tests for Beach Bonfire API endpoints
 * Run with: npm test
 */

const BASE_URL = 'http://localhost:3000';

async function testEndpoint(url, options = {}) {
  try {
    const response = await fetch(`${BASE_URL}${url}`, options);
    const data = await response.json();
    return {
      success: response.ok,
      status: response.status,
      data,
      response
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

async function runTests() {
  console.log('🧪 Running Beach Bonfire API Integration Tests\n');

  // Test 1: Google Sheets connection
  console.log('1. Testing Google Sheets connection...');
  const testResult = await testEndpoint('/api/test');
  console.log(`   Status: ${testResult.status}`);
  console.log(`   Success: ${testResult.success}`);
  if (!testResult.success) {
    console.log(`   Error: ${testResult.data?.error || testResult.error}`);
  }
  console.log();

  // Test 2: Get needed items
  console.log('2. Testing GET /api/needed-items...');
  const itemsResult = await testEndpoint('/api/needed-items');
  console.log(`   Status: ${itemsResult.status}`);
  console.log(`   Success: ${itemsResult.success}`);
  if (itemsResult.success) {
    console.log(`   Items count: ${itemsResult.data?.neededItems?.length || 0}`);
  } else {
    console.log(`   Error: ${itemsResult.data?.error || itemsResult.error}`);
  }
  console.log();

  // Test 3: Get signups
  console.log('3. Testing GET /api/signup...');
  const signupsResult = await testEndpoint('/api/signup');
  console.log(`   Status: ${signupsResult.status}`);
  console.log(`   Success: ${signupsResult.success}`);
  if (signupsResult.success) {
    console.log(`   Signups count: ${signupsResult.data?.signups?.length || 0}`);
  } else {
    console.log(`   Error: ${signupsResult.data?.error || signupsResult.error}`);
  }
  console.log();

  // Test 4: Add a test item
  console.log('4. Testing POST /api/needed-items...');
  const addItemResult = await testEndpoint('/api/needed-items', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      item: 'Test Item (DELETE ME)',
      category: 'other'
    })
  });
  console.log(`   Status: ${addItemResult.status}`);
  console.log(`   Success: ${addItemResult.success}`);
  if (!addItemResult.success) {
    console.log(`   Error: ${addItemResult.data?.error || addItemResult.error}`);
  }
  console.log();

  // Test 5: Test signup
  console.log('5. Testing POST /api/signup...');
  const signupResult = await testEndpoint('/api/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: 'Test User',
      email: 'test@example.com',
      item: 'Test Food Item',
      itemCategory: 'food'
    })
  });
  console.log(`   Status: ${signupResult.status}`);
  console.log(`   Success: ${signupResult.success}`);
  if (!signupResult.success) {
    console.log(`   Error: ${signupResult.data?.error || signupResult.error}`);
  }
  console.log();

  // Test 6: Delete test item
  if (addItemResult.success) {
    console.log('6. Testing DELETE /api/needed-items...');
    const deleteResult = await testEndpoint('/api/needed-items', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        item: 'Test Item (DELETE ME)'
      })
    });
    console.log(`   Status: ${deleteResult.status}`);
    console.log(`   Success: ${deleteResult.success}`);
    if (!deleteResult.success) {
      console.log(`   Error: ${deleteResult.data?.error || deleteResult.error}`);
    }
    console.log();
  }

  console.log('🏁 Tests completed!');
  
  // Summary
  const tests = [testResult, itemsResult, signupsResult, addItemResult, signupResult];
  const passed = tests.filter(t => t.success).length;
  const total = tests.length;
  
  console.log(`\n📊 Summary: ${passed}/${total} tests passed`);
  
  if (passed < total) {
    console.log('\n❌ Some tests failed. Check Google Sheets setup:');
    console.log('   1. Service account email shared with sheet?');
    console.log('   2. Environment variables set correctly?');
    console.log('   3. Google Sheets API enabled?');
  } else {
    console.log('\n✅ All tests passed! Your Beach Bonfire app is ready! 🏖️🔥');
  }
}

// Check if running in Node.js environment
if (typeof require !== 'undefined' && require.main === module) {
  runTests().catch(console.error);
}

module.exports = { testEndpoint, runTests };