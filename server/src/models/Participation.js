import mongoose from 'mongoose';

const participationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },

  registeredAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['REGISTERED', 'ATTENDED', 'CANCELLED'], default: 'REGISTERED', index: true },

  // Gamification
  pointsEarned: { type: Number, default: 0 },
  badgesEarned: [String],

  // Feedback & certification
  feedback: String,
  rating: { type: Number, min: 1, max: 5 },
  certificateIssued: { type: Boolean, default: false },

  isDeleted: { type: Boolean, default: false }
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
