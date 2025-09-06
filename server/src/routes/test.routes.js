import express from 'express';
import auth from '../middleware/auth.js';
const router = express.Router();

// Protected test route for any Firebase Auth method (Google, Email/Password, etc.)
router.get('/test/protected', auth, (req, res) => {
  res.json({ message: 'You are authenticated!', user: req.user });
});

export default router;
