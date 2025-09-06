import express from 'express';
import auth from '../middleware/auth.js';
import { requireRole } from '../middleware/role.js';
import { verifyNGOAdmin } from '../controllers/user.controller.js';

const router = express.Router();

// Admin-only: verify an NGO admin
router.patch('/:id/verify', auth, requireRole('ADMIN'), verifyNGOAdmin);

export default router;
