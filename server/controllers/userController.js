import User from '../models/User.js';
import Event from '../models/Event.js';
import { sendSuccess, sendError, sendPaginated } from '../utils/response.js';
import QRCode from 'qrcode';

/**
 * Badge System Configuration (25 Badges)
 */
const BADGE_SYSTEM = {
  '🏆': 'Champion',
  '🥇': 'First Place',
  '🥈': 'Second Place',
  '🥉': 'Third Place',
  '⚡': 'Lightning Fast',
  '💻': 'Code Master',
  '🧠': 'Brain Power',
  '🚀': 'Rocket Launcher',
  '🎯': 'Bullseye',
  '🔥': 'On Fire',
  '⭐': 'Star Performer',
  '👑': 'Crowned',
  '🎨': 'Creative Designer',
  '🔐': 'Security Expert',
  '📊': 'Data Analyst',
  '🌟': 'Rising Star',
  '💡': 'Innovator',
  '🎓': 'Scholar',
  '🏅': 'Achiever',
  '✨': 'Brilliant',
  '🎪': 'Event Master',
  '🤝': 'Team Player',
  '📈': 'Growth Mindset',
  '🔬': 'Researcher',
  '🎭': 'Multi-talented',
};

/**
 * Badge Assignment Rules
 */
const BADGE_RULES = {
  // Participation badges
  'Bullseye': {
    condition: (user) => user.stats.participation >= 5,
    description: 'Participated in 5+ events',
  },
  'Team Player': {
    condition: (user) => user.stats.participation >= 10,
    description: 'Participated in 10+ events',
  },
  'Event Master': {
    condition: (user) => user.stats.participation >= 25,
    description: 'Participated in 25+ events',
  },

  // Win badges
  'Third Place': {
    condition: (user) => user.stats.wins >= 1,
    description: 'Won 1 event (3rd place or better)',
  },
  'Second Place': {
    condition: (user) => user.stats.wins >= 2,
    description: 'Won 2+ events (2nd place or better)',
  },
  'First Place': {
    condition: (user) => user.stats.wins >= 3,
    description: 'Won 3+ events (1st place)',
  },
  'Champion': {
    condition: (user) => user.stats.wins >= 5,
    description: 'Won 5+ events (1st place)',
  },

  // Cluster-specific badges
  'Code Master': {
    condition: (user) => user.stats.clusterPoints >= 100,
    description: 'Earned 100+ cluster points',
  },
  'Rocket Launcher': {
    condition: (user) => user.stats.clusterPoints >= 250,
    description: 'Earned 250+ cluster points',
  },

  // Streak badges
  'On Fire': {
    condition: (user) => user.stats.participation >= 10 && user.stats.wins >= 2,
    description: 'Active participant with multiple wins',
  },
  'Rising Star': {
    condition: (user) => user.stats.participation >= 15 && user.stats.wins >= 1,
    description: 'Consistent participation and performance',
  },

  // Achievement badges
  'Star Performer': {
    condition: (user) => user.stats.wins >= 3 && user.stats.clusterPoints >= 150,
    description: 'Excellent overall performance',
  },
  'Achiever': {
    condition: (user) => user.stats.participation >= 5,
    description: 'Took the first step towards success',
  },

  // Bonus badges
  'Lightning Fast': {
    condition: (user) => user.stats.wins >= 1,
    description: 'Quick learner and achiever',
  },
  'Brain Power': {
    condition: (user) => user.stats.clusterPoints >= 50,
    description: 'Intellectual contribution',
  },
  'Crowned': {
    condition: (user) => user.stats.wins >= 5 && user.stats.clusterPoints >= 200,
    description: 'Ultimate champion',
  },
  'Creative Designer': {
    condition: (user) => user.badges.length >= 5,
    description: 'Diverse skill set',
  },
  'Security Expert': {
    condition: (user) => user.stats.participation >= 8,
    description: 'Security-focused contributor',
  },
  'Data Analyst': {
    condition: (user) => user.stats.clusterPoints >= 75,
    description: 'Data-driven approach',
  },
  'Innovator': {
    condition: (user) => user.stats.wins >= 2,
    description: 'Creative problem solver',
  },
  'Scholar': {
    condition: (user) => user.stats.participation >= 12,
    description: 'Dedicated learner',
  },
  'Brilliant': {
    condition: (user) => user.stats.wins >= 4 && user.stats.participation >= 10,
    description: 'Exceptional overall achievement',
  },
  'Growth Mindset': {
    condition: (user) => user.stats.participation >= 8 && user.stats.wins >= 1,
    description: 'Continuously improving',
  },
  'Researcher': {
    condition: (user) => user.stats.clusterPoints >= 120,
    description: 'Research-oriented mindset',
  },
  'Multi-talented': {
    condition: (user) => user.badges.length >= 8,
    description: 'Master of multiple skills',
  },
};

/**
 * Get all members (with pagination)
 */
export const getMembers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, branch, year, search } = req.query;

    // Build filter
    const filter = { role: 'user', isActive: true };

    if (branch) filter.branch = branch;
    if (year) filter.year = year;

    // Search by name or email
    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    // Pagination
    const skip = (page - 1) * limit;

    const members = await User.find(filter)
      .limit(parseInt(limit))
      .skip(skip)
      .select('-password');

    const totalMembers = await User.countDocuments(filter);

    return sendPaginated(
      res,
      members,
      {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalMembers / limit),
        totalDocuments: totalMembers,
        limit: parseInt(limit),
      },
      'Members retrieved successfully'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get member by ID
 */
export const getMemberById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const member = await User.findById(id).select('-password');

    if (!member) {
      return sendError(res, 'Member not found', 404);
    }

    return sendSuccess(res, member, 'Member retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get all faculty members
 */
export const getFaculty = async (req, res, next) => {
  try {
    const { search } = req.query;

    const filter = { role: 'faculty', isActive: true };

    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const faculty = await User.find(filter).select('-password');

    return sendSuccess(res, faculty, 'Faculty members retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get User Profile with QR Code
 * Returns user details, QR code (generated on-the-fly), progress, stats
 * @route GET /user/profile
 */
export const getUserProfile = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    // Get user with populated refs
    const user = await User.findById(userId)
      .select('-password')
      .populate('cluster', 'name icon color')
      .populate('eventsParticipated', 'title date eventType');

    if (!user) {
      return sendError(res, 'User not found', 404);
    }

    // Generate QR code with user info JSON
    const qrData = JSON.stringify({
      id: user._id,
      name: user.fullName,
      email: user.email,
      srn: user.srn,
      class: `${user.class.year} ${user.class.branch} ${user.class.division}`,
      points: user.stats.clusterPoints,
      badges: user.badges.length,
    });

    const qrCode = await QRCode.toDataURL(qrData);

    // Calculate progress
    const totalBadges = Object.keys(BADGE_SYSTEM).length;
    const earnedBadges = user.badges.length;
    const badgeProgress = (earnedBadges / totalBadges) * 100;

    const participationProgress = Math.min((user.stats.participation / 25) * 100, 100);
    const winsProgress = Math.min((user.stats.wins / 10) * 100, 100);

    const profileData = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
      srn: user.srn,
      class: user.class,
      cluster: user.cluster,
      bio: user.bio,
      qrCode,
      stats: {
        wins: user.stats.wins,
        participation: user.stats.participation,
        clusterPoints: user.stats.clusterPoints,
      },
      progress: {
        badges: {
          earned: earnedBadges,
          total: totalBadges,
          percentage: Math.round(badgeProgress),
        },
        participation: {
          count: user.stats.participation,
          target: 25,
          percentage: Math.round(participationProgress),
        },
        wins: {
          count: user.stats.wins,
          target: 10,
          percentage: Math.round(winsProgress),
        },
      },
      badges: user.badges,
      achievements: user.achievements,
      eventsParticipated: user.eventsParticipated.length,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin,
    };

    return sendSuccess(res, profileData, 'User profile retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get User Statistics
 * Returns wins, participation count, cluster points
 * @route GET /user/stats
 */
export const getUserStats = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId).select('stats fullName email');

    if (!user) {
      return sendError(res, 'User not found', 404);
    }

    const stats = {
      user: {
        id: user._id,
        name: user.fullName,
        email: user.email,
      },
      stats: {
        wins: user.stats.wins,
        participation: user.stats.participation,
        clusterPoints: user.stats.clusterPoints,
      },
      summary: {
        totalContribution: user.stats.wins + user.stats.participation,
        averagePointsPerEvent: user.stats.participation > 0 
          ? Math.round(user.stats.clusterPoints / user.stats.participation) 
          : 0,
        winRate: user.stats.participation > 0 
          ? Math.round((user.stats.wins / user.stats.participation) * 100) 
          : 0,
      },
    };

    return sendSuccess(res, stats, 'User statistics retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get User Badges with Auto-Assignment
 * Returns all 25 possible badges with earned status
 * Auto-assigns badges based on achievement rules
 * @route GET /user/badges
 */
export const getUserBadges = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId).select('stats badges fullName');

    if (!user) {
      return sendError(res, 'User not found', 404);
    }

    // Auto-assign badges based on rules
    const newBadges = [];
    for (const [badgeName, badgeEmoji] of Object.entries(BADGE_SYSTEM)) {
      // Find rule for this badge
      const rule = Object.entries(BADGE_RULES).find(
        ([name]) => name === badgeName
      );

      if (rule && rule[1].condition(user)) {
        const emoji = Object.keys(BADGE_SYSTEM).find(
          (key) => BADGE_SYSTEM[key] === badgeName
        );
        if (emoji && !user.badges.includes(emoji)) {
          newBadges.push(emoji);
        }
      }
    }

    // Save newly earned badges
    if (newBadges.length > 0) {
      user.badges = [...new Set([...user.badges, ...newBadges])].slice(0, 25);
      await user.save();
    }

    // Build badge response
    const allBadges = [];
    for (const [emoji, name] of Object.entries(BADGE_SYSTEM)) {
      const rule = BADGE_RULES[name];
      const isEarned = user.badges.includes(emoji);
      const ruleConditionMet = rule ? rule.condition(user) : false;

      allBadges.push({
        emoji,
        name,
        earned: isEarned,
        description: rule ? rule.description : '',
        conditionMet: ruleConditionMet,
        earnedAt: isEarned ? user.badges.indexOf(emoji) : null,
      });
    }

    const badgesData = {
      user: {
        id: user._id,
        name: user.fullName,
      },
      summary: {
        totalEarned: user.badges.length,
        totalAvailable: Object.keys(BADGE_SYSTEM).length,
        percentage: Math.round((user.badges.length / Object.keys(BADGE_SYSTEM).length) * 100),
        newlyEarned: newBadges.length,
      },
      badges: {
        earned: allBadges.filter((b) => b.earned),
        available: allBadges.filter((b) => !b.earned),
        all: allBadges,
      },
    };

    return sendSuccess(res, badgesData, 'Badges retrieved and auto-assigned successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get Global Leaderboard
 * Sorted by cluster points (descending), with logged-in user highlighted
 * @route GET /user/leaderboard
 */
export const getLeaderboard = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { limit = 100, page = 1, sortBy = 'clusterPoints' } = req.query;

    // Determine sort field
    const sortField = {
      clusterPoints: 'stats.clusterPoints',
      wins: 'stats.wins',
      participation: 'stats.participation',
      name: 'fullName',
    }[sortBy] || 'stats.clusterPoints';

    // Pagination
    const skip = (page - 1) * limit;

    // Get leaderboard
    const leaderboard = await User.find({ role: 'user' })
      .select('fullName email class stats badges profilePic srn')
      .sort({ [sortField]: -1 })
      .limit(parseInt(limit))
      .skip(skip)
      .lean();

    // Add rank and highlight current user
    const rankedLeaderboard = leaderboard.map((user, index) => ({
      ...user,
      rank: skip + index + 1,
      isCurrentUser: user._id.toString() === userId,
    }));

    // Get total users for pagination
    const totalUsers = await User.countDocuments({ role: 'user' });

    const leaderboardData = {
      leaderboard: rankedLeaderboard,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalUsers / limit),
        totalUsers,
        limit: parseInt(limit),
      },
      currentUserRank: rankedLeaderboard.find((u) => u.isCurrentUser)?.rank || null,
    };

    return sendSuccess(res, leaderboardData, 'Leaderboard retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get Class-Wise Leaderboard
 * Leaderboard filtered by user's class (year, branch, division)
 * @route GET /user/class-leaderboard
 */
export const getClassLeaderboard = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { limit = 50, page = 1 } = req.query;

    // Get current user's class info
    const currentUser = await User.findById(userId).select('class');

    if (!currentUser) {
      return sendError(res, 'User not found', 404);
    }

    // Pagination
    const skip = (page - 1) * limit;

    // Get class leaderboard
    const classLeaderboard = await User.find({
      role: 'user',
      'class.year': currentUser.class.year,
      'class.branch': currentUser.class.branch,
      'class.division': currentUser.class.division,
    })
      .select('fullName email class stats badges profilePic srn')
      .sort({ 'stats.clusterPoints': -1 })
      .limit(parseInt(limit))
      .skip(skip)
      .lean();

    // Add rank and highlight current user
    const rankedClassLeaderboard = classLeaderboard.map((user, index) => ({
      ...user,
      rank: skip + index + 1,
      isCurrentUser: user._id.toString() === userId,
    }));

    // Get total users in class
    const totalUsersInClass = await User.countDocuments({
      role: 'user',
      'class.year': currentUser.class.year,
      'class.branch': currentUser.class.branch,
      'class.division': currentUser.class.division,
    });

    const classLeaderboardData = {
      class: {
        year: currentUser.class.year,
        branch: currentUser.class.branch,
        division: currentUser.class.division,
      },
      leaderboard: rankedClassLeaderboard,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalUsersInClass / limit),
        totalUsers: totalUsersInClass,
        limit: parseInt(limit),
      },
      currentUserRank: rankedClassLeaderboard.find((u) => u.isCurrentUser)?.rank || null,
    };

    return sendSuccess(res, classLeaderboardData, 'Class leaderboard retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Register User for Event
 * Allow users to self-register for upcoming events
 * @route POST /user/event/:eventId/register
 */
export const registerForEvent = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { eventId } = req.params;

    // Get event
    const event = await Event.findById(eventId);

    if (!event) {
      return sendError(res, 'Event not found', 404);
    }

    // Check if event is upcoming
    if (event.eventType !== 'upcoming') {
      return sendError(res, 'Can only register for upcoming events', 400);
    }

    // Check if user is already registered
    if (event.participants.includes(userId)) {
      return sendError(res, 'User is already registered for this event', 409);
    }

    // Check capacity
    if (event.capacity && event.participants.length >= event.capacity) {
      return sendError(res, 'Event has reached maximum capacity', 400);
    }

    // Check registration deadline
    if (event.registrationDeadline && new Date() > event.registrationDeadline) {
      return sendError(res, 'Registration deadline has passed', 400);
    }

    // Add participant
    event.addParticipant(userId);
    await event.save();

    // Update user's eventsParticipated
    const user = await User.findById(userId);
    if (!user.eventsParticipated.includes(eventId)) {
      user.eventsParticipated.push(eventId);
      user.stats.participation += 1;
      await user.save();
    }

    const registrationData = {
      event: {
        _id: event._id,
        title: event.title,
        date: event.date,
        location: event.location,
      },
      user: {
        _id: user._id,
        fullName: user.fullName,
      },
      status: 'registered',
      participantCount: event.participants.length,
      message: 'Successfully registered for event',
    };

    return sendSuccess(res, registrationData, 'Registered for event successfully', 201);
  } catch (error) {
    next(error);
  }
};

/**
 * Get User's Registered Events
 * @route GET /user/events
 */
export const getUserEvents = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { status = 'all' } = req.query;

    // Get user's events
    const filter = { participants: userId };

    if (status !== 'all') {
      filter.eventType = status;
    }

    const events = await Event.find(filter)
      .select('title date eventType cluster location category')
      .populate('cluster', 'name')
      .sort({ date: -1 });

    const userEvents = {
      user: {
        id: userId,
      },
      events: events.map((event) => ({
        _id: event._id,
        title: event.title,
        date: event.date,
        type: event.eventType,
        cluster: event.cluster,
        location: event.location,
        category: event.category,
      })),
      summary: {
        total: events.length,
        upcoming: events.filter((e) => e.eventType === 'upcoming').length,
        past: events.filter((e) => e.eventType === 'past').length,
      },
    };

    return sendSuccess(res, userEvents, 'User events retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Unregister User from Event
 * @route DELETE /user/event/:eventId/register
 */
export const unregisterFromEvent = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { eventId } = req.params;

    // Get event
    const event = await Event.findById(eventId);

    if (!event) {
      return sendError(res, 'Event not found', 404);
    }

    // Check if user is registered
    if (!event.participants.includes(userId)) {
      return sendError(res, 'User is not registered for this event', 404);
    }

    // Check if event is upcoming (can only unregister from upcoming)
    if (event.eventType !== 'upcoming') {
      return sendError(res, 'Can only unregister from upcoming events', 400);
    }

    // Remove participant
    event.participants = event.participants.filter((id) => id.toString() !== userId);
    await event.save();

    // Update user
    const user = await User.findById(userId);
    user.eventsParticipated = user.eventsParticipated.filter(
      (id) => id.toString() !== eventId
    );
    user.stats.participation = Math.max(0, user.stats.participation - 1);
    await user.save();

    return sendSuccess(res, {
      event: event.title,
      status: 'unregistered',
    }, 'Unregistered from event successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Update user by ID (Admin only)
 */
export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { fullName, bio, branch, year, division, isActive, role } = req.body;

    const updateData = {};

    if (fullName) updateData.fullName = fullName;
    if (bio) updateData.bio = bio;
    if (branch) updateData.branch = branch;
    if (year) updateData.year = year;
    if (division) updateData.division = division;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (role) updateData.role = role;

    const user = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).select('-password');

    if (!user) {
      return sendError(res, 'User not found', 404);
    }

    return sendSuccess(res, user, 'User updated successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Delete user (Admin only)
 */
export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return sendError(res, 'User not found', 404);
    }

    return sendSuccess(res, { deletedId: id }, 'User deleted successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get statistics (Admin only)
 */
export const getStatistics = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalFaculty = await User.countDocuments({ role: 'faculty' });
    const totalActive = await User.countDocuments({ isActive: true });

    // Get members by branch
    const membersByBranch = await User.aggregate([
      { $match: { role: 'user', isActive: true } },
      { $group: { _id: '$branch', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Get members by year
    const membersByYear = await User.aggregate([
      { $match: { role: 'user', isActive: true } },
      { $group: { _id: '$year', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    return sendSuccess(
      res,
      {
        totalUsers,
        totalFaculty,
        totalActive,
        membersByBranch,
        membersByYear,
      },
      'Statistics retrieved successfully'
    );
  } catch (error) {
    next(error);
  }
};
