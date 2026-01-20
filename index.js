const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const UPSTREAM = process.env.UPSTREAM || 'http://api-aeis.duckdns.org';
const PORT = process.env.PORT || 3000;

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok', upstream: UPSTREAM }));

// Proxy all other requests
app.use('/', createProxyMiddleware({
  target: UPSTREAM,
  changeOrigin: true,
  proxyTimeout: 30000,
  onError: (err, req, res) => {
    console.error('Proxy error:', err && err.message);
    if (!res.headersSent) {
      res.status(502).json({ error: 'Bad gateway', details: err.message });
    }
  }
}));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Proxy listening on port ${PORT} → ${UPSTREAM}`);
});
