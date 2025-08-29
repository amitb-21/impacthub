import mongoose from 'mongoose';

const docSchema = new mongoose.Schema({
  url: String,
  publicId: String,
  type: { type: String, default: 'registration' }
}, { _id: false });

const ngoSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  regNumber: { type: String },
  address: { type: String },
  website: { type: String },
  tags: [{ type: String }],
  documents: [docSchema],
  status: { type: String, enum: ['PENDING','AUTO_VERIFIED','HUMAN_VERIFIED'], default: 'PENDING' },
  credibilityScore: { type: Number, default: 0 },
  redFlags: [{ type: String }],
  summary: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  verifiedAt: { type: Date }
}, { timestamps: true });

export default mongoose.model('NGO', ngoSchema);
