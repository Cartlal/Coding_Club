import mongoose from 'mongoose';

const noticeSchema = new mongoose.Schema(
  {
    // Basic Information
    title: {
      type: String,
      required: [true, 'Notice title is required'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },

    message: {
      type: String,
      required: [true, 'Notice message is required'],
      maxlength: [3000, 'Message cannot exceed 3000 characters'],
    },

    // Creator Information
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      required: [true, 'Notice creator is required'],
    },

    // Notice Details
    category: {
      type: String,
      enum: ['announcement', 'alert', 'update', 'event', 'deadline', 'other'],
      default: 'announcement',
    },

    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },

    // Content
    image: {
      type: String, // Base64 or URL
      default: null,
    },

    tags: [String], // For categorization and filtering

    // Status
    isActive: {
      type: Boolean,
      default: true,
    },

    isPinned: {
      type: Boolean,
      default: false,
    },

    // Engagement Tracking
    views: {
      type: Number,
      default: 0,
      min: 0,
    },

    viewedBy: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        viewedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // Expiration
    expiresAt: {
      type: Date,
      default: null, // null means no expiration
    },

    // Cluster-specific notices
    cluster: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cluster',
      default: null, // null means visible to all
    },

    // Linked Resources
    relatedEvent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// ===== INDEXES =====
noticeSchema.index({ postedBy: 1 });
noticeSchema.index({ category: 1 });
noticeSchema.index({ priority: 1 });
noticeSchema.index({ isPinned: -1, createdAt: -1 }); // For fetching with pinned first
noticeSchema.index({ isActive: 1 });
noticeSchema.index({ cluster: 1 });
noticeSchema.index({ createdAt: -1 });
noticeSchema.index({ expiresAt: 1 });
noticeSchema.index({ tags: 1 });

// ===== PRE-SAVE MIDDLEWARE =====

/**
 * Remove expired notices automatically
 */
noticeSchema.pre('save', function (next) {
  const now = new Date();

  // Auto-deactivate expired notices
  if (this.expiresAt && this.expiresAt < now && this.isActive) {
    this.isActive = false;
  }

  next();
});

// ===== INSTANCE METHODS =====

/**
 * Record user view
 */
noticeSchema.methods.recordView = function (userId) {
  // Check if user already viewed
  const already = this.viewedBy.some(
    (v) => v.user.toString() === userId.toString()
  );

  if (!already) {
    this.viewedBy.push({
      user: userId,
      viewedAt: new Date(),
    });
    this.views += 1;
  }

  return this;
};

/**
 * Check if notice is expired
 */
noticeSchema.methods.isExpired = function () {
  if (!this.expiresAt) return false;
  return new Date() > this.expiresAt;
};

/**
 * Get viewers count
 */
noticeSchema.methods.getViewerCount = function () {
  return this.viewedBy.length;
};

/**
 * Check if user has viewed notice
 */
noticeSchema.methods.hasUserViewed = function (userId) {
  return this.viewedBy.some(
    (v) => v.user.toString() === userId.toString()
  );
};

/**
 * Get priority color for UI
 */
noticeSchema.methods.getPriorityColor = function () {
  const colors = {
    low: 'green',
    medium: 'yellow',
    high: 'orange',
    urgent: 'red',
  };
  return colors[this.priority] || 'gray';
};

/**
 * Get category icon for UI
 */
noticeSchema.methods.getCategoryIcon = function () {
  const icons = {
    announcement: '📢',
    alert: '🚨',
    update: '🔄',
    event: '🎪',
    deadline: '⏰',
    other: '📌',
  };
  return icons[this.category] || '📌';
};

/**
 * Archive notice (soft delete)
 */
noticeSchema.methods.archive = function () {
  this.isActive = false;
  return this;
};

// ===== VIRTUALS =====

/**
 * Is notice still valid
 */
noticeSchema.virtual('isValid').get(function () {
  return this.isActive && !this.isExpired();
});

/**
 * Time since posted
 */
noticeSchema.virtual('postedSince').get(function () {
  const now = new Date();
  const diff = now - this.createdAt;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} day(s) ago`;
  if (hours > 0) return `${hours} hour(s) ago`;
  if (minutes > 0) return `${minutes} minute(s) ago`;
  return 'just now';
});

/**
 * Engagement percentage (views / total users)
 */
noticeSchema.virtual('engagementPercentage').get(function () {
  // This would need total user count from population
  return this.views;
});

// ===== JSON TRANSFORMATION =====
noticeSchema.methods.toJSON = function () {
  const notice = this.toObject();
  delete notice.__v;
  delete notice.viewedBy; // Don't expose viewer list in JSON
  return notice;
};

// ===== STATICS =====

/**
 * Get active notices (excluding expired)
 */
noticeSchema.statics.getActiveNotices = function (limit = 20) {
  const now = new Date();
  return this.find({
    isActive: true,
    $or: [{ expiresAt: null }, { expiresAt: { $gte: now } }],
  })
    .sort({ isPinned: -1, createdAt: -1 })
    .limit(limit)
    .populate('postedBy', 'fullName')
    .populate('cluster', 'name icon');
};

/**
 * Get pinned notices
 */
noticeSchema.statics.getPinnedNotices = function () {
  const now = new Date();
  return this.find({
    isPinned: true,
    isActive: true,
    $or: [{ expiresAt: null }, { expiresAt: { $gte: now } }],
  })
    .sort({ createdAt: -1 })
    .populate('postedBy', 'fullName')
    .populate('cluster', 'name icon');
};

/**
 * Get notices by category
 */
noticeSchema.statics.getByCategory = function (category, limit = 20) {
  const now = new Date();
  return this.find({
    category,
    isActive: true,
    $or: [{ expiresAt: null }, { expiresAt: { $gte: now } }],
  })
    .sort({ isPinned: -1, createdAt: -1 })
    .limit(limit)
    .populate('postedBy', 'fullName');
};

/**
 * Get cluster-specific notices
 */
noticeSchema.statics.getByCluster = function (clusterId, limit = 20) {
  const now = new Date();
  return this.find({
    cluster: clusterId,
    isActive: true,
    $or: [{ expiresAt: null }, { expiresAt: { $gte: now } }],
  })
    .sort({ isPinned: -1, createdAt: -1 })
    .limit(limit)
    .populate('postedBy', 'fullName');
};

/**
 * Get urgent notices
 */
noticeSchema.statics.getUrgentNotices = function (limit = 10) {
  const now = new Date();
  return this.find({
    priority: 'urgent',
    isActive: true,
    $or: [{ expiresAt: null }, { expiresAt: { $gte: now } }],
  })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('postedBy', 'fullName');
};

/**
 * Search notices
 */
noticeSchema.statics.searchNotices = function (query, limit = 20) {
  const now = new Date();
  return this.find({
    isActive: true,
    $or: [{ expiresAt: null }, { expiresAt: { $gte: now } }],
    $or: [
      { title: { $regex: query, $options: 'i' } },
      { message: { $regex: query, $options: 'i' } },
      { tags: { $in: [new RegExp(query, 'i')] } },
    ],
  })
    .limit(limit)
    .populate('postedBy', 'fullName');
};

/**
 * Get trending notices (most viewed)
 */
noticeSchema.statics.getTrendingNotices = function (limit = 10) {
  const now = new Date();
  return this.find({
    isActive: true,
    $or: [{ expiresAt: null }, { expiresAt: { $gte: now } }],
  })
    .sort({ views: -1, createdAt: -1 })
    .limit(limit)
    .populate('postedBy', 'fullName');
};

const Notice = mongoose.model('Notice', noticeSchema);

export default Notice;
