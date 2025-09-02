import NGO from '../models/NGO.js';

export const createNGO = async (req, res) => {
  try {
    const ngo = new NGO({
      ...req.body,
      createdBy: req.user?._id || req.body.createdBy,
    });
    const savedNGO = await ngo.save();
    return res.status(201).json(savedNGO);
  } catch (error) {
    return res.status(400).json({ message: 'Failed to create NGO', error: error.message });
  }
};

//pagination
export const getAllNGOs = async (req, res) => {
  try {
    const { search, page = 1, limit = 10, status } = req.query;

    const query = { isDeleted: false };

    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    if (status) {
      query.verificationStatus = status.toUpperCase();
    }

    const ngos = await NGO.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit, 10))
      .populate('createdBy', 'name email')
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

export const getNGOById = async (req, res) => {
  try {
    const ngo = await NGO.findOne({ _id: req.params.id, isDeleted: false })
      .populate('createdBy', 'name email');

    if (!ngo) {
      return res.status(404).json({ message: 'NGO not found' });
    }

    return res.status(200).json(ngo);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch NGO', error: error.message });
  }
};

export const updateNGO = async (req, res) => {
  try {
    const ngo = await NGO.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      req.body,
      { new: true, runValidators: true }
    );

    if (!ngo) {
      return res.status(404).json({ message: 'NGO not found' });
    }

    return res.status(200).json(ngo);
  } catch (error) {
    return res.status(400).json({ message: 'Failed to update NGO', error: error.message });
  }
};

export const deleteNGO = async (req, res) => {
  try {
    const ngo = await NGO.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );

    if (!ngo) {
      return res.status(404).json({ message: 'NGO not found' });
    }

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
