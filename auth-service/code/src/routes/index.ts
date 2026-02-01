import express from 'express';
import dotenv from 'dotenv';
import registerController from '../controllers/registerController';
import loginController from '../controllers/loginControler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3015;

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (_, res) => {
  res.json({ 
    status: 'ok',
    service: 'auth-service'
  });
});

// Auth routes
app.post('/register', (req, res) => registerController.register(req, res));
app.post('/login', (req, res) => loginController.login(req, res));
app.post('/logout', (req, res) => loginController.logout(req, res));
app.get('/verify', (req, res) => loginController.verifyToken(req, res));

app.listen(PORT, () => {
  console.log(`Auth Service running on port ${PORT}`);
});