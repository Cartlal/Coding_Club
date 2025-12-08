import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';

const adminSchema = new mongoose.Schema(
  {
    // Basic Information
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },

    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      lowercase: true,
      minlength: [3, 'Username must be at least 3 characters'],
      maxlength: [50, 'Username cannot exceed 50 characters'],
      match: [/^[a-z0-9_-]+$/, 'Username can only contain lowercase letters, numbers, underscores, and hyphens'],
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

    // Admin Information
    cluster: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cluster',
      required: [true, 'Cluster assignment is required for admin'],
    },

    // Account Details
    role: {
      type: String,
      enum: ['admin', 'superadmin'],
      default: 'admin',
    },

    // Created by Master Admin
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      default: null, // Will be null if created by Master account
    },

    // Account Status
    isActive: {
      type: Boolean,
      default: true,
    },

    lastLogin: {
      type: Date,
      default: null,
    },

    // Permissions/Permissions object
    permissions: {
      manageUsers: {
        type: Boolean,
        default: true,
      },
      manageEvents: {
        type: Boolean,
        default: true,
      },
      manageBadges: {
        type: Boolean,
        default: true,
      },
      manageNotices: {
        type: Boolean,
        default: true,
      },
      manageAdmins: {
        type: Boolean,
        default: false, // Only superadmin
      },
    },

    // Activity Tracking
    activityLog: [
      {
        action: String,
        timestamp: {
          type: Date,
          default: Date.now,
        },
        details: mongoose.Schema.Types.Mixed,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// ===== INDEXES =====
adminSchema.index({ username: 1 });
adminSchema.index({ email: 1 });
adminSchema.index({ cluster: 1 });
adminSchema.index({ createdAt: -1 });
adminSchema.index({ isActive: 1 });

// ===== PRE-SAVE MIDDLEWARE =====
adminSchema.pre('save', async function (next) {
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
adminSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcryptjs.compare(enteredPassword, this.password);
};

/**
 * Get public profile (exclude sensitive data)
 */
adminSchema.methods.getPublicProfile = function () {
  const admin = this.toObject();
  delete admin.password;
  delete admin.__v;
  return admin;
};

/**
 * Update last login timestamp
 */
adminSchema.methods.updateLastLogin = function () {
  this.lastLogin = new Date();
  return this;
};

/**
 * Log admin activity
 */
adminSchema.methods.logActivity = function (action, details = {}) {
  this.activityLog.push({
    action,
    timestamp: new Date(),
    details,
  });

  // Keep only last 100 activities
  if (this.activityLog.length > 100) {
    this.activityLog = this.activityLog.slice(-100);
  }

  return this;
};

/**
 * Check permission
 */
adminSchema.methods.hasPermission = function (permission) {
  // Superadmin has all permissions
  if (this.role === 'superadmin') {
    return true;
  }

  return this.permissions[permission] === true;
};

// ===== JSON TRANSFORMATION =====
adminSchema.methods.toJSON = function () {
  const admin = this.toObject();
  delete admin.password;
  delete admin.__v;
  delete admin.activityLog; // Don't expose activity log in JSON
  return admin;
};

// ===== STATICS =====

/**
 * Get all active admins
 */
adminSchema.statics.getActiveAdmins = function () {
  return this.find({ isActive: true }).populate('cluster', 'name icon');
};

/**
 * Get admins by cluster
 */
adminSchema.statics.getByCluster = function (clusterId) {
  return this.find({
    cluster: clusterId,
    isActive: true,
  }).populate('cluster', 'name icon');
};

/**
 * Get activity log for admin
 */
adminSchema.statics.getActivityLog = function (adminId, limit = 50) {
  return this.findById(adminId).select('activityLog').limit(limit);
};

const Admin = mongoose.model('Admin', adminSchema);

export default Admin;
