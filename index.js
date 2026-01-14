const express = require('express');
const os = require('os');
const dns = require('dns');
const path = require('path');

const readFileContent = require('./read'); // our custom module

const app = express();
const PORT = 4000;

// Root route
app.get('/', (req, res) => {
  res.send('Welcome! Server is running. Try /test, /readfile, /systemdetails, or /getip');
});

// Basic test route
app.get('/test', (req, res) => {
  res.send('Test route is working!');
});

// Read file route
app.get('/readfile', async (req, res) => {
  try {
    const filePath = path.join(__dirname, 'Data.txt');
    const content = await readFileContent(filePath);
    res.send(content);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to read file',
      message: error.message,
    });
  }
});

// System details route
app.get('/systemdetails', (req, res) => {
  const totalMemGB = (os.totalmem() / (1024 ** 3)).toFixed(2) + ' GB';
  const freeMemGB = (os.freemem() / (1024 ** 3)).toFixed(2) + ' GB';
  const cpus = os.cpus();

  const details = {
    platform: os.platform(),                 // e.g., 'win32', 'linux', 'darwin'
    totalMemory: totalMemGB,
    freeMemory: freeMemGB,
    cpuModel: cpus && cpus.length > 0 ? cpus[0].model : 'Unknown',
    cpuCores: cpus ? cpus.length : 0,        // Bonus: core count
  };

  res.json(details);
});

// Get IP route (IPv4 + IPv6)
app.get('/getip', (req, res) => {
  const hostname = 'masaischool.com';

  // Resolve both A (IPv4) and AAAA (IPv6) records
  const results = { hostname, ipv4: [], ipv6: [] };

  dns.resolve4(hostname, (err, addresses4) => {
    if (!err && addresses4) results.ipv4 = addresses4;

    dns.resolve6(hostname, (err6, addresses6) => {
      if (!err6 && addresses6) results.ipv6 = addresses6;

      // If both fail, return a helpful error
      if (results.ipv4.length === 0 && results.ipv6.length === 0) {
        return res.status(500).json({
          error: 'DNS resolution failed',
          message: 'Could not resolve IPv4 or IPv6 addresses',
        });
      }

      res.json(results);
    });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log('Remember: restart the server after code changes to see updates.');
});