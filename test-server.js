const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Serve static files
app.use(express.static(path.join(__dirname, 'dist/prototipos-app/browser')));

// Handle SPA routing - send all routes to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/prototipos-app/browser/index.html'));
});

app.listen(port, () => {
  console.log(`Test server running at http://localhost:${port}`);
  console.log('Test these routes:');
  console.log('- http://localhost:3000/');
  console.log('- http://localhost:3000/dashboard');
  console.log('- http://localhost:3000/dash');
  console.log('- http://localhost:3000/analise-custos');
});
