import Event from '../models/Event.js';
import Participation from '../models/Participation.js';

/**
 * Create Event (NGO_ADMIN can create for their NGO, ADMIN can create for any)
 */
export const createEvent = async (req, res) => {
  try {
    if (req.user.role !== 'NGO_ADMIN' && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Forbidden: Only NGO Admins or Admins can create events' });
    }

    const event = new Event({
      ...req.body,
      status: req.body.status || 'DRAFT',
      createdBy: req.user._id,
    });

    const savedEvent = await event.save();
    return res.status(201).json(savedEvent);
  } catch (error) {
    return res.status(400).json({ message: 'Failed to create event', errors: error.errors || error.message });
  }
};

/**
 * Get all events (public)
 */
export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find({ isDeleted: false })
      .populate('ngo', 'name')
      .populate('createdBy', 'name email')
      .lean();

    return res.status(200).json(events);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch events', error: error.message });
  }
};

/**
 * Get event by ID
 */
export const getEventById = async (req, res) => {
  try {
    const event = await Event.findOne({ _id: req.params.id, isDeleted: false })
      .populate('ngo', 'name')
      .populate('createdBy', 'name email')
      .lean();

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    return res.status(200).json(event);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch event', error: error.message });
  }
};

/**
 * Update Event (NGO_ADMIN can update their own, ADMIN can update any)
 */
export const updateEvent = async (req, res) => {
  try {
    const query = { _id: req.params.id, isDeleted: false };

    if (req.user.role === 'NGO_ADMIN') {
      query.createdBy = req.user._id; // restrict to own events
    }

    const event = await Event.findOneAndUpdate(query, req.body, {
      new: true,
      runValidators: true,
    });

    if (!event) {
      return res.status(404).json({ message: 'Event not found or not authorized' });
    }

    return res.status(200).json(event);
  } catch (error) {
    return res.status(400).json({ message: 'Failed to update event', errors: error.errors || error.message });
  }
};

/**
 * Delete Event (soft delete) – NGO_ADMIN only their own, ADMIN any
 */
export const deleteEvent = async (req, res) => {
  try {
    const query = { _id: req.params.id, isDeleted: false };

    if (req.user.role === 'NGO_ADMIN') {
      query.createdBy = req.user._id;
    }

    const event = await Event.findOneAndUpdate(query, { isDeleted: true }, { new: true });

    if (!event) {
      return res.status(404).json({ message: 'Event not found or not authorized' });
    }

    return res.status(200).json({ message: 'Event deleted successfully (soft delete applied)' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete event', error: error.message });
  }
};

/**
 * Register for Event (USER)
 */
export const registerForEvent = async (req, res) => {
  try {
    const event = await Event.findOne({ _id: req.params.id, isDeleted: false });
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (req.user.role !== 'USER') {
      return res.status(403).json({ message: 'Only regular users can register for events' });
    }

    // Check capacity
    const count = await Participation.countDocuments({ event: event._id, status: 'REGISTERED', isDeleted: false });
    if (event.maxCapacity && count >= event.maxCapacity) {
      return res.status(400).json({ message: 'Event is at full capacity' });
    }

    // Create participation
    const participation = await Participation.create({
      user: req.user._id,
      event: event._id,
    });

    return res.status(201).json({ message: 'Registered successfully', participation });
  } catch (error) {
    if (error.code === 11000) { // duplicate key violation from unique index
      return res.status(400).json({ message: 'Already registered for this event' });
    }
    return res.status(500).json({ message: 'Failed to register for event', error: error.message });
  }
};

/**
 * Unregister from Event (USER)
 */
export const unregisterFromEvent = async (req, res) => {
  try {
    const participation = await Participation.findOneAndDelete({
      user: req.user._id,
      event: req.params.id,
      isDeleted: false,
    });

    if (!participation) {
      return res.status(400).json({ message: 'You are not registered for this event' });
    }

    return res.status(200).json({ message: 'Unregistered successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to unregister from event', error: error.message });
  }
};
