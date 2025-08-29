
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, index: true },
  firebaseUid: { type: String, required: true, unique: true },
  role: { type: String, enum: ['USER','NGO_ADMIN','ADMIN'], default: 'USER' },
  interests: [{ type: String }],
  badges: [{ type: String }],
  points: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
