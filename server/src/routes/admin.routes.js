import express from 'express';
import auth from '../middleware/auth.js';
import { requireRole } from '../middleware/role.js';
import {
  getAllUsers,
  getUserById,
  promoteToNGOAdmin,
  verifyNGOAdmin,
  updateUser,
  deleteUser,
  getUserStats,
  resetUserPassword
} from '../controllers/admin.controller.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(auth, requireRole('ADMIN'));

// User management routes
router.get('/users', getAllUsers);
router.get('/users/stats', getUserStats);
router.get('/users/:id', getUserById);
router.patch('/users/:id/promote', promoteToNGOAdmin);
router.patch('/users/:id/verify', verifyNGOAdmin);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.patch('/users/:id/reset-password', resetUserPassword);

export default router;