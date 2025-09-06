import express from 'express';
import {
  createReport,
  getAllReports,
  getReportById,
  updateReport,
  deleteReport
} from '../controllers/verificationReport.controller.js'; 
import auth from '../middleware/auth.js';
import { requireRole } from '../middleware/role.js';

const router = express.Router();

// All verification routes require authentication and admin role
router.post('/', auth, requireRole('ADMIN'), createReport);
router.get('/', auth, requireRole('ADMIN'), getAllReports);
router.get('/:id', auth, requireRole('ADMIN'), getReportById);
router.put('/:id', auth, requireRole('ADMIN'), updateReport);
router.delete('/:id', auth, requireRole('ADMIN'), deleteReport);

export default router;