import express from 'express';
const router=express.Router();
import {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  registerForEvent,
  unregisterFromEvent
} from './controllers/event.controller.js';

router.post('/event/', createEvent);
router.get('/event', getAllEvents);
router.get('/event/:id', getEventById);
router.put('/event/:id', updateEvent);
router.delete('/event/:id', deleteEvent);
router.post('/event/:id/join', registerForEvent);
router.post('/event/:id/unjoin', unregisterFromEvent);