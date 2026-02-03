import Express, { Router } from 'express';

import { LoginController } from '../controllers/loginController.js';
import { RegisterController } from '../controllers/registerController.js';
import { StudentsController } from '../controllers/studentsController.js';

const registerController = new RegisterController();

const loginController = new LoginController();
const studentsController = new StudentsController();
const router: Router = Express.Router();



// Health check route
router.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', service: 'auth-service' });
});

// Auth routes
router.post('/login', loginController.login);
router.post('/logout', loginController.logout);
router.get('/verify', loginController.verifyToken);
router.post('/register', registerController.register);

// Student routes
router.get('/students', studentsController.getStudentsByIds);
router.get('/students/:id', studentsController.getStudentById);

export default router;