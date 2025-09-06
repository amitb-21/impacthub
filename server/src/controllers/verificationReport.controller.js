import VerificationReport from '../models/VerificationReport.js';
import NGO from '../models/NGO.js';

/**
 * Create a verification report (Admin only)
 */
export const createReport = async (req, res) => {
  try {
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Only Admins can create verification reports' });
    }

    // Ensure NGO exists and is active
    const ngo = await NGO.findOne({ _id: req.body.ngo, isDeleted: false });
    if (!ngo) {
      return res.status(404).json({ message: 'NGO not found' });
    }

    // Prevent duplicate active reports for the same NGO
    const existingReport = await VerificationReport.findOne({ ngo: ngo._id, isDeleted: false });
    if (existingReport) {
      return res.status(400).json({ message: 'A verification report for this NGO already exists' });
    }

    const report = new VerificationReport({
      ...req.body,
      reviewedBy: req.user._id,
    });

    const saved = await report.save();

    // Auto-verify NGO if criteria met
    if (req.body.status === 'DONE' && req.body.credibilityScore >= 70) {
      await NGO.findByIdAndUpdate(ngo._id, { verificationStatus: 'VERIFIED' });
    }

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
      return res.status(403).json({ message: 'Only Admins can view reports' });
    }

    const reports = await VerificationReport.find({ isDeleted: false })
      .populate({ path: 'ngo', select: 'name email verificationStatus', match: { isDeleted: false } })
      .populate({ path: 'reviewedBy', select: 'name email', match: { isDeleted: false } })
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
      return res.status(403).json({ message: 'Only Admins can view reports' });
    }

    const report = await VerificationReport.findOne({ _id: req.params.id, isDeleted: false })
      .populate({ path: 'ngo', select: 'name email verificationStatus', match: { isDeleted: false } })
      .populate({ path: 'reviewedBy', select: 'name email', match: { isDeleted: false } })
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
      return res.status(403).json({ message: 'Only Admins can update reports' });
    }

    // Prevent changing NGO or reviewer after creation
    delete req.body.ngo;
    delete req.body.reviewedBy;

    const report = await VerificationReport.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      req.body,
      { new: true, runValidators: true }
    );

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Auto-verify NGO if updated status meets criteria
    if (req.body.status === 'DONE' && req.body.credibilityScore >= 70) {
      await NGO.findByIdAndUpdate(report.ngo, { verificationStatus: 'VERIFIED' });
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
      return res.status(403).json({ message: 'Only Admins can delete reports' });
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
