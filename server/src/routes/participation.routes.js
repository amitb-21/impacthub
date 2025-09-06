import express from 'express';
import {
  getMyParticipations,
  getParticipantsByEvent,
  markAttendance,
  submitFeedback,
  issueCertificate
} from '../controllers/participation.controller.js';
import auth from '../middleware/auth.js';
import { requireRole } from '../middleware/role.js';

const router = express.Router();

router.get('/my', auth, requireRole('USER'), getMyParticipations);
router.get('/event/:eventId', auth, requireRole('NGO_ADMIN', 'ADMIN'), getParticipantsByEvent);
router.patch('/:id/attendance', auth, requireRole('NGO_ADMIN', 'ADMIN'), markAttendance);
router.patch('/:id/feedback', auth, requireRole('NGO_ADMIN', 'ADMIN'), submitFeedback);
router.patch('/:id/certificate', auth, requireRole('NGO_ADMIN', 'ADMIN'), issueCertificate);

export default router;