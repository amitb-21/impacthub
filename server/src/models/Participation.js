import mongoose from 'mongoose';

const participationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  joinedAt: { type: Date, default: Date.now },
  checkedIn: { type: Boolean, default: false },
  contributed: {
    bags: { type: Number, default: 0 },
    trees: { type: Number, default: 0 },
    hours: { type: Number, default: 0 }
  }
}, { timestamps: true, indexes: [{ user: 1, event: 1, unique: true }] });

export default mongoose.model('Participation', participationSchema);
