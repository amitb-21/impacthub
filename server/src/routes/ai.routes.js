// AI routes stub
import express from 'express'
import { summarize, verify } from '../controllers/ai.controller.js';
const router = express.Router();
router.post('/ai/summarize', summarize);
router.post('/ai/verify', verify);
export default router;
