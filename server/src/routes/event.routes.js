import express from 'express';
import {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  registerForEvent,
  unregisterFromEvent
} from '../controllers/event.controller.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/', auth, createEvent);
router.get('/', getAllEvents); 
router.get('/:id', getEventById);
router.put('/:id', auth, updateEvent);
router.delete('/:id', auth, deleteEvent);
router.post('/:id/register', auth, registerForEvent);
router.delete('/:id/register', auth, unregisterFromEvent);

export default router;