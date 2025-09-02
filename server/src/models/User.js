import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  firebaseUid: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, index: true },
  phone: String,

  role: { type: String, enum: ['USER', 'NGO_ADMIN', 'ADMIN'], default: 'USER' },

  // Gamification
  points: { type: Number, default: 0, min: 0 },
  level: { type: Number, default: 1, min: 1 },
  badges: [{
    type: String,
    enum: ['eco-warrior', 'tree-planter', 'cleanup-hero', 'volunteer-veteran', 'community-leader']
  }],

  // Optional profile info
  avatar: String,
  bio: String,
  location: { city: String, state: String, country: String },
  interests: [String],

  // Notifications
  notifications: [{
    message: String,
    read: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
  }],

  lastLoginAt: Date,
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

// Virtual level calculation
userSchema.virtual('calculatedLevel').get(function () {
  return Math.floor(this.points / 100) + 1;
});

// Add points and update level
userSchema.methods.addPoints = function (points) {
  this.points += points;
  this.level = Math.floor(this.points / 100) + 1;
  return this.save();
};

// Add badges safely
userSchema.methods.addBadge = function (badge) {
  if (!this.badges.includes(badge)) {
    this.badges.push(badge);
  }
  return this.save();
};

export default mongoose.model('User', userSchema);
