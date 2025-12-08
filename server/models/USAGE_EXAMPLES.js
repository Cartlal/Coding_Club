/**
 * Models Initialization & Testing Guide
 * Quick reference for model usage and testing
 */

import {
  User,
  Admin,
  Event,
  Notice,
  Cluster,
} from './models/index.js';

// ===== USER MODEL EXAMPLES =====

/**
 * Create a new user
 */
export async function createUser() {
  const user = new User({
    fullName: 'Aditya Sharma',
    email: 'aditya@example.com',
    password: 'password123', // Auto-hashed on save
    srn: 'ARK001',
    profilePic: null, // Can be Base64 image
    class: {
      year: '3rd Year',
      branch: 'CSE',
      division: 'A',
    },
    bio: 'Passionate about full-stack development',
  });

  await user.save();
  console.log('User created:', user.toJSON());
  return user;
}

/**
 * Login user
 */
export async function loginUser(email, password) {
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    throw new Error('User not found');
  }

  const isPasswordValid = await user.matchPassword(password);
  if (!isPasswordValid) {
    throw new Error('Invalid password');
  }

  user.updateLastLogin();
  await user.save();

  return user.toJSON();
}

/**
 * Add badge to user
 */
export async function addBadgeToUser(userId, badge) {
  const user = await User.findById(userId);
  user.addBadge(badge); // Validates badge exists
  user.stats.wins += 1;
  await user.save();
  return user;
}

/**
 * Add cluster points
 */
export async function addPointsToUser(userId, points) {
  const user = await User.findById(userId);
  user.addClusterPoints(points);
  await user.save();
  return user;
}

/**
 * Get leaderboard
 */
export async function getLeaderboard() {
  const leaderboard = await User.getLeaderboard(100);
  return leaderboard.map((user, index) => ({
    rank: index + 1,
    ...user.toJSON(),
  }));
}

/**
 * Join cluster
 */
export async function joinCluster(userId, clusterId) {
  const user = await User.findById(userId);
  user.cluster = clusterId;
  await user.save();

  // Add to cluster members
  const cluster = await Cluster.findById(clusterId);
  cluster.addMember(userId);
  await cluster.save();

  return user;
}

// ===== ADMIN MODEL EXAMPLES =====

/**
 * Create admin
 */
export async function createAdmin(createdBy) {
  const admin = new Admin({
    fullName: 'John Admin',
    username: 'johnadmin',
    email: 'john.admin@example.com',
    password: 'admin123',
    cluster: 'cluster_id_here',
    role: 'admin',
    createdBy: createdBy, // Master admin ID
  });

  await admin.save();
  return admin.toJSON();
}

/**
 * Log admin activity
 */
export async function logAdminActivity(adminId, action, details) {
  const admin = await Admin.findById(adminId);
  admin.logActivity(action, details);
  await admin.save();
}

/**
 * Check admin permission
 */
export async function checkPermission(adminId, permission) {
  const admin = await Admin.findById(adminId);
  return admin.hasPermission(permission);
  // Usage: hasPermission('manageEvents'), hasPermission('manageAdmins'), etc.
}

// ===== EVENT MODEL EXAMPLES =====

/**
 * Create event
 */
export async function createEvent(clusterId, createdById) {
  const event = new Event({
    title: 'Hackathon 2025',
    description: '24-hour coding marathon with amazing prizes',
    cluster: clusterId,
    eventType: 'upcoming',
    date: new Date('2025-12-20'),
    time: {
      start: '09:00',
      end: '09:00', // 24 hours later
    },
    location: 'Convention Center, KLE Campus',
    category: 'Hackathon',
    createdBy: createdById,
    capacity: 150,
    image: null,
  });

  await event.save();
  return event;
}

/**
 * Register user for event
 */
export async function registerForEvent(userId, eventId) {
  const event = await Event.findById(eventId);

  if (event.isFull) {
    throw new Error('Event is at full capacity');
  }

  event.addParticipant(userId);

  // Update user's participated events
  const user = await User.findById(userId);
  user.eventsParticipated.push(eventId);
  user.stats.participation += 1;

  await event.save();
  await user.save();

  return event;
}

/**
 * Mark event winner
 */
export async function markWinner(eventId, userId, rank, prize, points) {
  const event = await Event.findById(eventId);

  event.addWinner(userId, rank, prize, points);

  // Add badge and points to user
  const user = await User.findById(userId);
  const badges = ['🏆', '🥇', '🥈', '🥉'];
  if (rank <= badges.length) {
    user.addBadge(badges[rank - 1]);
  }
  user.addClusterPoints(points);
  user.stats.wins += 1;

  await event.save();
  await user.save();

  return event;
}

/**
 * Get upcoming events
 */
export async function getUpcomingEvents() {
  return await Event.getUpcomingEvents(10);
}

/**
 * Get events by cluster
 */
export async function getEventsByCluster(clusterId) {
  return await Event.getByCluster(clusterId, 20);
}

// ===== NOTICE MODEL EXAMPLES =====

/**
 * Create notice
 */
export async function createNotice(postedById) {
  const notice = new Notice({
    title: 'Important: Registration Deadline',
    message: 'Please register for Hackathon before December 15',
    postedBy: postedById,
    category: 'deadline',
    priority: 'high',
    isPinned: true,
    expiresAt: new Date('2025-12-16'),
    tags: ['hackathon', 'registration', 'deadline'],
  });

  await notice.save();
  return notice;
}

/**
 * Record notice view
 */
export async function viewNotice(noticeId, userId) {
  const notice = await Notice.findById(noticeId);
  notice.recordView(userId);
  await notice.save();
  return notice;
}

/**
 * Get active notices
 */
export async function getActiveNotices() {
  return await Notice.getActiveNotices(20);
}

/**
 * Get pinned notices
 */
export async function getPinnedNotices() {
  return await Notice.getPinnedNotices();
}

/**
 * Get urgent notices
 */
export async function getUrgentNotices() {
  return await Notice.getUrgentNotices(10);
}

/**
 * Archive notice
 */
export async function archiveNotice(noticeId) {
  const notice = await Notice.findById(noticeId);
  notice.archive();
  await notice.save();
  return notice;
}

// ===== CLUSTER MODEL EXAMPLES =====

/**
 * Create cluster
 */
export async function createCluster(leadAdminId) {
  const cluster = new Cluster({
    name: 'Development',
    description: 'The engine room of innovation. Build robust, scalable applications.',
    icon: '💻',
    color: '#06B6D4',
    gradient: 'from-cyan-500 to-blue-600',
    borderColor: 'border-cyan-500/30',
    textColor: 'text-cyan-400',
    slug: 'development',
    lead: leadAdminId,
    foundation: 'Founded on the belief that software has the power to transform lives.',
    focusAreas: [
      'Full Stack Web Development',
      'App Development',
      'System Architecture',
      'DevOps',
    ],
    technologies: ['React', 'Node.js', 'Flutter', 'Docker', 'AWS'],
  });

  await cluster.save();
  return cluster;
}

/**
 * Get cluster by slug
 */
export async function getClusterBySlug(slug) {
  return await Cluster.getBySlug(slug);
}

/**
 * Get cluster leaderboard
 */
export async function getClusterLeaderboard() {
  return await Cluster.getLeaderboard(10);
}

/**
 * Add member to cluster
 */
export async function addMemberToCluster(clusterId, userId) {
  const cluster = await Cluster.findById(clusterId);
  cluster.addMember(userId);
  await cluster.save();

  // Update user
  const user = await User.findById(userId);
  user.cluster = clusterId;
  await user.save();

  return cluster;
}

/**
 * Update cluster points
 */
export async function updateClusterPoints(clusterId, points) {
  const cluster = await Cluster.findById(clusterId);
  cluster.addPoints(points);
  await cluster.save();
  return cluster;
}

/**
 * Get active clusters
 */
export async function getActiveClusters() {
  return await Cluster.getActiveClusters();
}

/**
 * Get cluster health status
 */
export async function getClusterHealth(clusterId) {
  const cluster = await Cluster.findById(clusterId);
  return {
    name: cluster.name,
    members: cluster.totalMembers,
    events: cluster.stats.eventsHeld,
    points: cluster.totalPoints,
    engagement: cluster.engagementScore + '%',
    health: cluster.healthStatus,
  };
}

// ===== COMPLEX OPERATIONS =====

/**
 * Complete event flow
 */
export async function completeEventFlow() {
  // 1. Create cluster
  const cluster = await createCluster('admin_id');

  // 2. Create admin for cluster
  const admin = await createAdmin('master_admin_id');

  // 3. Create event
  const event = await createEvent(cluster._id, admin._id);

  // 4. Register users
  const user1 = await createUser();
  const user2 = await createUser();

  await registerForEvent(user1._id, event._id);
  await registerForEvent(user2._id, event._id);

  // 5. Post notice about event
  const notice = await createNotice(admin._id);
  notice.relatedEvent = event._id;
  await notice.save();

  // 6. Mark winners
  await markWinner(event._id, user1._id, 1, '₹5000', 100);
  await markWinner(event._id, user2._id, 2, '₹3000', 75);

  return { cluster, event, users: [user1, user2] };
}

/**
 * Get user dashboard data
 */
export async function getUserDashboard(userId) {
  const user = await User.findById(userId)
    .populate('cluster', 'name icon')
    .populate('eventsParticipated', 'title date cluster');

  const userRank = await User.countDocuments({
    'stats.clusterPoints': { $gt: user.stats.clusterPoints },
    role: 'user',
  });

  return {
    profile: user.toJSON(),
    rank: userRank + 1,
    badges: user.badges,
    stats: {
      ...user.stats.toObject(),
      totalEvents: user.eventsParticipated.length,
    },
  };
}

/**
 * Get admin dashboard data
 */
export async function getAdminDashboard(adminId) {
  const admin = await Admin.findById(adminId)
    .populate('cluster', 'name totalMembers totalPoints');

  const events = await Event.find({ createdBy: adminId });
  const notices = await Notice.find({ postedBy: adminId });
  const cluster = admin.cluster;

  return {
    admin: admin.toJSON(),
    cluster: cluster.toJSON(),
    stats: {
      eventsCreated: events.length,
      noticesPosted: notices.length,
      clusterMembers: cluster.totalMembers,
      clusterPoints: cluster.totalPoints,
      activitiesLogged: admin.activityLog.length,
    },
    recentActivity: admin.activityLog.slice(-10),
  };
}

/**
 * Global statistics
 */
export async function getGlobalStatistics() {
  const totalUsers = await User.countDocuments({ role: 'user' });
  const totalAdmins = await Admin.countDocuments();
  const totalEvents = await Event.countDocuments();
  const totalNotices = await Notice.countDocuments();
  const totalClusters = await Cluster.countDocuments();

  const topUsers = await User.getLeaderboard(5);
  const topClusters = await Cluster.getLeaderboard(5);

  return {
    users: totalUsers,
    admins: totalAdmins,
    events: totalEvents,
    notices: totalNotices,
    clusters: totalClusters,
    topUsers,
    topClusters,
  };
}

// ===== EXPORT FOR USE IN CONTROLLERS =====
export default {
  createUser,
  loginUser,
  addBadgeToUser,
  addPointsToUser,
  getLeaderboard,
  joinCluster,
  createAdmin,
  logAdminActivity,
  checkPermission,
  createEvent,
  registerForEvent,
  markWinner,
  getUpcomingEvents,
  getEventsByCluster,
  createNotice,
  viewNotice,
  getActiveNotices,
  getPinnedNotices,
  getUrgentNotices,
  archiveNotice,
  createCluster,
  getClusterBySlug,
  getClusterLeaderboard,
  addMemberToCluster,
  updateClusterPoints,
  getActiveClusters,
  getClusterHealth,
  completeEventFlow,
  getUserDashboard,
  getAdminDashboard,
  getGlobalStatistics,
};
