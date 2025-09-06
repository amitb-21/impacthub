import express from 'express';
import { summarize, verify } from '../controllers/ai.controller.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/summarize', auth, summarize);
router.post('/verify', auth, verify);

export default router;