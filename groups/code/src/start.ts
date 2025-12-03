import Express, { Application, Request, Response, NextFunction } from 'express';
import * as Dotenv from 'dotenv';
Dotenv.config({ path: '.env' });
import IndexRouter from './routes/index.js';
import { errorHandler } from './middleware/errors/errorHandler.js';
import cors from 'cors';

const app: Application = Express();
const port: number = process.env.PORT ? parseInt(process.env.PORT) : 3012;

// CORS MUST be first
app.use(cors({
  origin: 'http://localhost:5173'
}));

// support json encoded and url-encoded bodies
app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));

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
