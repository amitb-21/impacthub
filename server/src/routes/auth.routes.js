import express from 'express';
import { signup, login, me, updateProfile, changePassword } from '../controllers/auth.controller.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', auth, me);
router.put('/profile', auth, updateProfile);
router.put('/change-password', auth, changePassword);

export default router;