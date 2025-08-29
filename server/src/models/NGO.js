import mongoose from 'mongoose';

const ngoSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true },
  phone: String,
  registrationNumber: { type: String, required: true, unique: true },
  address: String,
  focusAreas: [String],

  verificationStatus: { type: String, enum: ['PENDING', 'VERIFIED'], default: 'PENDING' },
  credibilityScore: { type: Number, default: 0 },

  logo: String,
  description: String,

  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

export default mongoose.model('NGO', ngoSchema);
