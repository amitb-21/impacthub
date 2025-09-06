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

const router = express.Router();

router.post('/', auth, createNGO);
router.get('/', getAllNGOs);
router.get('/:id', getNGOById);
router.put('/:id', auth, updateNGO);
router.delete('/:id', auth, deleteNGO);
router.patch('/:id/verify', auth, verifyNGO);

export default router;
