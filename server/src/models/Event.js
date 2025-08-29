import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema({
  text: String,
  lat: Number,
  lng: Number
}, { _id: false });

const metricsSchema = new mongoose.Schema({
  bags: { type: Number, default: 0 },
  trees: { type: Number, default: 0 },
  hours: { type: Number, default: 0 }
}, { _id: false });

const impactSchema = new mongoose.Schema({
  wasteKg: { type: Number, default: 0 },
  co2Kg: { type: Number, default: 0 }
}, { _id: false });

const eventSchema = new mongoose.Schema({
  ngo: { type: mongoose.Schema.Types.ObjectId, ref: 'NGO' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: { type: String, required: true },
  description: { type: String },
  dateStart: { type: Date, required: true },
  dateEnd: { type: Date },
  location: locationSchema,
  estimates: metricsSchema,
  impact: impactSchema,
  capacity: { type: Number },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  status: { type: String, enum: ['DRAFT','PUBLISHED','COMPLETED'], default: 'PUBLISHED' }
}, { timestamps: true });

export default mongoose.model('Event', eventSchema);
