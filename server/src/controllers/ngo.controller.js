import NGO from '../models/NGO.js';
import Event from '../models/Event.js';
import Participation from '../models/Participation.js';

/**
 * Create NGO (NGO_ADMIN or ADMIN)
 */
export const createNGO = async (req, res) => {
  try {
    if (req.user.role !== 'NGO_ADMIN' && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Only NGO Admins or Admins can create NGOs' });
    }

    const { name, email, registrationNumber } = req.body;
    if (!name || !email || !registrationNumber) {
      return res.status(400).json({ message: 'Name, email, and registration number are required' });
    }

    // Prevent duplicates
    const exists = await NGO.findOne({
      $or: [{ email }, { registrationNumber }],
      isDeleted: false
    });
    if (exists) {
      return res.status(400).json({ message: 'An NGO with this email or registration number already exists' });
    }

    const ngo = new NGO({
      ...req.body,
      createdBy: req.user._id,
    });

    const savedNGO = await ngo.save();
    return res.status(201).json(savedNGO);
  } catch (error) {
    return res.status(400).json({
      message: 'Failed to create NGO',
      errors: error.errors || error.message,
    });
  }
};

/**
 * Get all NGOs with pagination + search
 */
export const getAllNGOs = async (req, res) => {
  try {
    const { search, page = 1, limit = 10, status, createdBy } = req.query;

    const query = { isDeleted: false };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
      ];
    }

    if (status) {
      query.verificationStatus = status.toUpperCase();
    }

    // Add filter for createdBy (for NGO Admin to see their own NGOs)
    if (createdBy) {
      query.createdBy = createdBy;
    }

    const ngos = await NGO.find(query)
      .skip((page - 1) * limit)
      .limit(Math.min(parseInt(limit, 10), 50))
      .populate({ path: 'createdBy', select: 'name email', match: { isDeleted: false } })
      .lean();

    const total = await NGO.countDocuments(query);

    return res.status(200).json({
      data: ngos,
      pagination: { page: parseInt(page, 10), limit: parseInt(limit, 10), total },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch NGOs', error: error.message });
  }
};

/**
 * Get NGO by ID
 */
export const getNGOById = async (req, res) => {
  try {
    const ngo = await NGO.findOne({ _id: req.params.id, isDeleted: false })
      .populate({ path: 'createdBy', select: 'name email', match: { isDeleted: false } })
      .lean();

    if (!ngo) {
      return res.status(404).json({ message: 'NGO not found' });
    }

    return res.status(200).json(ngo);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch NGO', error: error.message });
  }
};

/**
 * Update NGO (NGO_ADMIN can only update their own NGO, ADMIN can update any)
 */
export const updateNGO = async (req, res) => {
  try {
    const query = { _id: req.params.id, isDeleted: false };

    if (req.user.role === 'NGO_ADMIN') {
      query.createdBy = req.user._id; // restrict to their own NGOs
    }

    // Prevent non-admins from changing verification status
    if ('verificationStatus' in req.body && req.user.role !== 'ADMIN') {
      delete req.body.verificationStatus;
    }

    const ngo = await NGO.findOneAndUpdate(query, req.body, {
      new: true,
      runValidators: true,
    });

    if (!ngo) {
      return res.status(404).json({ message: 'NGO not found or not authorized' });
    }

    return res.status(200).json(ngo);
  } catch (error) {
    return res.status(400).json({
      message: 'Failed to update NGO',
      errors: error.errors || error.message,
    });
  }
};

/**
 * Delete NGO (soft delete) — NGO_ADMIN only their own, ADMIN any
 * Also soft deletes related events & participations
 */
export const deleteNGO = async (req, res) => {
  try {
    const query = { _id: req.params.id, isDeleted: false };

    if (req.user.role === 'NGO_ADMIN') {
      query.createdBy = req.user._id;
    }

    const ngo = await NGO.findOneAndUpdate(query, { isDeleted: true }, { new: true });

    if (!ngo) {
      return res.status(404).json({ message: 'NGO not found or not authorized' });
    }

    // Soft delete related events & participations
    const events = await Event.find({ ngo: ngo._id, isDeleted: false });
    const eventIds = events.map(e => e._id);

    await Event.updateMany({ ngo: ngo._id }, { isDeleted: true });
    await Participation.updateMany({ event: { $in: eventIds } }, { isDeleted: true });

    return res.status(200).json({ message: 'NGO deleted successfully (soft delete applied)' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete NGO', error: error.message });
  }
};

/**
 * Verify NGO (Admin only)
 */
export const verifyNGO = async (req, res) => {
  try {
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Only Admins can verify NGOs' });
    }

    const ngo = await NGO.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { verificationStatus: 'VERIFIED' },
      { new: true }
    );

    if (!ngo) {
      return res.status(404).json({ message: 'NGO not found' });
    }

    return res.status(200).json({ message: 'NGO verified successfully', ngo });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to verify NGO', error: error.message });
  }
};