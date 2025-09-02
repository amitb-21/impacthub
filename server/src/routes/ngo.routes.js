import express from 'express';
import {
  createNGO,
  getAllNGOs,
  getNGOById,
  updateNGO,
  deleteNGO,
  verifyNGO,
} from '../controllers/ngoController.js';

const router = express.Router();

router.post('/', createNGO);
router.get('/', getAllNGOs);
router.get('/:id', getNGOById);
router.put('/:id', updateNGO);
router.delete('/:id', deleteNGO);
router.patch('/:id/verify', verifyNGO);

export default router;
