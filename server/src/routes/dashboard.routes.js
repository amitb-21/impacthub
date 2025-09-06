import express from 'express';
import { metrics, leaderboard } from '../controllers/dashboard.controller.js';
import auth from '../middleware/auth.js';
import { requireRole } from '../middleware/role.js';

const router = express.Router();

router.get('/metrics', auth, requireRole('ADMIN'), metrics);
router.get('/leaderboard', leaderboard); 

export default router;