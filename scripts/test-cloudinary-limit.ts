/**
 * Test: Fetch 30 images from Cloudinary
 * Check if rate limit is still active
 */

import axios from 'axios';

const CLOUDINARY_API = 'https://api.cloudinary.com/v1_1';
const CLOUD_NAME = 'dk1ovmxuj';
const API_KEY = '622255681518141';
const API_SECRET = 'oJDof5Zje1pD5OQ0O5VRb2tkK0k';

function generateAuth() {
  const auth = Buffer.from(`${API_KEY}:${API_SECRET}`).toString('base64');
  return `Basic ${auth}`;
}

async function test() {
  try {
    console.log('🧪 Testing Cloudinary API - Fetching 30 images...\n');

    const params = new URLSearchParams({
      type: 'upload',
      max_results: '30',
      direction: 'desc',
    });

    const url = `${CLOUDINARY_API}/${CLOUD_NAME}/resources/image?${params}`;

    console.log(`📡 URL: ${url.substring(0, 80)}...\n`);

    const response = await axios.get(url, {
      headers: {
        'Authorization': generateAuth(),
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });

    const images = response.data.resources || [];
    const nextCursor = response.data.next_cursor;

    console.log(`✅ SUCCESS! Got ${images.length} images\n`);

    console.log('📊 Response Details:');
    console.log(`   Total fetched: ${images.length}`);
    console.log(`   Has more pages: ${!!nextCursor}`);
    
    if (response.data.total_count) {
      console.log(`   Total in Cloudinary: ${response.data.total_count}`);
    }

    console.log('\n📸 First 3 images:');
    images.slice(0, 3).forEach((img, i) => {
      console.log(`   ${i + 1}. ${img.public_id}`);
    });

    console.log('\n✅ Rate limit is NOT active - API is working!');
    console.log('\n💡 You can now run the bulk sync:');
    console.log('   npm run sync:bulk-products');

  } catch (error: any) {
    console.error('❌ ERROR:\n');
    
    if (error.response) {
      console.log(`   Status: ${error.response.status} ${error.response.statusText}`);
      console.log(`   Message: ${error.response.data?.error?.message || error.message}`);
      
      const headers = error.response.headers;
      console.log(`\n⏱️  Rate Limit Info:`);
      console.log(`   Limit: ${headers['x-featureratelimit-limit']}`);
      console.log(`   Remaining: ${headers['x-featureratelimit-remaining']}`);
      console.log(`   Reset: ${headers['x-featureratelimit-reset']}`);
    } else {
      console.log(`   ${error.message}`);
    }

    console.log('\n⏳ API is rate limited. Try again later.');
  }
}

test();
