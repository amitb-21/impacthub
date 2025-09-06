import User from '../models/User.js';
import NGO from '../models/NGO.js';
import Event from '../models/Event.js';
import Participation from '../models/Participation.js';

/**
 * Dashboard metrics
 */
export async function metrics(req, res) {
  try {
    const [users, ngos, events, participants] = await Promise.all([
      User.countDocuments({ isDeleted: false }),
      NGO.countDocuments({ isDeleted: false }),
      Event.countDocuments({ isDeleted: false }),
      Participation.countDocuments({ isDeleted: false }),
    ]);

    return res.status(200).json({
      users: users || 0,
      ngos: ngos || 0,
      events: events || 0,
      participants: participants || 0
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to fetch metrics',
      error: error.message
    });
  }
}

/**
 * Leaderboard – top users by points
 */
export async function leaderboard(req, res) {
  try {
    const safeLimit = Math.min(Number(req.query.limit) || 10, 50);

    const topUsers = await User.find({ isDeleted: false })
      .sort({ points: -1 })
      .limit(safeLimit)
      .select('name email points level badges avatar')
      .lean();

    return res.status(200).json(topUsers);
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to fetch leaderboard',
      error: error.message
    });
  }
}
