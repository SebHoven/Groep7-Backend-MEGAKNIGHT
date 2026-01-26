import Express, { Application, Request, Response, NextFunction } from 'express';
import * as Dotenv from 'dotenv';
Dotenv.config({ path: '.env' });

import IndexRouter from './routes/index.js';
import cors from 'cors';
import { errorHandler } from './middleware/errors/errorHandler.js';
import fs from 'fs';
import path from 'path';

const app: Application = Express();
const port: number = process.env.PORT ? parseInt(process.env.PORT) : 3013;

// CORS MUST be first
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// support json encoded and url-encoded bodies
app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));

// ensure uploads folder exists
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// serve uploads folder as static
// browser: http://localhost:3012/uploads/<filename>
app.use('/uploads', Express.static(uploadsDir));

// ROUTES (MUST be after CORS)
app.use('/', IndexRouter);

// 404 handler
app.use((req: Request, res: Response, next: NextFunction) => {
  try {
    throw new Error('Resource not found', { cause: 404 });
  } catch (err) {
    next(err);
  }
});

// Error handler
app.use(errorHandler);

app.listen(port, () => {
  console.log(`🍿 Express running → PORT ${port}`);
});
