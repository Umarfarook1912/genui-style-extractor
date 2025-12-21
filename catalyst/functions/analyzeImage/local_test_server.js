const http = require('http');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env if it exists
try {
  const envFile = path.join(__dirname, '.env');
  if (fs.existsSync(envFile)) {
    const envContent = fs.readFileSync(envFile, 'utf8');
    envContent.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        process.env[key.trim()] = valueParts.join('=').trim();
      }
    });
    console.log('Loaded .env file');
  }
} catch (e) {
  console.log('No .env file found, using process.env');
}

// Set API key if provided as command line arg or env var
if (process.argv[2]) {
  process.env.OPENAI_API_KEY = process.argv[2];
  console.log('Using API key from command line argument');
} else if (process.env.OPENAI_API_KEY) {
  console.log('Using API key from environment variable');
} else {
  console.log('⚠️  No OpenAI API key found. Function will use fallback extraction.');
}

// Load the handler
const handler = require('./index.js');

const server = http.createServer((req, res) => {
  // adapt to the handler expecting just (req,res)
  handler(req, res);
});

const PORT = 3006;
server.listen(PORT, () => {
  console.log(`\n🚀 Local test server for analyzeImage listening on http://localhost:${PORT}`);
  console.log(`\nTo test, send a POST request with:\n`);
  console.log(`curl -X POST http://localhost:${PORT}/ \\`);
  console.log(`  -H "Content-Type: application/json" \\`);
  console.log(`  -d '{"image":"base64_encoded_image","mimeType":"image/png","fileName":"test.png"}'`);
  console.log(`\nOr use the frontend to upload an image.\n`);
});

