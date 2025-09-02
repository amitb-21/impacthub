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

  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  status: {
    type: String,
    enum: ['DRAFT', 'PUBLISHED', 'COMPLETED'],
    default: 'DRAFT',
  },

  coverImage: String,
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

// Helper virtual
eventSchema.virtual('availableSpots').get(function () {
  return this.maxCapacity ? Math.max(0, this.maxCapacity - this.participants.length) : Infinity;
});

export default mongoose.model('Event', eventSchema);
