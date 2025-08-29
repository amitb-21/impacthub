import mongoose from 'mongoose';

const verificationReportSchema = new mongoose.Schema({
  ngo: { type: mongoose.Schema.Types.ObjectId, ref: 'NGO', required: true },
  source: { type: String, enum: ['AUTO','HUMAN'], default: 'AUTO' },
  credibilityScore: { type: Number, default: 0 },
  redFlags: [{ type: String }],
  summary: { type: String },
  status: { type: String, enum: ['PENDING','DONE'], default: 'DONE' }
}, { timestamps: true });

export default mongoose.model('VerificationReport', verificationReportSchema);
