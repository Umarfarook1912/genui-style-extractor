const http = require('http');
const fs = require('fs');
const path = require('path');

// Load the handler
const handler = require('./index.js');

const server = http.createServer((req, res) => {
  // adapt to the handler expecting just (req,res)
  handler(req, res);
});

const PORT = 3005;
server.listen(PORT, () => {
  console.log(`Local test server listening on http://localhost:${PORT}`);

  // Send a test POST
  const postData = JSON.stringify({
    styles: {
      width: '100px',
      height: '40px',
      backgroundColor: 'rgb(255, 0, 0)',
      color: 'rgb(255,255,255)',
      fontSize: '16px',
      fontWeight: '700'
    },
    format: 'tailwind'
  });

  const options = {
    hostname: 'localhost',
    port: PORT,
    path: '/',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  const req = http.request(options, (res) => {
    let data = '';
    console.log('STATUS:', res.statusCode);
    res.setEncoding('utf8');
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
      console.log('Response:', data);
      // stop server after test
      server.close();
    });
  });

  req.on('error', (e) => {
    console.error('problem with request:', e.message);
    server.close();
  });

  // write data to request body
  req.write(postData);
  req.end();
});
