import express from 'express';
import {
  getMyParticipations,
  getParticipantsByEvent,
  markAttendance,
  submitFeedback,
  issueCertificate
} from '../controllers/participation.controller.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/my', auth, getMyParticipations);
router.get('/event/:eventId', auth, getParticipantsByEvent);
router.patch('/:id/attendance', auth, markAttendance);
router.patch('/:id/feedback', auth, submitFeedback);
router.patch('/:id/certificate', auth, issueCertificate);

export default router;