import VerificationReport from '../models/VerificationReport.js';
import NGO from '../models/NGO.js';

/**
 * Create a verification report (Admin only)
 */
export const createReport = async (req, res) => {
  try {
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Forbidden: Only Admins can create verification reports' });
    }

    const report = new VerificationReport({
      ...req.body,
      reviewedBy: req.user._id,
    });

    const saved = await report.save();
    return res.status(201).json(saved);
  } catch (error) {
    return res.status(400).json({ message: 'Failed to create report', errors: error.errors || error.message });
  }
};

/**
 * Get all verification reports (Admin only)
 */
export const getAllReports = async (req, res) => {
  try {
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Forbidden: Only Admins can view reports' });
    }

    const reports = await VerificationReport.find({ isDeleted: false })
      .populate('ngo', 'name email')
      .populate('reviewedBy', 'name email')
      .lean();

    return res.status(200).json(reports);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch reports', error: error.message });
  }
};

/**
 * Get a report by ID (Admin only)
 */
export const getReportById = async (req, res) => {
  try {
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Forbidden: Only Admins can view reports' });
    }

    const report = await VerificationReport.findOne({ _id: req.params.id, isDeleted: false })
      .populate('ngo', 'name email')
      .populate('reviewedBy', 'name email')
      .lean();

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    return res.status(200).json(report);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch report', error: error.message });
  }
};

/**
 * Update a report (Admin only)
 */
export const updateReport = async (req, res) => {
  try {
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Forbidden: Only Admins can update reports' });
    }

    const report = await VerificationReport.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      req.body,
      { new: true, runValidators: true }
    );

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    return res.status(200).json(report);
  } catch (error) {
    return res.status(400).json({ message: 'Failed to update report', errors: error.errors || error.message });
  }
};

/**
 * Soft delete a report (Admin only)
 */
export const deleteReport = async (req, res) => {
  try {
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Forbidden: Only Admins can delete reports' });
    }

    const report = await VerificationReport.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    return res.status(200).json({ message: 'Report deleted successfully (soft delete applied)' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete report', error: error.message });
  }
};
