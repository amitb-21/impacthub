import express from 'express';
import auth from '../middleware/auth.js';
import { requireRole } from '../middleware/role.js';
import {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  registerForEvent,
  unregisterFromEvent,
  myEvents
} from '../controllers/event.controller.js';

const router = express.Router();

router.post('/', auth, requireRole('NGO_ADMIN', 'ADMIN'), createEvent);
router.get('/', getAllEvents);
router.get('/mine', auth, myEvents);
router.get('/:id', getEventById);
router.put('/:id', auth, requireRole('NGO_ADMIN', 'ADMIN'), updateEvent);
router.delete('/:id', auth, requireRole('NGO_ADMIN', 'ADMIN'), deleteEvent);
router.post('/:id/register', auth, requireRole('USER'), registerForEvent);
router.delete('/:id/unregister', auth, requireRole('USER'), unregisterFromEvent);

export default router;
