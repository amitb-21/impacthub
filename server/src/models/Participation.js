import mongoose from 'mongoose';

const participationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },

  registeredAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['REGISTERED', 'ATTENDED', 'CANCELLED'], default: 'REGISTERED' },

  // Gamification
  pointsEarned: { type: Number, default: 0 },
  badgesEarned: [String]
}, { timestamps: true });

participationSchema.index({ user: 1, event: 1 }, { unique: true });

// Mark attendance and award points
participationSchema.methods.markAttended = function (points = 10, badges = []) {
  this.status = 'ATTENDED';
  this.pointsEarned += points;
  this.badgesEarned.push(...badges);
  return this.save();
};

export default mongoose.model('Participation', participationSchema);
