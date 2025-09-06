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

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    // prevent non-admins from self-registering as ADMIN
    if (role === 'ADMIN') {
      return res.status(403).json({ message: 'Cannot self-register as ADMIN' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ 
      name, 
      email, 
      passwordHash, 
      role: role || 'USER' 
    });

    const token = jwt.sign(
      { userId: user._id, role: user.role, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Don't send password hash back
    const userResponse = user.toObject();
    delete userResponse.passwordHash;

    return res.status(201).json({ 
      message: 'User created successfully',
      token, 
      user: userResponse 
    });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ message: 'Signup failed', error: error.message });
  }
};

/**
 * User login
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email, isDeleted: false });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Update last login
    user.lastLoginAt = new Date();
    await user.save();

    const token = jwt.sign(
      { userId: user._id, role: user.role, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Don't send password hash back
    const userResponse = user.toObject();
    delete userResponse.passwordHash;

    return res.status(200).json({ 
      message: 'Login successful',
      token, 
      user: userResponse 
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Login failed', error: error.message });
  }
};

/**
 * Get current logged-in user profile
 */
export const me = async (req, res) => {
  try {
    const userResponse = req.user.toObject();
    delete userResponse.passwordHash;
    return res.status(200).json(userResponse);
  } catch (error) {
    console.error('Me endpoint error:', error);
    return res.status(500).json({ message: 'Failed to fetch profile', error: error.message });
  }
};
