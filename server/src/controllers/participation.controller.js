import Participation from '../models/Participation.js';
import Event from '../models/Event.js';
import User from '../models/User.js';
import NGO from '../models/NGO.js';

/**
 * Get all participations for the logged-in user
 */
export const getMyParticipations = async (req, res) => {
  try {
    const participations = await Participation.find({
      user: req.user._id,
      isDeleted: false,
    })
      .populate({
        path: 'event',
        select: 'title dateStart dateEnd status',
        match: { isDeleted: false }
      })
      .lean();

    return res.status(200).json(participations);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch participations', error: error.message });
  }
};

/**
 * Get all participants for a specific event (event creator, NGO owner, or ADMIN)
 */
export const getParticipantsByEvent = async (req, res) => {
  try {
    const event = await Event.findOne({ _id: req.params.eventId, isDeleted: false }).populate('ngo', 'createdBy');
    if (!event) return res.status(404).json({ message: 'Event not found' });

    // Check permissions
    const isEventCreator = event.createdBy.toString() === req.user._id.toString();
    const isNGOCreator = event.ngo && event.ngo.createdBy.toString() === req.user._id.toString();
    if (req.user.role !== 'ADMIN' && !isEventCreator && !isNGOCreator) {
      return res.status(403).json({ message: 'Only event owner, NGO owner, or Admin can view participants' });
    }

    const participants = await Participation.find({ event: event._id, isDeleted: false })
      .populate('user', 'name email points badges')
      .lean();

    return res.status(200).json(participants);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch participants', error: error.message });
  }
};

/**
 * Mark attendance for a participant (event creator, NGO owner, or ADMIN)
 */
export const markAttendance = async (req, res) => {
  try {
    const participation = await Participation.findOne({ _id: req.params.id, isDeleted: false }).populate('user');
    if (!participation) return res.status(404).json({ message: 'Participation not found' });

    const event = await Event.findOne({ _id: participation.event, isDeleted: false }).populate('ngo', 'createdBy');
    if (!event) return res.status(404).json({ message: 'Event not found' });

    // Permission check
    const isEventCreator = event.createdBy.toString() === req.user._id.toString();
    const isNGOCreator = event.ngo && event.ngo.createdBy.toString() === req.user._id.toString();
    if (req.user.role !== 'ADMIN' && !isEventCreator && !isNGOCreator) {
      return res.status(403).json({ message: 'Only event owner, NGO owner, or Admin can mark attendance' });
    }

    // Award points & badge using model methods
    await participation.markAttended(10, ['volunteer-veteran']);
    await participation.user.addPoints(10);
    await participation.user.addBadge('volunteer-veteran');

    return res.status(200).json({ message: 'Attendance marked', participation });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to mark attendance', error: error.message });
  }
};

/**
 * Submit feedback & rating (user only for their own participation)
 * Only allowed after event completion & if attended
 */
export const submitFeedback = async (req, res) => {
  try {
    const { feedback, rating } = req.body;

    const participation = await Participation.findOne({
      _id: req.params.id,
      user: req.user._id,
      isDeleted: false
    });

    if (!participation) {
      return res.status(404).json({ message: 'Participation not found or not yours' });
    }

    const event = await Event.findOne({ _id: participation.event, isDeleted: false });
    if (!event) return res.status(404).json({ message: 'Event not found' });

    if (event.status !== 'COMPLETED') {
      return res.status(400).json({ message: 'Feedback can only be submitted after event completion' });
    }

    if (participation.status !== 'ATTENDED') {
      return res.status(400).json({ message: 'You can only give feedback after attending the event' });
    }

    participation.feedback = feedback;
    participation.rating = rating;
    await participation.save();

    return res.status(200).json({ message: 'Feedback submitted', participation });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to submit feedback', error: error.message });
  }
};

/**
 * Issue certificate (event creator, NGO owner, or ADMIN)
 */
export const issueCertificate = async (req, res) => {
  try {
    const participation = await Participation.findOne({ _id: req.params.id, isDeleted: false });
    if (!participation) return res.status(404).json({ message: 'Participation not found' });

    const event = await Event.findOne({ _id: participation.event, isDeleted: false }).populate('ngo', 'createdBy');
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const isEventCreator = event.createdBy.toString() === req.user._id.toString();
    const isNGOCreator = event.ngo && event.ngo.createdBy.toString() === req.user._id.toString();
    if (req.user.role !== 'ADMIN' && !isEventCreator && !isNGOCreator) {
      return res.status(403).json({ message: 'Only event owner, NGO owner, or Admin can issue certificates' });
    }

    participation.certificateIssued = true;
    await participation.save();

    return res.status(200).json({ message: 'Certificate issued', participation });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to issue certificate', error: error.message });
  }
};
