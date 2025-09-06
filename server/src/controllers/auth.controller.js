import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

/**
 * User signup
 */
export const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // prevent non-admins from self-registering as ADMIN
    if (role === 'ADMIN') {
      return res.status(403).json({ message: 'Cannot self-register as ADMIN' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash, role });

    const token = jwt.sign(
      { userId: user._id, role: user.role, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(201).json({ token, user });
  } catch (error) {
    return res.status(500).json({ message: 'Signup failed', error: error.message });
  }
};

/**
 * User login
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, isDeleted: false });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(200).json({ token, user });
  } catch (error) {
    return res.status(500).json({ message: 'Login failed', error: error.message });
  }
};

/**
 * Get current logged-in user profile
 */
export const me = async (req, res) => {
  try {
    return res.status(200).json(req.user);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch profile', error: error.message });
  }
};
