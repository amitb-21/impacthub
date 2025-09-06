import express from 'express';
import {
  createReport,
  getAllReports,
  getReportById,
  updateReport,
  deleteReport
} from '../controllers/verficationreport.controller.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// All verification routes require authentication and admin role
router.post('/', auth, createReport);
router.get('/', auth, getAllReports);
router.get('/:id', auth, getReportById);
router.put('/:id', auth, updateReport);
router.delete('/:id', auth, deleteReport);

export default router;