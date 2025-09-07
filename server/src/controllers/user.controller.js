// Admin-only: promote a user to NGO_ADMIN (and optionally verify)
export const promoteToNGOAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.role = 'NGO_ADMIN';
    user.verified = true; // or false if you want a separate verification step
    await user.save();
    return res.status(200).json({ message: 'User promoted to NGO_ADMIN', user });
  } catch (error) {
    return res.status(500).json({ message: 'Promotion failed', error: error.message });
  }
};
import User from '../models/User.js';

// Admin-only: verify an NGO admin
export const verifyNGOAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (user.role !== 'NGO_ADMIN') {
      return res.status(400).json({ message: 'User is not an NGO admin' });
    }
    user.verified = true;
    await user.save();
    return res.status(200).json({ message: 'NGO admin verified', user });
  } catch (error) {
    return res.status(500).json({ message: 'Verification failed', error: error.message });
  }
};
