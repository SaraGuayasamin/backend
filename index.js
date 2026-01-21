const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
// CAMBIO IMPORTANTE: Usamos HTTPS por defecto
const UPSTREAM = process.env.UPSTREAM || 'https://api-aeis.duckdns.org';
const PORT = process.env.PORT || 3000;

// CORS middleware
app.use((req, res, next) => {
  // Ajuste para permitir credenciales si fuera necesario
  const origin = req.headers.origin;
  res.header('Access-Control-Allow-Origin', origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok', upstream: UPSTREAM }));

// Proxy all other requests
app.use('/', createProxyMiddleware({
  target: UPSTREAM,
  changeOrigin: true,
  secure: false,          // Acepta certificados auto-firmados si fuera el caso
  followRedirects: true,  // <--- CRUCIAL: Sigue redirecciones internamente
  proxyTimeout: 30000,
  onError: (err, req, res) => {
    console.error('Proxy error:', err && err.message);
    if (!res.headersSent) {
      res.status(502).json({ error: 'Bad gateway', details: err.message });
    }
  },
  onProxyReq: (proxyReq, req, res) => {
    console.log(`[Proxy] Proxying ${req.method} request to: ${UPSTREAM}${req.url}`);
  }
}));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Proxy listening on port ${PORT} → ${UPSTREAM}`);
});