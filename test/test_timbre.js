const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  content.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const val = match[2].trim().replace(/^["']|["']$/g, '');
      process.env[key] = val;
    }
  });
}

const key = process.env.TIMBRE_API_KEY;

async function checkHeaders() {
  const url = 'https://api.vachana.ai/api/v1/tts/inference';
  
  // Test with only X-API-Key-ID
  console.log('Test 1: Only X-API-Key-ID');
  const res1 = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key-ID': key,
    },
    body: JSON.stringify({
      text: 'परीक्षण',
      voice: 'Shivani',
      model: 'timbre-v3.0',
      language: 'hi-IN',
      speed: 1.0,
    }),
  });
  console.log('Status 1:', res1.status);

  // Test with extra headers
  console.log('Test 2: With Authorization Bearer and token');
  const res2 = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key-ID': key,
      'Authorization': `Bearer ${key}`,
      'token': key,
    },
    body: JSON.stringify({
      text: 'परीक्षण',
      voice: 'Shivani',
      model: 'timbre-v3.0',
      language: 'hi-IN',
      speed: 1.0,
    }),
  });
  console.log('Status 2:', res2.status);
}

checkHeaders();
