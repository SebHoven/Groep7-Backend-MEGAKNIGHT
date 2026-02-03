import Express, { Router } from 'express';
import { getAvatarByStudentId, saveAvatar } from '../controllers/avatarController.js';
import cors from 'cors';

const router: Router = Express.Router();

// Avatar routes
router.get('/student/:studentId', cors(), getAvatarByStudentId);
router.post('/student/:studentId', cors(), saveAvatar);

export default router;
