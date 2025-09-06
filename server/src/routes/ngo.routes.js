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

router.post('/ngo/', createNGO);
router.get('/ngo', getAllNGOs);
router.get('/ngo/:id', getNGOById);
router.put('/ngo/:id', updateNGO);
router.delete('/ngo/:id', deleteNGO);
router.patch('/ngo/:id/verify', verifyNGO);

export default router;
