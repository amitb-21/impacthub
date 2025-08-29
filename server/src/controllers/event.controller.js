import Event from '../models/Event.js';

export const createEvent = async (req, res) => {
  try {
    const event = new Event({
      ...req.body,
      createdBy: req.user?._id || req.body.createdBy, // handle authentication later
    });
    const savedEvent = await event.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create event', error: error.message });
  }
};


export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate('ngo', 'name')
      .populate('createdBy', 'name email');
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch events', error: error.message });
  }
};


export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('ngo', 'name')
      .populate('participants', 'name email');

    if (!event) return res.status(404).json({ message: 'Event not found' });

    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch event', error: error.message });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!event) return res.status(404).json({ message: 'Event not found' });

    res.status(200).json(event);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update event', error: error.message });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);

    if (!event) return res.status(404).json({ message: 'Event not found' });

    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete event', error: error.message });
  }
};

export const registerForEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) return res.status(404).json({ message: 'Event not found' });

    if (event.participants.includes(req.user?._id)) {
      return res.status(400).json({ message: 'Already registered for this event' });
    }

    if (event.participants.length >= event.maxCapacity) {
      return res.status(400).json({ message: 'Event is at full capacity' });
    }

    event.participants.push(req.user?._id);
    await event.save();

    res.status(200).json({ message: 'Registered successfully', event });
  } catch (error) {
    res.status(500).json({ message: 'Failed to register for event', error: error.message });
  }
};
