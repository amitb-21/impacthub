import express from 'express';
import { metrics, leaderboard } from '../controllers/dashboard.controller.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/metrics', auth, metrics);
router.get('/leaderboard', leaderboard); 

export default router;