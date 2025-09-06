import express from 'express';
import { summarize, verify } from '../controllers/ai.controller.js';
import auth from '../middleware/auth.js';
import { requireRole } from '../middleware/role.js';

const router = express.Router();

router.post('/summarize', auth, requireRole('ADMIN'), summarize);
router.post('/verify', auth, requireRole('ADMIN'), verify);

export default router;