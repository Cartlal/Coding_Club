import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';

/**
 * Badge System (25 badges)
 * Achievements and recognition badges
 */
const BADGE_SYSTEM = {
  '🛠️': 'Workshop Wanderer',
  '🎫': 'Event Explorer',
  '💻': 'Development Challenger',
  '🤖': 'AI/ML Challenger',
  '🔮': 'Emerging Tech Explorer',
  '⚔️': 'Compete Commander',
  '⌨️': 'Programming Prodigy',
  '🎨': 'Creative Visionary',
  '📢': 'PR Ambassador',
  '🎮': 'Game Master',
  '🔟': 'Top 10 Performer',
  '🥉': 'Top 3 Elite',
  '🏆': 'Consistency Champion',
  '👑': 'ArcStack Legendary',
};

const userSchema = new mongoose.Schema(
  {
    // Basic Information
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format'],
    },

    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Don't return password by default
    },

    profilePic: {
      type: String, // Base64 encoded image
      default: null,
    },

    // Student Information
    srn: {
      type: String,
      required: [true, 'SRN is required'],
      unique: true,
      uppercase: true,
      match: [/^[A-Z0-9]{5,}$/, 'Invalid SRN format'],
    },

    class: {
      year: {
        type: String,
        enum: ['1st Year', '2nd Year', '3rd Year', '4th Year'],
        required: [true, 'Year is required'],
      },
      branch: {
        type: String,
        enum: ['CSE', 'ECE', 'Mechanical', 'Civil', 'EEE', 'BME', 'Chemical', 'BCA', 'ISE'],
        required: [true, 'Branch is required'],
      },
      division: {
        type: String,
        uppercase: true,
        match: [/^[A-Z]$/, 'Division must be a single uppercase letter'],
        required: [true, 'Division is required'],
      },
    },

    // Account Settings
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters'],
      default: '',
    },

    links: {
      github: {
        type: String,
        default: '',
        match: [/^(https?:\/\/)?(www\.)?github\.com\//, 'Invalid GitHub URL'],
      },
      portfolio: {
        type: String,
        default: '',
        match: [/^(https?:\/\/)?.+\..+/, 'Invalid URL'],
      },
      linkedin: {
        type: String,
        default: '',
        match: [/^(https?:\/\/)?(www\.)?linkedin\.com\//, 'Invalid LinkedIn URL'],
      },
      instagram: {
        type: String,
        default: '',
        match: [/^(https?:\/\/)?(www\.)?instagram\.com\//, 'Invalid Instagram URL'],
      },
      custom: [
        {
          label: {
            type: String,
            maxlength: [50, 'Label cannot exceed 50 characters'],
          },
          url: {
            type: String,
            match: [/^(https?:\/\/).+/, 'URL must start with http:// or https://'],
          },
        },
      ],
    },

    // Club Information
    cluster: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cluster',
      default: null,
    },

    eventsParticipated: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
      },
    ],

    // Achievements & Badges
    achievements: {
      type: [String],
      default: [],
    },

    badges: {
      type: [String],
      default: [],
      validate: {
        validator: function (badges) {
          return badges.length <= 14;
        },
        message: 'Maximum 14 badges allowed',
      },
    },

    // Stats
    stats: {
      wins: {
        type: Number,
        default: 0,
        min: 0,
      },
      participation: {
        type: Number,
        default: 0,
        min: 0,
      },
      clusterPoints: {
        type: Number,
        default: 0,
        min: 0,
      },
    },

    // Account Management
    role: {
      type: String,
      enum: ['user', 'admin', 'moderator'],
      default: 'user',
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// ===== INDEXES =====
userSchema.index({ email: 1 });
userSchema.index({ srn: 1 });
userSchema.index({ 'class.branch': 1 });
userSchema.index({ 'class.year': 1 });
userSchema.index({ cluster: 1 });
userSchema.index({ 'stats.clusterPoints': -1 }); // For leaderboard sorting
userSchema.index({ createdAt: -1 });

// ===== PRE-SAVE MIDDLEWARE =====
/**
 * Filter out invalid badges before saving
 */
userSchema.pre('save', function (next) {
  if (this.isModified('badges') || this.isNew) {
    const validBadges = Object.keys(BADGE_SYSTEM);
    this.badges = this.badges.filter(badge => validBadges.includes(badge));
  }
  next();
});

userSchema.pre('save', async function (next) {
  // Only hash password if it's new or modified
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// ===== INSTANCE METHODS =====

/**
 * Compare passwords for login
 */
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcryptjs.compare(enteredPassword, this.password);
};

/**
 * Get public profile (exclude sensitive data)
 */
userSchema.methods.getPublicProfile = function () {
  const user = this.toObject();
  delete user.password;
  delete user.__v;
  return user;
};

/**
 * Add badge to user
 */
userSchema.methods.addBadge = function (badge) {
  if (!Object.keys(BADGE_SYSTEM).includes(badge)) {
    throw new Error('Invalid badge');
  }
  if (!this.badges.includes(badge)) {
    this.badges.push(badge);
  }
  return this;
};

/**
 * Increment cluster points
 */
userSchema.methods.addClusterPoints = function (points) {
  this.stats.clusterPoints += points;
  return this;
};

/**
 * Update last login timestamp
 */
userSchema.methods.updateLastLogin = function () {
  this.lastLogin = new Date();
  return this;
};

// ===== VIRTUALS =====

/**
 * Get user's full class information as string
 */
userSchema.virtual('classString').get(function () {
  return `${this.class.year} ${this.class.branch}-${this.class.division}`;
});

// ===== JSON TRANSFORMATION =====
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  delete user.__v;
  return user;
};

// ===== STATICS =====

/**
 * Get top users for leaderboard
 */
userSchema.statics.getLeaderboard = function (limit = 100) {
  return this.find({ role: 'user', isActive: true })
    .sort({ 'stats.clusterPoints': -1 })
    .limit(limit)
    .populate('cluster', 'name icon');
};

/**
 * Get leaderboard by cluster
 */
userSchema.statics.getClusterLeaderboard = function (clusterId, limit = 50) {
  return this.find({
    cluster: clusterId,
    role: 'user',
    isActive: true,
  })
    .sort({ 'stats.clusterPoints': -1 })
    .limit(limit);
};

/**
 * Get users by branch
 */
userSchema.statics.getByBranch = function (branch) {
  return this.find({
    'class.branch': branch,
    role: 'user',
    isActive: true,
  });
};

/**
 * Get users by year
 */
userSchema.statics.getByYear = function (year) {
  return this.find({
    'class.year': year,
    role: 'user',
    isActive: true,
  });
};

const User = mongoose.model('User', userSchema);

export default User;
