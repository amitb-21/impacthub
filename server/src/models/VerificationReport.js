import mongoose from 'mongoose';

const verificationReportSchema = new mongoose.Schema({
  ngo: { type: mongoose.Schema.Types.ObjectId, ref: 'NGO', required: true },
  credibilityScore: { type: Number, default: 0 },
  redFlags: [String],
  summary: String,
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['PENDING', 'DONE'], default: 'PENDING' }
}, { timestamps: true });

export default mongoose.model('VerificationReport', verificationReportSchema);
