// Dashboard routes stub
import { Router } from 'express';
import { metrics, leaderboard } from '../controllers/dashboard.controller.js';
const router = Router();
router.get('/metrics', metrics);
router.get('/leaderboard', leaderboard);
export default router;
