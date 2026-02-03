import Express, { Router } from 'express';
import cors from 'cors';
import { getLeaderboard } from '../controllers/leaderboardController.js';
const router: Router = Express.Router();

router.get('/leaderboard', cors(), getLeaderboard);

export default router;