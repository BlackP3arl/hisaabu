const http = require('http');

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/health',
  method: 'GET',
  timeout: 5000
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log('✓ Server is running!');
    console.log('Status:', res.statusCode);
    console.log('Response:', data);
    process.exit(0);
  });
});

req.on('error', (error) => {
  console.error('✗ Server test failed:', error.message);
  process.exit(1);
});

req.on('timeout', () => {
  console.error('✗ Server test timeout');
  process.exit(1);
});

req.end();

// Also test database health
setTimeout(() => {
  const dbOptions = {
    hostname: 'localhost',
    port: 5000,
    path: '/health/db',
    method: 'GET',
    timeout: 5000
  };

  const dbReq = http.request(dbOptions, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      console.log('\n✓ Database health check:');
      console.log('Status:', res.statusCode);
      console.log('Response:', data);
    });
  });

  dbReq.on('error', (error) => {
    console.error('✗ DB health check failed:', error.message);
  });

  dbReq.end();
}, 1000);
