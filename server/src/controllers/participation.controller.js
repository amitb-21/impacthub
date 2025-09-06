import Participation from '../models/Participation.js';
import Event from '../models/Event.js';
import User from '../models/User.js';

/**
 * Get all participations for the logged-in user
 */
export const getMyParticipations = async (req, res) => {
  try {
    const participations = await Participation.find({
      user: req.user._id,
      isDeleted: false,
    })
      .populate('event', 'title dateStart dateEnd status')
      .lean();

    return res.status(200).json(participations);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch participations', error: error.message });
  }
};

/**
 * Get all participants for a specific event (for organizers/admins)
 */
export const getParticipantsByEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    // Only event creator or ADMIN can view
    if (req.user.role !== 'ADMIN' && event.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Forbidden: Only event owner or Admin can view participants' });
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
 * Mark attendance for a participant (organizer/admin only)
 */
export const markAttendance = async (req, res) => {
  try {
    const participation = await Participation.findById(req.params.id).populate('user');
    if (!participation) return res.status(404).json({ message: 'Participation not found' });

    // Event owner or ADMIN only
    const event = await Event.findById(participation.event);
    if (req.user.role !== 'ADMIN' && event.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Forbidden: Only event owner or Admin can mark attendance' });
    }

    await participation.markAttended(10, ['volunteer-veteran']);

    // Give user gamification points
    await User.findByIdAndUpdate(participation.user._id, {
      $inc: { points: 10 },
      $addToSet: { badges: 'volunteer-veteran' },
    });

    return res.status(200).json({ message: 'Attendance marked', participation });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to mark attendance', error: error.message });
  }
};

/**
 * Submit feedback & rating (user only for their own participation)
 */
export const submitFeedback = async (req, res) => {
  try {
    const { feedback, rating } = req.body;
    const participation = await Participation.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id, isDeleted: false },
      { feedback, rating },
      { new: true }
    );

    if (!participation) {
      return res.status(404).json({ message: 'Participation not found or not yours' });
    }

    return res.status(200).json({ message: 'Feedback submitted', participation });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to submit feedback', error: error.message });
  }
};

/**
 * Issue certificate (organizer/admin only)
 */
export const issueCertificate = async (req, res) => {
  try {
    const participation = await Participation.findById(req.params.id);
    if (!participation) return res.status(404).json({ message: 'Participation not found' });

    // Only event owner or admin
    const event = await Event.findById(participation.event);
    if (req.user.role !== 'ADMIN' && event.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Forbidden: Only event owner or Admin can issue certificate' });
    }

    participation.certificateIssued = true;
    await participation.save();

    return res.status(200).json({ message: 'Certificate issued', participation });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to issue certificate', error: error.message });
  }
};
