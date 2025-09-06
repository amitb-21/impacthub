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
