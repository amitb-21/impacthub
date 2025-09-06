import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  ngo: { type: mongoose.Schema.Types.ObjectId, ref: 'NGO', required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  title: { type: String, required: true, trim: true },
  description: String,
  category: { type: String, default: 'other' },

  tags: [String],
  dateStart: { type: Date, required: true, index: true },
  dateEnd: Date,

  isOnline: { type: Boolean, default: false },
  location: { text: String, city: String, state: String, country: String },
  coordinates: { lat: Number, lng: Number },

  requirements: String,
  maxCapacity: { type: Number, default: null },

  status: {
    type: String,
    enum: ['DRAFT', 'PUBLISHED', 'COMPLETED'],
    default: 'DRAFT',
  },

  coverImage: String,
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

// Helper virtual (calculated later from Participation)
eventSchema.virtual('availableSpots').get(async function () {
  if (!this.maxCapacity) return Infinity;

  // Lazy require to avoid circular import issues
  const Participation = mongoose.model('Participation');
  const count = await Participation.countDocuments({ event: this._id, isDeleted: false });
  return Math.max(0, this.maxCapacity - count);
});

export default mongoose.model('Event', eventSchema);
