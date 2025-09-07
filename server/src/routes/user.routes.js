import express from 'express';
import auth from '../middleware/auth.js';
import { requireRole } from '../middleware/role.js';
import { verifyNGOAdmin, promoteToNGOAdmin } from '../controllers/user.controller.js';

const router = express.Router();

// Admin-only: verify an NGO admin
router.patch('/:id/verify', auth, requireRole('ADMIN'), verifyNGOAdmin);

// Admin-only: promote a user to NGO_ADMIN (after NGO application approval)
router.patch('/:id/promote', auth, requireRole('ADMIN'), promoteToNGOAdmin);

export default router;
