import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3010;
const API_SERVICE_URL = process.env.API_SERVICE_URL || 'http://groups:3000';

if (!API_SERVICE_URL) {
  throw new Error('API_SERVICE_URL environment variable is not set');
}

app.get('/health', (_, res) => {
  res.json({ status: 'ok', service: 'gateway' });
});

// Proxy ALL API traffic
app.use(
  '/api',
  createProxyMiddleware({
    target: API_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { '^/api': '' }
  })
);

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
  console.log(`Proxying requests to ${API_SERVICE_URL}`);
});
