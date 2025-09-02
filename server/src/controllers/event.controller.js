import Event from '../models/Event.js';

export const createEvent = async (req, res) => {
  try {
    const event = new Event({
      ...req.body, 
      status: req.body.status || 'DRAFT',
      createdBy: req.user?._id || req.body.createdBy,
    });
    const savedEvent = await event.save();
    return res.status(201).json(savedEvent);
  } catch (error) {
    return res.status(400).json({ message: 'Failed to create event', error: error.message });
  }
};

export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find({ isDeleted: false })
      .populate('ngo', 'name')
      .populate('createdBy', 'name email');
    return res.status(200).json(events);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch events', error: error.message });
  }
};

export const getEventById = async (req, res) => {
  try {
    const event = await Event.findOne({ _id: req.params.id, isDeleted: false })
      .populate('ngo', 'name')
      .populate('participants', 'name email');

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    return res.status(200).json(event);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch event', error: error.message });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      req.body,
      { new: true, runValidators: true }
    );

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    return res.status(200).json(event);
  } catch (error) {
    return res.status(400).json({ message: 'Failed to update event', error: error.message });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    return res.status(200).json({ message: 'Event deleted successfully (soft delete applied)' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete event', error: error.message });
  }
};

export const registerForEvent = async (req, res) => {
  try {
    const event = await Event.findOne({ _id: req.params.id, isDeleted: false });
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized user' });
    }

    if (event.participants.includes(userId)) {
      return res.status(400).json({ message: 'Already registered for this event' });
    }

    if (event.maxCapacity && event.participants.length >= event.maxCapacity) {
      return res.status(400).json({ message: 'Event is at full capacity' });
    }

    event.participants.push(userId);
    await event.save();

    return res.status(200).json({ message: 'Registered successfully', event });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to register for event', error: error.message });
  }
};

export const unregisterFromEvent = async (req, res) => {
  try {
    const event = await Event.findOne({ _id: req.params.id, isDeleted: false });
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized user' });
    }

    const index = event.participants.indexOf(userId);
    if (index === -1) {
      return res.status(400).json({ message: 'You are not registered for this event' });
    }

    event.participants.splice(index, 1);
    await event.save();

    return res.status(200).json({ message: 'Unregistered successfully', event });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to unregister from event', error: error.message });
  }
};
