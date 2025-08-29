import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  ngo: { type: mongoose.Schema.Types.ObjectId, ref: 'NGO', required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  title: { type: String, required: true, trim: true },
  description: String,
  category: { type: String, default: 'other' },

  dateStart: { type: Date, required: true },
  dateEnd: Date,

  location: { text: String, city: String, state: String },
  maxCapacity: { type: Number, default: 50 },

  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  status: { 
    type: String, 
    enum: ['DRAFT', 'PUBLISHED', 'COMPLETED'], 
    default: 'PUBLISHED' 
  },

  coverImage: String
}, { timestamps: true });

// Helper virtual
eventSchema.virtual('availableSpots').get(function () {
  return Math.max(0, this.maxCapacity - this.participants.length);
});

export default mongoose.model('Event', eventSchema);
