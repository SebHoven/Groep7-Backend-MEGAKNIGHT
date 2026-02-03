import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import dotenv from 'dotenv';
import type { Options } from 'http-proxy-middleware';
import { IncomingMessage, ServerResponse } from 'http';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const GROUPS_SERVICE_URL = process.env.GROUPS_SERVICE_URL || 'http://groups:3012';
const TASKS_SERVICE_URL = process.env.TASKS_SERVICE_URL || 'http://tasks:3013';
const AVATAR_SERVICE_URL = process.env.AVATAR_SERVICE_URL || 'http://avatar:3014';
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://auth:3015';
const MAP_SERVICE_URL = process.env.MAP_SERVICE_URL || 'http://map:3016';
const LEADERBOARD_SERVICE_URL = process.env.LEADERBOARD_SERVICE_URL || 'http://leaderboard:3017';


// Body parser middleware (for any direct routes if needed)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Body parser middleware (for any direct routes if needed)
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// Manual CORS headers
app.use((req, res, next) => {
  const origin = req.headers.origin || 'http://localhost:5173';
  res.header('Access-Control-Allow-Origin', origin);
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
  res.header('Vary', 'Origin');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.get('/health', (_, res) => {
  res.json({ 
    status: 'ok',
    services: {
      auth: AUTH_SERVICE_URL,
      groups: GROUPS_SERVICE_URL,
      tasks: TASKS_SERVICE_URL,
      avatar: AVATAR_SERVICE_URL,
      leaderboard: LEADERBOARD_SERVICE_URL,
      map: MAP_SERVICE_URL
    }
  });
});

// Auth service proxy
app.use(
  '/api/auth',
  createProxyMiddleware({
    target: AUTH_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { '^/api/auth': '' },
    logLevel: 'debug',
    on: {
      proxyReq: (proxyReq, req, res) => {
        console.log('=== AUTH PROXY ===');
        console.log(`Original URL: ${req.url}`);
        console.log(`Proxied to: ${AUTH_SERVICE_URL}${proxyReq.path}`);
        console.log(`Method: ${req.method}`);
        console.log('==================');
      },
      error: (err, req, res) => {
        console.error('=== AUTH PROXY ERROR ===');
        console.error(`Error: ${err.message}`);
        console.error('=========================');
        
        if (res instanceof ServerResponse) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ 
            error: 'Auth service unavailable',
            message: err.message
          }));
        }
      }
    }
  } as Options)
);

// Tasks service proxy
app.use(
  '/api/tasks',
  createProxyMiddleware({
    target: TASKS_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { '^/api/tasks': '' },
    logLevel: 'debug',
    on: {
      proxyReq: (proxyReq, req, res) => {
        console.log('=== TASKS PROXY ===');
        console.log(`Original URL: ${req.url}`);
        console.log(`Proxied to: ${TASKS_SERVICE_URL}${proxyReq.path}`);
        console.log(`Method: ${req.method}`);
        console.log(`Headers:`, JSON.stringify(proxyReq.getHeaders(), null, 2));
        console.log('==================');
      },
      proxyRes: (proxyRes, req, res) => {
        console.log(`[Tasks] Response Status: ${proxyRes.statusCode}`);
      },
      error: (err, req, res) => {
        console.error('=== TASKS PROXY ERROR ===');
        console.error(`Error: ${err.message}`);
        console.error(`Request: ${req.method} ${req.url}`);
        console.error(`Target: ${TASKS_SERVICE_URL}`);
        console.error('=========================');
        
        if (res instanceof ServerResponse) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ 
            error: 'Tasks service unavailable',
            message: err.message,
            target: TASKS_SERVICE_URL,
            url: req.url
          }));
        }
      }
    }
  } as Options)
);

// Avatar service proxy
app.use(
  '/api/avatar',
  createProxyMiddleware({
    target: AVATAR_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { '^/api/avatar': '' },
    logLevel: 'debug',
    on: {
      proxyReq: (proxyReq, req, res) => {
        console.log('=== AVATAR PROXY ===');
        console.log(`Original URL: ${req.url}`);
        console.log(`Proxied to: ${AVATAR_SERVICE_URL}${proxyReq.path}`);
        console.log(`Method: ${req.method}`);
        console.log('====================');
      },
      proxyRes: (proxyRes, req, res) => {
        console.log(`[Avatar] Response Status: ${proxyRes.statusCode}`);
      },
      error: (err, req, res) => {
        console.error('=== AVATAR PROXY ERROR ===');
        console.error(`Error: ${err.message}`);
        console.error(`Request: ${req.method} ${req.url}`);
        console.error(`Target: ${AVATAR_SERVICE_URL}`);
        console.error('==========================');
        
        if (res instanceof ServerResponse) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ 
            error: 'Avatar service unavailable',
            message: err.message,
            target: AVATAR_SERVICE_URL,
            url: req.url
          }));
        }
      }
    }
  } as Options)
);

// Groups service proxy (catch-all, must be last)
app.use(
  '/api',
  createProxyMiddleware({
    target: GROUPS_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { '^/api': '' },
    logLevel: 'debug',
    on: {
      proxyReq: (proxyReq, req, res) => {
        console.log('=== GROUPS PROXY ===');
        console.log(`Original URL: ${req.url}`);
        console.log(`Proxied to: ${GROUPS_SERVICE_URL}${proxyReq.path}`);
        console.log(`Method: ${req.method}`);
        console.log(`Headers:`, JSON.stringify(proxyReq.getHeaders(), null, 2));
        console.log('=====================');
      },
      proxyRes: (proxyRes, req, res) => {
        console.log(`[Groups] Response Status: ${proxyRes.statusCode}`);
      },
      error: (err, req, res) => {
        console.error('=== GROUPS PROXY ERROR ===');
        console.error(`Error: ${err.message}`);
        console.error(`Request: ${req.method} ${req.url}`);
        console.error(`Target: ${GROUPS_SERVICE_URL}`);
        console.error('==========================');
        if (res instanceof ServerResponse) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            error: 'Groups service unavailable',
            message: err.message,
            target: GROUPS_SERVICE_URL,
            url: req.url
          }));
        }
      }
    }
  } as Options)
  );

// Leaderboard service proxy
app.use(
  '/api/leaderboard',
  createProxyMiddleware({
    target: LEADERBOARD_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { '^/api/leaderboard': '' },
    on: {
      proxyReq: (proxyReq, req, res) => {
        console.log('=== LEADERBOARD PROXY ===');
        console.log(`Original URL: ${req.url}`);
        console.log(`Proxied to: ${LEADERBOARD_SERVICE_URL}${proxyReq.path}`);
        console.log(`Method: ${req.method}`);
      },
      proxyRes: (proxyRes, req, res) => {
        console.log(`[Leaderboard] Response Status: ${proxyRes.statusCode}`);
      },
      error: (err, req, res) => {
        console.error('=== LEADERBOARD PROXY ERROR ===');
        console.error(`Error: ${err.message}`);
        if (res instanceof ServerResponse) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            error: 'Leaderboard service unavailable',
            message: err.message,
            target: LEADERBOARD_SERVICE_URL,
            url: req.url
          }));
        }
      }
    }
  })
);

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
  console.log(`Proxying /api/auth/* to ${AUTH_SERVICE_URL}`);
  console.log(`Proxying /api/tasks/* to ${TASKS_SERVICE_URL}`);
  console.log(`Proxying /api/avatar/* to ${AVATAR_SERVICE_URL}`);
  console.log(`Proxying /api/* to ${GROUPS_SERVICE_URL}`);
  console.log(`Proxying /api/leaderboard* to ${LEADERBOARD_SERVICE_URL}`);

});