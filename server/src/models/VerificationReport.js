import mongoose from 'mongoose';

const verificationReportSchema = new mongoose.Schema({
  ngo: { type: mongoose.Schema.Types.ObjectId, ref: 'NGO', required: true },
  credibilityScore: { type: Number, default: 0 },
  
  redFlags: [{
    flag: String,
    severity: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH'], default: 'LOW' }
  }],

  summary: String,
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reviewComments: String,

  status: { type: String, enum: ['PENDING', 'DONE'], default: 'PENDING' },
  verifiedAt: Date,

  documents: [String],
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('VerificationReport', verificationReportSchema);
