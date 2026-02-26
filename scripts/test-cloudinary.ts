/**
 * Test Cloudinary connection
 */

import 'dotenv/config';

console.log('🧪 Testing Cloudinary connection...');

const API_KEY = '622255681518141';
const API_SECRET = 'oJDof5Zje1pD5OQ0O5VRb2tkK0k';
const CLOUD_NAME = 'dk1ovmxuj';

// Check credentials
console.log(`Cloud Name: ${CLOUD_NAME}`);
console.log(`API Key: ${API_KEY.substring(0, 5)}...`);
console.log(`API Secret: ${API_SECRET.substring(0, 5)}...`);

// Test fetch
const auth = Buffer.from(`${API_KEY}:${API_SECRET}`).toString('base64');
const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/resources/image?max_results=5`;

console.log(`\n📡 Fetching from: ${url}`);

fetch(url, {
  headers: {
    'Authorization': `Basic ${auth}`,
  }
})
  .then(res => {
    console.log(`Response status: ${res.status}`);
    return res.json();
  })
  .then(data => {
    console.log(`✅ Success! Found ${data.resources?.length || 0} images`);
    console.log(`Total: ${data.total_count} images in Cloudinary`);
    if (data.resources && data.resources.length > 0) {
      console.log(`\nFirst image:`);
      console.log(`  ID: ${data.resources[0].public_id}`);
      console.log(`  URL: ${data.resources[0].secure_url}`);
    }
  })
  .catch(err => {
    console.error('❌ Error:', err.message);
  });
