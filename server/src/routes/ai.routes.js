// AI routes stub
import { Router } from 'express';
import { summarize, verify } from '../controllers/ai.controller.js';
const router = Router();
router.post('/summarize', summarize);
router.post('/verify', verify);
export default router;
