import express from 'express';
import {
  createNGO,
  getAllNGOs,
  getNGOById,
  updateNGO,
  deleteNGO,
  verifyNGO,
} from '../controllers/ngo.controller.js';
import auth from '../middleware/auth.js';
import { requireRole } from '../middleware/role.js';

const router = express.Router();

// Allow USER, NGO_ADMIN, and ADMIN to create NGO applications
router.post('/', auth, requireRole('USER', 'NGO_ADMIN', 'ADMIN'), createNGO);

// Public route to view all NGOs
router.get('/', getAllNGOs);

// Public route to view specific NGO
router.get('/:id', getNGOById);

// Update NGO - Users can update pending applications, NGO_ADMIN their own, ADMIN any
router.put('/:id', auth, requireRole('USER', 'NGO_ADMIN', 'ADMIN'), updateNGO);

// Delete NGO - Users can delete pending applications, NGO_ADMIN their own, ADMIN any
router.delete('/:id', auth, requireRole('USER', 'NGO_ADMIN', 'ADMIN'), deleteNGO);

// Verify NGO - Admin only (this also promotes USER to NGO_ADMIN)
router.patch('/:id/verify', auth, requireRole('ADMIN'), verifyNGO);

export default router;