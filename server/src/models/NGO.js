import mongoose from 'mongoose';

const ngoSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, unique: true, index: true },
  phone: String,
  registrationNumber: { type: String, required: true, unique: true },
  address: String,
  focusAreas: [String],
  tags: [String],

  location: { city: String, state: String, country: String },
  socialLinks: {
    website: String,
    twitter: String,
    linkedin: String,
    instagram: String,
    facebook:String,
  },

  verificationStatus: { type: String, enum: ['PENDING', 'VERIFIED'], default: 'PENDING' },
  credibilityScore: { type: Number, default: 0 },

  rating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },

  logo: String,
  description: String,

  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('NGO', ngoSchema);
