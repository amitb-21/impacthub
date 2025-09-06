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

router.post('/', auth, requireRole('NGO_ADMIN', 'ADMIN'), createNGO);
router.get('/', getAllNGOs);
router.get('/:id', getNGOById);
router.put('/:id', auth, requireRole('NGO_ADMIN', 'ADMIN'), updateNGO);
router.delete('/:id', auth, requireRole('NGO_ADMIN', 'ADMIN'), deleteNGO);
router.patch('/:id/verify', auth, requireRole('ADMIN'), verifyNGO);

export default router;
