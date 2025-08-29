// NGO routes stub
import { Router } from 'express';
import { createNGO, listNGOs } from '../controllers/ngo.controller.js';
const router = Router();
router.post('/', createNGO);
router.get('/', listNGOs);
export default router;
