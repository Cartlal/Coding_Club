import mongoose from 'mongoose';

const clusterSchema = new mongoose.Schema(
  {
    // Basic Information
    name: {
      type: String,
      required: [true, 'Cluster name is required'],
      unique: true,
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },

    description: {
      type: String,
      required: [true, 'Cluster description is required'],
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },

    // Branding
    icon: {
      type: String, // Emoji or icon
      default: '⭐',
    },

    color: {
      type: String, // Hex color or color name
      default: '#3B82F6',
    },

    gradient: {
      type: String, // Tailwind gradient classes
      default: 'from-blue-500 to-blue-600',
    },

    borderColor: {
      type: String, // Border color with opacity
      default: 'border-blue-500/30',
    },

    textColor: {
      type: String, // Text color class
      default: 'text-blue-400',
    },

    // Detailed Information
    foundation: {
      type: String,
      maxlength: [2000, 'Foundation story cannot exceed 2000 characters'],
    },

    focusAreas: [
      {
        type: String,
        maxlength: [100],
      },
    ],

    technologies: [
      {
        type: String,
        maxlength: [100],
      },
    ],

    // Leadership
    lead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      default: null,
    },

    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],

    admins: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
      },
    ],

    // Events & Achievements
    totalEvents: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalMembers: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalPoints: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Status
    isActive: {
      type: Boolean,
      default: true,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    // Statistics
    stats: {
      eventsHeld: {
        type: Number,
        default: 0,
        min: 0,
      },
      totalParticipants: {
        type: Number,
        default: 0,
        min: 0,
      },
      averageParticipation: {
        type: Number,
        default: 0,
      },
    },

    // Contact Information
    email: {
      type: String,
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format'],
    },

    // Social Links
    socialLinks: {
      instagram: String,
      twitter: String,
      github: String,
      linkedin: String,
    },

    // Gallery
    images: [String], // URLs of cluster images/gallery

    // Meta Information
    slug: {
      type: String,
      lowercase: true,
      match: [/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'],
    },

    // Rankings & Leaderboard
    ranking: {
      type: Number,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// ===== INDEXES =====
clusterSchema.index({ name: 1 });
clusterSchema.index({ slug: 1 });
clusterSchema.index({ isActive: 1 });
clusterSchema.index({ isFeatured: 1 });
clusterSchema.index({ 'stats.eventsHeld': -1 });
clusterSchema.index({ totalPoints: -1 }); // For ranking
clusterSchema.index({ createdAt: -1 });

// ===== PRE-SAVE MIDDLEWARE =====
clusterSchema.pre('save', function (next) {
  // Generate slug from name if not provided
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '');
  }

  // Update member and admin counts
  if (this.members) {
    this.totalMembers = this.members.length;
  }

  if (this.admins) {
    // Lead admin is also in admins array
    // totalPoints is sum of all member cluster points
  }

  next();
});

// ===== INSTANCE METHODS =====

/**
 * Add member to cluster
 */
clusterSchema.methods.addMember = function (userId) {
  if (!this.members.includes(userId)) {
    this.members.push(userId);
    this.totalMembers += 1;
  }
  return this;
};

/**
 * Remove member from cluster
 */
clusterSchema.methods.removeMember = function (userId) {
  const initialLength = this.members.length;
  this.members = this.members.filter(
    (id) => id.toString() !== userId.toString()
  );
  if (this.members.length < initialLength) {
    this.totalMembers -= 1;
  }
  return this;
};

/**
 * Add admin to cluster
 */
clusterSchema.methods.addAdmin = function (adminId) {
  if (!this.admins.includes(adminId)) {
    this.admins.push(adminId);
  }
  return this;
};

/**
 * Remove admin from cluster
 */
clusterSchema.methods.removeAdmin = function (adminId) {
  this.admins = this.admins.filter(
    (id) => id.toString() !== adminId.toString()
  );
  return this;
};

/**
 * Add points to cluster
 */
clusterSchema.methods.addPoints = function (points) {
  this.totalPoints += points;
  return this;
};

/**
 * Increment events count
 */
clusterSchema.methods.incrementEventCount = function () {
  this.stats.eventsHeld += 1;
  return this;
};

/**
 * Update total participants
 */
clusterSchema.methods.updateParticipants = function (count) {
  this.stats.totalParticipants += count;
  if (this.stats.eventsHeld > 0) {
    this.stats.averageParticipation = Math.round(
      this.stats.totalParticipants / this.stats.eventsHeld
    );
  }
  return this;
};

/**
 * Get public profile
 */
clusterSchema.methods.getPublicProfile = function () {
  const cluster = this.toObject();
  delete cluster.__v;
  return cluster;
};

// ===== VIRTUALS =====

/**
 * Is cluster fully functional
 */
clusterSchema.virtual('isSetup').get(function () {
  return (
    this.name &&
    this.description &&
    this.lead &&
    this.totalMembers > 0
  );
});

/**
 * Engagement score
 */
clusterSchema.virtual('engagementScore').get(function () {
  if (this.stats.eventsHeld === 0) return 0;
  return Math.round(
    (this.stats.totalParticipants / (this.totalMembers * this.stats.eventsHeld)) * 100
  );
});

/**
 * Health status
 */
clusterSchema.virtual('healthStatus').get(function () {
  const score = this.engagementScore;
  if (score >= 80) return 'excellent';
  if (score >= 60) return 'good';
  if (score >= 40) return 'fair';
  return 'needs-improvement';
});

// ===== JSON TRANSFORMATION =====
clusterSchema.methods.toJSON = function () {
  const cluster = this.toObject();
  delete cluster.__v;
  return cluster;
};

// ===== STATICS =====

/**
 * Get all active clusters
 */
clusterSchema.statics.getActiveClusters = function () {
  return this.find({ isActive: true })
    .sort({ isFeatured: -1, totalPoints: -1 })
    .populate('lead', 'fullName username');
};

/**
 * Get featured clusters
 */
clusterSchema.statics.getFeaturedClusters = function () {
  return this.find({ isFeatured: true, isActive: true })
    .populate('lead', 'fullName username');
};

/**
 * Get cluster by slug
 */
clusterSchema.statics.getBySlug = function (slug) {
  return this.findOne({ slug, isActive: true })
    .populate('lead', 'fullName username email')
    .populate('members', 'fullName email class');
};

/**
 * Get cluster leaderboard (ranked by points)
 */
clusterSchema.statics.getLeaderboard = function (limit = 10) {
  return this.find({ isActive: true })
    .sort({ totalPoints: -1 })
    .limit(limit)
    .populate('lead', 'fullName username');
};

/**
 * Get top performing clusters (by event count)
 */
clusterSchema.statics.getTopPerformers = function (limit = 5) {
  return this.find({ isActive: true })
    .sort({ 'stats.eventsHeld': -1 })
    .limit(limit)
    .populate('lead', 'fullName username');
};

/**
 * Get most active clusters (by participant count)
 */
clusterSchema.statics.getMostActive = function (limit = 5) {
  return this.find({ isActive: true })
    .sort({ 'stats.totalParticipants': -1 })
    .limit(limit)
    .populate('lead', 'fullName username');
};

/**
 * Search clusters
 */
clusterSchema.statics.searchClusters = function (query, limit = 20) {
  return this.find({
    isActive: true,
    $or: [
      { name: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } },
      { focusAreas: { $in: [new RegExp(query, 'i')] } },
      { technologies: { $in: [new RegExp(query, 'i')] } },
    ],
  })
    .limit(limit)
    .populate('lead', 'fullName username');
};

const Cluster = mongoose.model('Cluster', clusterSchema);

export default Cluster;
