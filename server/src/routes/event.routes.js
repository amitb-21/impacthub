// Event routes stub
import { Router } from 'express';
import { createEvent, listEvents } from '../controllers/event.controller.js';
const router = Router();
router.post('/', createEvent);
router.get('/', listEvents);
export default router;
