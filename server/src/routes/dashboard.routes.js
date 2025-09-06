// Dashboard routes stub
import express from 'express';
import { metrics, leaderboard } from '../controllers/dashboard.controller.js';
const router = express.Router();
router.get('/dash/metrics', metrics);
router.get('/dash/leaderboard', leaderboard);
export default router;
