import Admin from '../models/Admin.js';
import Event from '../models/Event.js';
import Notice from '../models/Notice.js';
import Cluster from '../models/Cluster.js';
import User from '../models/User.js';
import { sendSuccess, sendError } from '../utils/response.js';

/**
 * EVENT MANAGEMENT ENDPOINTS
 */

/**
 * Add new event (upcoming only)
 * @route POST /admin/event/add
 */
export const addEvent = async (req, res, next) => {
  try {
    const adminId = req.user.userId;
    const { title, description, cluster, date, time, location, category, image, details, instructor, capacity, registrationDeadline, requirements, tags } = req.body;

    // Verify admin exists and get their cluster
    const admin = await Admin.findById(adminId).select('cluster isActive');
    if (!admin || !admin.isActive) {
      return sendError(res, 'Admin not found or inactive', 404);
    }

    // Validate cluster
    let clusterToUse = cluster || admin.cluster;
    const clusterExists = await Cluster.findById(clusterToUse);
    if (!clusterExists) {
      return sendError(res, 'Cluster not found', 404);
    }

    // Validate event date is in future
    const eventDate = new Date(date);
    if (eventDate <= new Date()) {
      return sendError(res, 'Event date must be in the future for upcoming events', 400);
    }

    // Create event
    const event = new Event({
      title,
      description,
      cluster: clusterToUse,
      date: eventDate,
      time,
      location,
      category: category || 'Workshop',
      eventType: 'upcoming',
      image: image || null,
      details,
      instructor,
      capacity: capacity ? parseInt(capacity) : null,
      registrationDeadline: registrationDeadline ? new Date(registrationDeadline) : null,
      requirements: requirements || [],
      tags: tags || [],
      createdBy: adminId,
    });

    await event.save();

    // Populate references
    await event.populate('cluster', 'name icon color');
    await event.populate('createdBy', 'fullName username');

    return sendSuccess(res, event, 'Event created successfully', 201);
  } catch (error) {
    next(error);
  }
};

/**
 * Edit event (upcoming only)
 * @route PUT /admin/event/edit/:id
 */
export const editEvent = async (req, res, next) => {
  try {
    const adminId = req.user.userId;
    const { id } = req.params;
    const { title, description, date, time, location, category, image, details, instructor, capacity, registrationDeadline, requirements, tags } = req.body;

    // Get event
    const event = await Event.findById(id);
    if (!event) {
      return sendError(res, 'Event not found', 404);
    }

    // Check if event is upcoming
    if (event.eventType !== 'upcoming') {
      return sendError(res, 'Can only edit upcoming events', 400);
    }

    // Check admin permission (created by admin or admin's cluster)
    const admin = await Admin.findById(adminId).select('cluster');
    if (!admin) {
      return sendError(res, 'Admin not found', 404);
    }

    if (event.createdBy.toString() !== adminId && event.cluster.toString() !== admin.cluster.toString()) {
      return sendError(res, 'You can only edit events you created or in your cluster', 403);
    }

    // Validate new date if provided
    if (date) {
      const newDate = new Date(date);
      if (newDate <= new Date()) {
        return sendError(res, 'Event date must be in the future', 400);
      }
      event.date = newDate;
    }

    // Update fields
    if (title) event.title = title;
    if (description) event.description = description;
    if (time) event.time = time;
    if (location) event.location = location;
    if (category) event.category = category;
    if (image !== undefined) event.image = image;
    if (details) event.details = details;
    if (instructor) event.instructor = instructor;
    if (capacity !== undefined) event.capacity = capacity ? parseInt(capacity) : null;
    if (registrationDeadline) event.registrationDeadline = new Date(registrationDeadline);
    if (requirements) event.requirements = requirements;
    if (tags) event.tags = tags;

    await event.save();

    // Populate references
    await event.populate('cluster', 'name icon color');
    await event.populate('createdBy', 'fullName username');

    return sendSuccess(res, event, 'Event updated successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Delete event (upcoming only)
 * @route DELETE /admin/event/delete/:id
 */
export const deleteEvent = async (req, res, next) => {
  try {
    const adminId = req.user.userId;
    const { id } = req.params;

    // Get event
    const event = await Event.findById(id);
    if (!event) {
      return sendError(res, 'Event not found', 404);
    }

    // Check if event is upcoming
    if (event.eventType !== 'upcoming') {
      return sendError(res, 'Can only delete upcoming events', 400);
    }

    // Check admin permission
    const admin = await Admin.findById(adminId).select('cluster');
    if (!admin) {
      return sendError(res, 'Admin not found', 404);
    }

    if (event.createdBy.toString() !== adminId && event.cluster.toString() !== admin.cluster.toString()) {
      return sendError(res, 'You can only delete events you created or in your cluster', 403);
    }

    await Event.findByIdAndDelete(id);

    return sendSuccess(res, { deletedId: id }, 'Event deleted successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get all participants of an event
 * @route GET /admin/event/:id/participants
 */
export const getEventParticipants = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { limit = 50, page = 1 } = req.query;

    // Get event with populated participants
    const event = await Event.findById(id)
      .populate({
        path: 'participants',
        select: 'fullName email class stats profilePic srn badges',
        options: {
          limit: parseInt(limit),
          skip: (parseInt(page) - 1) * parseInt(limit),
        },
      })
      .select('title participants capacity');

    if (!event) {
      return sendError(res, 'Event not found', 404);
    }

    // Get total count
    const totalParticipants = event.participants.length;

    const participantsData = {
      event: {
        _id: event._id,
        title: event.title,
        capacity: event.capacity,
      },
      participants: event.participants,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalParticipants / parseInt(limit)),
        totalParticipants,
        limit: parseInt(limit),
      },
    };

    return sendSuccess(res, participantsData, 'Event participants retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Declare winners with rankings
 * @route POST /admin/event/:id/winners
 */
export const declareWinners = async (req, res, next) => {
  try {
    const adminId = req.user.userId;
    const { id } = req.params;
    const { winners } = req.body; // Array of { userId, rank, prize, pointsAwarded }

    // Validate input
    if (!Array.isArray(winners) || winners.length === 0) {
      return sendError(res, 'Winners array is required', 400);
    }

    if (winners.length > 10) {
      return sendError(res, 'Maximum 10 winners can be declared', 400);
    }

    // Get event
    const event = await Event.findById(id);
    if (!event) {
      return sendError(res, 'Event not found', 404);
    }

    // Check admin permission
    const admin = await Admin.findById(adminId).select('cluster');
    if (!admin) {
      return sendError(res, 'Admin not found', 404);
    }

    if (event.createdBy.toString() !== adminId && event.cluster.toString() !== admin.cluster.toString()) {
      return sendError(res, 'You can only manage winners for events you created or in your cluster', 403);
    }

    // Validate all winners are participants
    const participantIds = event.participants.map(p => p.toString());
    for (const winner of winners) {
      if (!participantIds.includes(winner.userId)) {
        return sendError(res, `User ${winner.userId} is not a participant in this event`, 400);
      }
      if (!winner.rank || winner.rank < 1 || winner.rank > 10) {
        return sendError(res, 'Rank must be between 1 and 10', 400);
      }
    }

    // Check for duplicate ranks
    const ranks = winners.map(w => w.rank);
    if (new Set(ranks).size !== ranks.length) {
      return sendError(res, 'Duplicate ranks are not allowed', 400);
    }

    // Clear existing winners and add new ones
    event.winners = winners.map(w => ({
      user: w.userId,
      rank: w.rank,
      prize: w.prize || null,
      pointsAwarded: w.pointsAwarded || 0,
    }));

    // Update event to past if not already
    if (event.eventType === 'upcoming' || event.eventType === 'ongoing') {
      event.eventType = 'past';
    }

    await event.save();

    // Update user stats for each winner
    for (const winner of winners) {
      await User.findByIdAndUpdate(
        winner.userId,
        {
          $inc: { 'stats.wins': 1, 'stats.clusterPoints': winner.pointsAwarded || 0 },
        },
        { new: true }
      );
    }

    // Populate winners
    await event.populate('winners.user', 'fullName email');
    await event.populate('cluster', 'name');

    return sendSuccess(res, event, 'Winners declared successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Manually add participants to event
 * @route POST /admin/event/:id/participants/add
 */
export const addParticipants = async (req, res, next) => {
  try {
    const adminId = req.user.userId;
    const { id } = req.params;
    const { userIds } = req.body; // Array of user IDs to add

    // Validate input
    if (!Array.isArray(userIds) || userIds.length === 0) {
      return sendError(res, 'User IDs array is required', 400);
    }

    // Get event
    const event = await Event.findById(id);
    if (!event) {
      return sendError(res, 'Event not found', 404);
    }

    // Check if event is upcoming
    if (event.eventType !== 'upcoming') {
      return sendError(res, 'Can only add participants to upcoming events', 400);
    }

    // Check admin permission
    const admin = await Admin.findById(adminId).select('cluster');
    if (!admin) {
      return sendError(res, 'Admin not found', 404);
    }

    if (event.createdBy.toString() !== adminId && event.cluster.toString() !== admin.cluster.toString()) {
      return sendError(res, 'You can only manage participants for events you created or in your cluster', 403);
    }

    // Check capacity
    const newCount = event.participants.length + userIds.length;
    if (event.capacity && newCount > event.capacity) {
      return sendError(res, `Adding ${userIds.length} participants would exceed capacity of ${event.capacity}`, 400);
    }

    // Verify all users exist
    const users = await User.find({ _id: { $in: userIds } });
    if (users.length !== userIds.length) {
      return sendError(res, 'Some user IDs do not exist', 400);
    }

    // Add participants (avoiding duplicates)
    const currentParticipants = event.participants.map(p => p.toString());
    const newParticipants = userIds.filter(uid => !currentParticipants.includes(uid));

    if (newParticipants.length === 0) {
      return sendError(res, 'All users are already registered for this event', 409);
    }

    event.participants.push(...newParticipants);
    await event.save();

    // Update user stats
    for (const userId of newParticipants) {
      await User.findByIdAndUpdate(
        userId,
        {
          $push: { eventsParticipated: id },
          $inc: { 'stats.participation': 1 },
        },
        { new: true }
      );
    }

    // Populate for response
    await event.populate('participants', 'fullName email class');
    await event.populate('cluster', 'name');

    return sendSuccess(
      res,
      {
        event: event._id,
        addedCount: newParticipants.length,
        totalParticipants: event.participants.length,
      },
      'Participants added successfully'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * NOTICE BOARD ENDPOINTS
 */

/**
 * Add notice
 * @route POST /admin/notice/add
 */
export const addNotice = async (req, res, next) => {
  try {
    const adminId = req.user.userId;
    const { title, message, category, priority, image, tags, cluster, expiresAt, relatedEvent, isPinned } = req.body;

    // Verify admin
    const admin = await Admin.findById(adminId).select('cluster isActive');
    if (!admin || !admin.isActive) {
      return sendError(res, 'Admin not found or inactive', 404);
    }

    // Create notice
    const notice = new Notice({
      title,
      message,
      postedBy: adminId,
      category: category || 'announcement',
      priority: priority || 'medium',
      image: image || null,
      tags: tags || [],
      cluster: cluster || null, // null means visible to all
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      relatedEvent: relatedEvent || null,
      isPinned: isPinned || false,
    });

    await notice.save();

    // Populate references
    await notice.populate('postedBy', 'fullName username');
    if (cluster) {
      await notice.populate('cluster', 'name');
    }
    if (relatedEvent) {
      await notice.populate('relatedEvent', 'title');
    }

    return sendSuccess(res, notice, 'Notice created successfully', 201);
  } catch (error) {
    next(error);
  }
};

/**
 * Get all notices
 * @route GET /admin/notice/all
 */
export const getAllNotices = async (req, res, next) => {
  try {
    const { limit = 20, page = 1, category, priority, cluster } = req.query;

    // Build filter
    const filter = { isActive: true };

    if (category) filter.category = category;
    if (priority) filter.priority = priority;
    if (cluster) filter.cluster = cluster;

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get notices
    const notices = await Notice.find(filter)
      .select('-viewedBy') // Exclude detailed view tracking for list
      .populate('postedBy', 'fullName username')
      .populate('cluster', 'name')
      .populate('relatedEvent', 'title')
      .sort({ isPinned: -1, createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    // Get total count
    const totalNotices = await Notice.countDocuments(filter);

    const noticesData = {
      notices,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalNotices / parseInt(limit)),
        totalNotices,
        limit: parseInt(limit),
      },
    };

    return sendSuccess(res, noticesData, 'Notices retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Edit notice
 * @route PUT /admin/notice/edit/:id
 */
export const editNotice = async (req, res, next) => {
  try {
    const adminId = req.user.userId;
    const { id } = req.params;
    const { title, message, category, priority, image, tags, isPinned, expiresAt } = req.body;

    // Get notice
    const notice = await Notice.findById(id);
    if (!notice) {
      return sendError(res, 'Notice not found', 404);
    }

    // Check if posted by admin or admin is master
    if (notice.postedBy.toString() !== adminId && req.user.role !== 'master') {
      return sendError(res, 'You can only edit notices you posted', 403);
    }

    // Update fields
    if (title) notice.title = title;
    if (message) notice.message = message;
    if (category) notice.category = category;
    if (priority) notice.priority = priority;
    if (image !== undefined) notice.image = image;
    if (tags) notice.tags = tags;
    if (isPinned !== undefined) notice.isPinned = isPinned;
    if (expiresAt) notice.expiresAt = new Date(expiresAt);

    await notice.save();

    // Populate references
    await notice.populate('postedBy', 'fullName username');
    if (notice.cluster) {
      await notice.populate('cluster', 'name');
    }

    return sendSuccess(res, notice, 'Notice updated successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Delete notice
 * @route DELETE /admin/notice/delete/:id
 */
export const deleteNotice = async (req, res, next) => {
  try {
    const adminId = req.user.userId;
    const { id } = req.params;

    // Get notice
    const notice = await Notice.findById(id);
    if (!notice) {
      return sendError(res, 'Notice not found', 404);
    }

    // Check if posted by admin or admin is master
    if (notice.postedBy.toString() !== adminId && req.user.role !== 'master') {
      return sendError(res, 'You can only delete notices you posted', 403);
    }

    await Notice.findByIdAndDelete(id);

    return sendSuccess(res, { deletedId: id }, 'Notice deleted successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * STATISTICS ENDPOINTS
 */

/**
 * Get statistics (Cluster-wise and total)
 * @route GET /admin/stats
 */
export const getAdminStats = async (req, res, next) => {
  try {
    const adminId = req.user.userId;

    // Get admin's cluster
    const admin = await Admin.findById(adminId).select('cluster role');
    if (!admin) {
      return sendError(res, 'Admin not found', 404);
    }

    let clusterFilter = {};
    let adminStats = {};

    // If regular admin, show only their cluster stats
    // If master, show all stats
    if (admin.role === 'admin') {
      clusterFilter = { cluster: admin.cluster };
      adminStats.userCluster = admin.cluster;
    }

    // Get all clusters for comparison
    const allClusters = await Cluster.find().select('name members');

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
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalNotices = await Notice.countDocuments({ isActive: true });

    // Get unique participants across all events
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

    // Get admin count
    const totalAdmins = await Admin.countDocuments({ isActive: true });

    const stats = {
      overall: {
        totalEvents,
        upcomingEvents,
        pastEvents,
        totalUsers,
        totalAdmins,
        totalNotices,
        uniqueParticipants,
        totalWinners,
      },
      clusterWise: clusterEvents,
      adminScope: admin.role === 'admin' ? 'cluster' : 'all',
    };

    return sendSuccess(res, stats, 'Statistics retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get detailed cluster statistics
 * @route GET /admin/stats/cluster/:clusterId
 */
export const getClusterStats = async (req, res, next) => {
  try {
    const adminId = req.user.userId;
    const { clusterId } = req.params;

    // Verify admin access to cluster
    const admin = await Admin.findById(adminId).select('cluster role');
    if (!admin) {
      return sendError(res, 'Admin not found', 404);
    }

    if (admin.role === 'admin' && admin.cluster.toString() !== clusterId) {
      return sendError(res, 'You can only view stats for your cluster', 403);
    }

    // Get cluster info
    const cluster = await Cluster.findById(clusterId).select('name members');
    if (!cluster) {
      return sendError(res, 'Cluster not found', 404);
    }

    // Get events for this cluster
    const events = await Event.find({ cluster: clusterId });
    const totalEvents = events.length;
    const upcomingEvents = events.filter(e => e.eventType === 'upcoming').length;
    const pastEvents = events.filter(e => e.eventType === 'past').length;

    // Get participants and winners
    const allParticipants = new Set();
    let totalWinners = 0;

    events.forEach(event => {
      event.participants.forEach(p => allParticipants.add(p.toString()));
      totalWinners += event.winners.length;
    });

    // Get top events by participation
    const topEvents = await Event.find({ cluster: clusterId })
      .select('title participants date eventType')
      .sort({ participants: -1 })
      .limit(5);

    const clusterStats = {
      cluster: {
        _id: cluster._id,
        name: cluster.name,
        memberCount: cluster.members?.length || 0,
      },
      events: {
        total: totalEvents,
        upcoming: upcomingEvents,
        past: pastEvents,
      },
      participants: {
        unique: allParticipants.size,
      },
      winners: totalWinners,
      topEvents: topEvents.map(e => ({
        _id: e._id,
        title: e.title,
        participants: e.participants.length,
        eventType: e.eventType,
        date: e.date,
      })),
    };

    return sendSuccess(res, clusterStats, 'Cluster statistics retrieved successfully');
  } catch (error) {
    next(error);
  }
};
