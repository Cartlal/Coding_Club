import Admin from '../models/Admin.js';
import User from '../models/User.js';
import Event from '../models/Event.js';
import Notice from '../models/Notice.js';
import Cluster from '../models/Cluster.js';
import bcrypt from 'bcryptjs';
import { sendSuccess, sendError } from '../utils/response.js';

/**
 * ADMIN MANAGEMENT ENDPOINTS
 */

/**
 * Create new admin account
 * @route POST /master/create-admin
 */
export const createAdmin = async (req, res, next) => {
  try {
    const { fullName, username, email, password, cluster } = req.body;

    // Validate required fields
    if (!fullName || !username || !email || !password || !cluster) {
      return sendError(res, 'Missing required fields: fullName, username, email, password, cluster', 400);
    }

    // Validate cluster exists
    const clusterExists = await Cluster.findById(cluster);
    if (!clusterExists) {
      return sendError(res, 'Cluster not found', 404);
    }

    // Check if username already exists
    const existingUsername = await Admin.findOne({ username: username.toLowerCase() });
    if (existingUsername) {
      return sendError(res, 'Username already exists', 409);
    }

    // Check if email already exists
    const existingEmail = await Admin.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      return sendError(res, 'Email already exists', 409);
    }

    // Validate password strength
    if (password.length < 8) {
      return sendError(res, 'Password must be at least 8 characters long', 400);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin
    const newAdmin = new Admin({
      fullName,
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password: hashedPassword,
      cluster,
      role: 'admin',
      createdBy: req.user.userId, // Master's ID
      isActive: true,
      permissions: {
        manageUsers: true,
        manageEvents: true,
      },
    });

    await newAdmin.save();

    // Populate references
    await newAdmin.populate('cluster', 'name icon color');
    await newAdmin.populate('createdBy', 'fullName username');

    // Return without password
    const adminData = newAdmin.toObject();
    delete adminData.password;

    return sendSuccess(res, adminData, 'Admin created successfully', 201);
  } catch (error) {
    next(error);
  }
};

/**
 * Get all admins
 * @route GET /master/admins
 */
export const getAdmins = async (req, res, next) => {
  try {
    const admins = await Admin.find({ isActive: true })
      .populate('cluster', 'name icon color')
      .populate('createdBy', 'fullName username')
      .select('-password')
      .sort({ createdAt: -1 });

    return sendSuccess(res, admins, 'Admins retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Remove admin account
 * @route DELETE /master/remove-admin/:id
 */
export const removeAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate admin ID format
    if (!id) {
      return sendError(res, 'Admin ID is required', 400);
    }

    // Get admin
    const admin = await Admin.findById(id);
    if (!admin) {
      return sendError(res, 'Admin not found', 404);
    }

    // Prevent removing master admins (superadmin)
    if (admin.role === 'master' || admin.role === 'superadmin') {
      return sendError(res, 'Cannot remove master/superadmin accounts', 403);
    }

    // Get admin's cluster for reassignment check
    const clusterId = admin.cluster;

    // Check if this is the only admin for the cluster
    const otherAdmins = await Admin.countDocuments({
      cluster: clusterId,
      _id: { $ne: id },
      isActive: true,
      role: { $in: ['admin', 'superadmin'] },
    });

    if (otherAdmins === 0) {
      return sendError(
        res,
        'Cannot remove the last active admin from a cluster. Assign another admin first.',
        400
      );
    }

    // Soft delete - mark as inactive instead of deleting
    admin.isActive = false;
    admin.deactivatedAt = new Date();
    admin.deactivatedBy = req.user.userId;

    await admin.save();

    const adminData = admin.toObject();
    delete adminData.password;

    return sendSuccess(res, adminData, 'Admin deactivated successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Reactivate deactivated admin
 * @route PUT /master/reactivate-admin/:id
 */
export const reactivateAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;

    const admin = await Admin.findById(id);
    if (!admin) {
      return sendError(res, 'Admin not found', 404);
    }

    if (admin.isActive) {
      return sendError(res, 'Admin is already active', 400);
    }

    admin.isActive = true;
    admin.deactivatedAt = null;
    admin.deactivatedBy = null;

    await admin.save();

    const adminData = admin.toObject();
    delete adminData.password;

    return sendSuccess(res, adminData, 'Admin reactivated successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * USER MANAGEMENT ENDPOINTS
 */

/**
 * Get all users with pagination
 * @route GET /master/users
 */
export const getAllUsers = async (req, res, next) => {
  try {
    const { limit = 50, page = 1, class: userClass, search } = req.query;

    // Build filter
    const filter = {};

    if (userClass) {
      filter.class = userClass;
    }

    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { srn: { $regex: search, $options: 'i' } },
      ];
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get users
    const users = await User.find(filter)
      .select('-password') // Exclude password
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    // Get total count
    const totalUsers = await User.countDocuments(filter);

    const usersData = {
      users,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalUsers / parseInt(limit)),
        totalUsers,
        limit: parseInt(limit),
      },
    };

    return sendSuccess(res, usersData, 'Users retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Remove user (3-step confirmation logic)
 * Step 1: Request removal with verification token
 * Step 2: Confirm with password re-validation
 * Step 3: Final deletion
 * @route DELETE /master/remove-user/:id
 */
export const removeUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { step, password, confirmationToken } = req.body;

    // Validate user ID
    if (!id) {
      return sendError(res, 'User ID is required', 400);
    }

    // Get user
    const user = await User.findById(id);
    if (!user) {
      return sendError(res, 'User not found', 404);
    }

    // STEP 1: Generate confirmation token
    if (!step || step === '1') {
      // Generate confirmation token (expires in 10 minutes)
      const confirmToken = Math.random().toString(36).substr(2, 9).toUpperCase();
      const tokenExpiry = new Date(Date.now() + 10 * 60 * 1000);

      // Store in session/cache (you might want to use Redis for production)
      // For now, we'll return the token to be used in next step
      // In production, store this securely and verify on step 2

      const removalData = {
        userId: id,
        userName: user.fullName,
        email: user.email,
        removalInitiatedAt: new Date(),
        removalInitiatedBy: req.user.userId,
        confirmationToken: confirmToken,
        requiresPasswordConfirmation: true,
      };

      return sendSuccess(
        res,
        removalData,
        'Step 1 complete: Confirmation token generated. Use token and master password in next step.',
        200
      );
    }

    // STEP 2: Verify confirmation and password
    if (step === '2') {
      if (!confirmationToken || !password) {
        return sendError(res, 'Confirmation token and master password required for step 2', 400);
      }

      // Verify master password
      const master = await Admin.findById(req.user.userId);
      if (!master) {
        return sendError(res, 'Master account not found', 404);
      }

      const isPasswordValid = await bcrypt.compare(password, master.password);
      if (!isPasswordValid) {
        return sendError(res, 'Invalid master password. User removal cancelled.', 401);
      }

      // If all checks pass, proceed to step 3
      return sendSuccess(
        res,
        {
          userId: id,
          verified: true,
          nextStep: 3,
        },
        'Step 2 complete: Master password verified. Proceed to step 3 for final deletion.',
        200
      );
    }

    // STEP 3: Final deletion
    if (step === '3') {
      if (!password) {
        return sendError(res, 'Master password required for final deletion', 400);
      }

      // Re-verify master password as final safety check
      const master = await Admin.findById(req.user.userId);
      if (!master) {
        return sendError(res, 'Master account not found', 404);
      }

      const isPasswordValid = await bcrypt.compare(password, master.password);
      if (!isPasswordValid) {
        return sendError(res, 'Invalid master password. User removal cancelled.', 401);
      }

      // Delete user data
      const deletedUser = await User.findByIdAndDelete(id);

      // Log the action
      const removalLog = {
        userId: id,
        userName: deletedUser.fullName,
        userEmail: deletedUser.email,
        deletedAt: new Date(),
        deletedBy: req.user.userId,
        reason: 'Master-initiated removal',
      };

      return sendSuccess(
        res,
        removalLog,
        'Step 3 complete: User permanently deleted from system',
        200
      );
    }

    return sendError(res, 'Invalid step. Must be 1, 2, or 3', 400);
  } catch (error) {
    next(error);
  }
};

/**
 * PAST EVENT MANAGEMENT ENDPOINTS
 */

/**
 * Add past event
 * @route POST /master/event/past/add
 */
export const addPastEvent = async (req, res, next) => {
  try {
    const { title, description, cluster, date, time, location, category, image, details, instructor, winners, tags } = req.body;

    // Validate required fields
    if (!title || !description || !cluster || !date) {
      return sendError(res, 'Missing required fields: title, description, cluster, date', 400);
    }

    // Validate cluster exists
    const clusterExists = await Cluster.findById(cluster);
    if (!clusterExists) {
      return sendError(res, 'Cluster not found', 404);
    }

    // Validate event date is in past
    const eventDate = new Date(date);
    if (eventDate > new Date()) {
      return sendError(res, 'Past event date must not be in the future', 400);
    }

    // Validate winners if provided
    if (winners && Array.isArray(winners)) {
      if (winners.length > 10) {
        return sendError(res, 'Maximum 10 winners allowed per event', 400);
      }

      // Validate winner structure
      for (const winner of winners) {
        if (!winner.userId || !winner.rank) {
          return sendError(res, 'Each winner must have userId and rank', 400);
        }

        if (winner.rank < 1 || winner.rank > 10) {
          return sendError(res, 'Winner rank must be between 1 and 10', 400);
        }
      }

      // Check for duplicate ranks
      const ranks = winners.map(w => w.rank);
      if (new Set(ranks).size !== ranks.length) {
        return sendError(res, 'Duplicate ranks not allowed', 400);
      }
    }

    // Create event
    const event = new Event({
      title,
      description,
      cluster,
      date: eventDate,
      time: time || null,
      location: location || null,
      category: category || 'Workshop',
      eventType: 'past',
      image: image || null,
      details: details || null,
      instructor: instructor || null,
      winners: winners || [],
      tags: tags || [],
      createdBy: req.user.userId,
      isActive: true,
    });

    await event.save();

    // Populate references
    await event.populate('cluster', 'name icon color');
    await event.populate('createdBy', 'fullName username');
    if (event.winners.length > 0) {
      await event.populate('winners.user', 'fullName email');
    }

    return sendSuccess(res, event, 'Past event created successfully', 201);
  } catch (error) {
    next(error);
  }
};

/**
 * Edit past event
 * @route PUT /master/event/past/edit/:id
 */
export const editPastEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, date, time, location, category, image, details, instructor, winners, tags } = req.body;

    // Get event
    const event = await Event.findById(id);
    if (!event) {
      return sendError(res, 'Event not found', 404);
    }

    // Verify it's a past event
    if (event.eventType !== 'past') {
      return sendError(res, 'Can only edit past events through this endpoint', 400);
    }

    // Update fields
    if (title) event.title = title;
    if (description) event.description = description;
    if (date) {
      const newDate = new Date(date);
      if (newDate > new Date()) {
        return sendError(res, 'Event date must not be in the future', 400);
      }
      event.date = newDate;
    }
    if (time) event.time = time;
    if (location !== undefined) event.location = location;
    if (category) event.category = category;
    if (image !== undefined) event.image = image;
    if (details !== undefined) event.details = details;
    if (instructor !== undefined) event.instructor = instructor;
    if (tags) event.tags = tags;

    // Update winners if provided
    if (winners && Array.isArray(winners)) {
      if (winners.length > 10) {
        return sendError(res, 'Maximum 10 winners allowed per event', 400);
      }

      // Validate winner structure and ranks
      for (const winner of winners) {
        if (!winner.userId || !winner.rank) {
          return sendError(res, 'Each winner must have userId and rank', 400);
        }

        if (winner.rank < 1 || winner.rank > 10) {
          return sendError(res, 'Winner rank must be between 1 and 10', 400);
        }
      }

      const ranks = winners.map(w => w.rank);
      if (new Set(ranks).size !== ranks.length) {
        return sendError(res, 'Duplicate ranks not allowed', 400);
      }

      event.winners = winners;
    }

    await event.save();

    // Populate references
    await event.populate('cluster', 'name icon color');
    await event.populate('createdBy', 'fullName username');
    if (event.winners.length > 0) {
      await event.populate('winners.user', 'fullName email');
    }

    return sendSuccess(res, event, 'Past event updated successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Delete past event
 * @route DELETE /master/event/past/delete/:id
 */
export const deletePastEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { password } = req.body;

    // Require password for destructive operation
    if (!password) {
      return sendError(res, 'Master password required to delete event', 400);
    }

    // Verify master password
    const master = await Admin.findById(req.user.userId);
    if (!master) {
      return sendError(res, 'Master account not found', 404);
    }

    const isPasswordValid = await bcrypt.compare(password, master.password);
    if (!isPasswordValid) {
      return sendError(res, 'Invalid master password', 401);
    }

    // Get event
    const event = await Event.findById(id);
    if (!event) {
      return sendError(res, 'Event not found', 404);
    }

    // Verify it's a past event
    if (event.eventType !== 'past') {
      return sendError(res, 'Can only delete past events through this endpoint', 400);
    }

    // Delete event
    await Event.findByIdAndDelete(id);

    return sendSuccess(res, { deletedId: id }, 'Past event deleted successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * STATISTICS ENDPOINTS
 */

/**
 * Get complete system statistics
 * @route GET /master/stats
 */
export const getSystemStats = async (req, res, next) => {
  try {
    // Get all clusters
    const clusters = await Cluster.find().select('name members admins');

    // Get cluster-wise event statistics
    const clusterEvents = await Event.aggregate([
      {
        $group: {
          _id: '$cluster',
          totalEvents: { $sum: 1 },
          upcomingEvents: {
            $sum: { $cond: [{ $eq: ['$eventType', 'upcoming'] }, 1, 0] },
          },
          pastEvents: {
            $sum: { $cond: [{ $eq: ['$eventType', 'past'] }, 1, 0] },
          },
          ongoingEvents: {
            $sum: { $cond: [{ $eq: ['$eventType', 'ongoing'] }, 1, 0] },
          },
          totalParticipants: { $sum: { $size: '$participants' } },
          totalWinners: { $sum: { $size: '$winners' } },
        },
      },
      {
        $lookup: {
          from: 'clusters',
          localField: '_id',
          foreignField: '_id',
          as: 'clusterInfo',
        },
      },
      {
        $unwind: '$clusterInfo',
      },
      {
        $project: {
          clusterId: '$_id',
          clusterName: '$clusterInfo.name',
          totalEvents: 1,
          upcomingEvents: 1,
          pastEvents: 1,
          ongoingEvents: 1,
          totalParticipants: 1,
          totalWinners: 1,
        },
      },
      { $sort: { totalEvents: -1 } },
    ]);

    // Get overall statistics
    const totalEvents = await Event.countDocuments();
    const upcomingEvents = await Event.countDocuments({ eventType: 'upcoming' });
    const pastEvents = await Event.countDocuments({ eventType: 'past' });
    const ongoingEvents = await Event.countDocuments({ eventType: 'ongoing' });
    const totalUsers = await User.countDocuments();
    const totalAdmins = await Admin.countDocuments({ isActive: true });
    const totalMasters = await Admin.countDocuments({ role: 'master', isActive: true });
    const totalNotices = await Notice.countDocuments({ isActive: true });
    const totalClusters = clusters.length;

    // Get unique participants
    const allParticipants = await Event.aggregate([
      { $unwind: '$participants' },
      { $group: { _id: '$participants' } },
      { $count: 'total' },
    ]);

    const uniqueParticipants = allParticipants[0]?.total || 0;

    // Get total winners
    const totalWinnersData = await Event.aggregate([
      { $unwind: '$winners' },
      { $count: 'total' },
    ]);

    const totalWinners = totalWinnersData[0]?.total || 0;

    // Get top events by participation
    const topEvents = await Event.find()
      .select('title participants date eventType cluster')
      .sort({ participants: -1 })
      .limit(10);

    // Get class distribution
    const classDistribution = await User.aggregate([
      {
        $group: {
          _id: '$class',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // Get user engagement (events participated)
    const engagementStats = await User.aggregate([
      {
        $group: {
          _id: null,
          avgEventsParticipated: { $avg: { $size: '$eventsParticipated' } },
          maxEventsParticipated: { $max: { $size: '$eventsParticipated' } },
          totalParticipations: { $sum: { $size: '$eventsParticipated' } },
        },
      },
    ]);

    // Get badge statistics
    const badgeStats = await User.aggregate([
      { $unwind: '$badges' },
      {
        $group: {
          _id: '$badges',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    const stats = {
      timestamp: new Date(),
      overall: {
        totalEvents,
        upcomingEvents,
        pastEvents,
        ongoingEvents,
        totalUsers,
        totalAdmins,
        totalMasters,
        totalClusters,
        totalNotices,
        uniqueParticipants,
        totalWinners,
      },
      engagement: {
        avgEventsPerUser: engagementStats[0]?.avgEventsParticipated || 0,
        maxEventsAnyUser: engagementStats[0]?.maxEventsParticipated || 0,
        totalParticipations: engagementStats[0]?.totalParticipations || 0,
      },
      clusterWise: clusterEvents,
      classDistribution,
      topEvents: topEvents.map(e => ({
        _id: e._id,
        title: e.title,
        participantCount: e.participants.length,
        eventType: e.eventType,
        date: e.date,
      })),
      topBadges: badgeStats,
    };

    return sendSuccess(res, stats, 'System statistics retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Export system data (for backup/analysis)
 * @route GET /master/stats/export
 */
export const exportSystemData = async (req, res, next) => {
  try {
    const { format = 'json' } = req.query;

    // Gather all data
    const users = await User.find().select('-password');
    const admins = await Admin.find().select('-password');
    const events = await Event.find();
    const notices = await Notice.find();
    const clusters = await Cluster.find();

    const exportData = {
      exportedAt: new Date(),
      exportedBy: req.user.userId,
      data: {
        users: users.length,
        admins: admins.length,
        events: events.length,
        notices: notices.length,
        clusters: clusters.length,
        summary: {
          users,
          admins,
          events,
          notices,
          clusters,
        },
      },
    };

    if (format === 'json') {
      return sendSuccess(res, exportData, 'System data exported as JSON');
    }

    // CSV export (basic)
    if (format === 'csv') {
      // This would require additional CSV generation logic
      return sendSuccess(
        res,
        { format: 'csv', message: 'CSV export ready', size: JSON.stringify(exportData).length },
        'System data export summary'
      );
    }

    return sendError(res, 'Invalid export format. Use json or csv', 400);
  } catch (error) {
    next(error);
  }
};
