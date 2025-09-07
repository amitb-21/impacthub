import User from '../models/User.js';
import NGO from '../models/NGO.js';
import Event from '../models/Event.js';
import Participation from '../models/Participation.js';

/**
 * Get all users (Admin only)
 */
export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 50, search, role } = req.query;

    const query = { isDeleted: false };

    // Add search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // Add role filter
    if (role) {
      query.role = role.toUpperCase();
    }

    const users = await User.find(query)
      .select('-passwordHash')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Math.min(parseInt(limit, 10), 100))
      .lean();

    const total = await User.countDocuments(query);

    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to fetch users',
      error: error.message
    });
  }
};

/**
 * Get user by ID (Admin only)
 */
export const getUserById = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id, isDeleted: false })
      .select('-passwordHash')
      .lean();

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to fetch user',
      error: error.message
    });
  }
};

/**
 * Promote user to NGO_ADMIN (Admin only)
 */
export const promoteToNGOAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findOne({ _id: id, isDeleted: false });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'NGO_ADMIN') {
      return res.status(400).json({ message: 'User is already an NGO Admin' });
    }

    if (user.role === 'ADMIN') {
      return res.status(400).json({ message: 'Cannot demote an Admin' });
    }

    user.role = 'NGO_ADMIN';
    user.verified = false; // Will need verification after promotion
    await user.save();

    const userResponse = user.toObject();
    delete userResponse.passwordHash;

    return res.status(200).json({
      message: 'User promoted to NGO_ADMIN successfully',
      user: userResponse
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to promote user',
      error: error.message
    });
  }
};

/**
 * Verify NGO Admin (Admin only)
 */
export const verifyNGOAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findOne({ _id: id, isDeleted: false });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role !== 'NGO_ADMIN') {
      return res.status(400).json({ message: 'User is not an NGO Admin' });
    }

    user.verified = true;
    await user.save();

    const userResponse = user.toObject();
    delete userResponse.passwordHash;

    return res.status(200).json({
      message: 'NGO Admin verified successfully',
      user: userResponse
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to verify NGO Admin',
      error: error.message
    });
  }
};

/**
 * Update user details (Admin only)
 */
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, verified, ...updateData } = req.body;

    // Prevent certain fields from being updated
    delete updateData.email;
    delete updateData.passwordHash;
    delete updateData._id;

    const user = await User.findOne({ _id: id, isDeleted: false });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Only allow role changes for non-admin users
    if (role && user.role !== 'ADMIN') {
      user.role = role;
    }

    // Update verified status
    if (typeof verified === 'boolean') {
      user.verified = verified;
    }

    // Update other fields
    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        user[key] = updateData[key];
      }
    });

    await user.save();

    const userResponse = user.toObject();
    delete userResponse.passwordHash;

    return res.status(200).json({
      message: 'User updated successfully',
      user: userResponse
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to update user',
      error: error.message
    });
  }
};

/**
 * Soft delete user (Admin only)
 */
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findOne({ _id: id, isDeleted: false });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent deleting admin users
    if (user.role === 'ADMIN') {
      return res.status(403).json({ message: 'Cannot delete admin users' });
    }

    // Soft delete the user
    user.isDeleted = true;
    await user.save();

    // If user is NGO_ADMIN, soft delete their NGOs and related events
    if (user.role === 'NGO_ADMIN') {
      const ngos = await NGO.find({ createdBy: user._id, isDeleted: false });
      const ngoIds = ngos.map(ngo => ngo._id);

      // Soft delete NGOs
      await NGO.updateMany(
        { createdBy: user._id },
        { isDeleted: true }
      );

      // Soft delete events created by these NGOs
      const events = await Event.find({ ngo: { $in: ngoIds }, isDeleted: false });
      const eventIds = events.map(event => event._id);

      await Event.updateMany(
        { ngo: { $in: ngoIds } },
        { isDeleted: true }
      );

      // Soft delete participations in these events
      await Participation.updateMany(
        { event: { $in: eventIds } },
        { isDeleted: true }
      );
    }

    // If user is a regular user, soft delete their participations
    if (user.role === 'USER') {
      await Participation.updateMany(
        { user: user._id },
        { isDeleted: true }
      );
    }

    return res.status(200).json({
      message: 'User deleted successfully (soft delete applied)'
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to delete user',
      error: error.message
    });
  }
};

/**
 * Get user statistics (Admin only)
 */
export const getUserStats = async (req, res) => {
  try {
    const [totalUsers, activeUsers, ngoAdmins, verifiedNGOAdmins, recentUsers] = await Promise.all([
      User.countDocuments({ isDeleted: false }),
      User.countDocuments({ 
        isDeleted: false, 
        lastLoginAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } 
      }),
      User.countDocuments({ isDeleted: false, role: 'NGO_ADMIN' }),
      User.countDocuments({ isDeleted: false, role: 'NGO_ADMIN', verified: true }),
      User.countDocuments({ 
        isDeleted: false, 
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } 
      })
    ]);

    return res.status(200).json({
      totalUsers,
      activeUsers,
      ngoAdmins,
      verifiedNGOAdmins,
      recentUsers
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to fetch user statistics',
      error: error.message
    });
  }
};

/**
 * Reset user password (Admin only)
 */
export const resetUserPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ 
        message: 'New password must be at least 6 characters long' 
      });
    }

    const user = await User.findOne({ _id: id, isDeleted: false });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Import bcrypt dynamically
    const bcrypt = await import('bcrypt');
    const passwordHash = await bcrypt.hash(newPassword, 10);
    
    user.passwordHash = passwordHash;
    await user.save();

    return res.status(200).json({
      message: 'Password reset successfully'
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to reset password',
      error: error.message
    });
  }
};