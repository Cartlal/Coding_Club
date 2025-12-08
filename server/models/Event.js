import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    // Basic Information
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },

    description: {
      type: String,
      required: [true, 'Event description is required'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },

    // Event Details
    cluster: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cluster',
      required: [true, 'Cluster assignment is required'],
    },

    eventType: {
      type: String,
      enum: ['upcoming', 'past', 'ongoing'],
      default: 'upcoming',
    },

    date: {
      type: Date,
      required: [true, 'Event date is required'],
      validate: {
        validator: function (value) {
          // Past events can have any date, upcoming should be future
          if (this.eventType === 'upcoming') {
            return value > new Date();
          }
          return true;
        },
        message: 'Upcoming event date must be in the future',
      },
    },

    time: {
      start: String, // Format: HH:MM
      end: String,   // Format: HH:MM
    },

    location: {
      type: String,
      maxlength: [200, 'Location cannot exceed 200 characters'],
    },

    // Content
    image: {
      type: String, // Base64 or URL
      default: null,
    },

    category: {
      type: String,
      enum: ['Workshop', 'Competition', 'Seminar', 'Course', 'Hackathon', 'Talk', 'Social', 'Other'],
      default: 'Workshop',
    },

    // Creator Information
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      required: [true, 'Event creator is required'],
    },

    // Participants
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],

    capacity: {
      type: Number,
      default: null, // null means unlimited capacity
      min: [1, 'Capacity must be at least 1'],
    },

    // Winners & Rankings
    winners: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        rank: {
          type: Number,
          enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
          required: true,
        },
        prize: String, // Prize description
        pointsAwarded: {
          type: Number,
          default: 0,
        },
      },
    ],

    // Event Settings
    isActive: {
      type: Boolean,
      default: true,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    tags: [String], // For categorization and filtering

    // Additional Details
    details: {
      type: String,
      maxlength: [5000, 'Details cannot exceed 5000 characters'],
    },

    instructor: String, // Event organizer/instructor name

    requirements: [String], // Prerequisites or requirements

    // Registration Settings
    requiresApproval: {
      type: Boolean,
      default: false,
    },

    registrationDeadline: Date,
  },
  {
    timestamps: true,
  }
);

// ===== INDEXES =====
eventSchema.index({ cluster: 1 });
eventSchema.index({ eventType: 1 });
eventSchema.index({ date: 1 });
eventSchema.index({ 'date': 1, 'eventType': 1 }); // Composite index for filtering
eventSchema.index({ createdBy: 1 });
eventSchema.index({ isActive: 1 });
eventSchema.index({ isFeatured: 1 });
eventSchema.index({ createdAt: -1 });
eventSchema.index({ tags: 1 });

// ===== PRE-SAVE MIDDLEWARE =====

/**
 * Auto-update eventType based on date
 */
eventSchema.pre('save', function (next) {
  const now = new Date();

  // If date is in past, mark as past event
  if (this.date < now && this.eventType !== 'past') {
    this.eventType = 'past';
  }

  // Remove participants that are in winners
  const winnerUserIds = this.winners.map((w) => w.user.toString());
  this.participants = this.participants.filter(
    (p) => !winnerUserIds.includes(p.toString())
  );

  // Limit winners to maximum 10
  if (this.winners.length > 10) {
    this.winners = this.winners.slice(0, 10);
  }

  next();
});

// ===== INSTANCE METHODS =====

/**
 * Add participant to event
 */
eventSchema.methods.addParticipant = function (userId) {
  if (!this.participants.includes(userId)) {
    // Check capacity
    if (this.capacity && this.participants.length >= this.capacity) {
      throw new Error('Event is at full capacity');
    }
    this.participants.push(userId);
  }
  return this;
};

/**
 * Remove participant from event
 */
eventSchema.methods.removeParticipant = function (userId) {
  this.participants = this.participants.filter(
    (id) => id.toString() !== userId.toString()
  );
  return this;
};

/**
 * Add winner
 */
eventSchema.methods.addWinner = function (userId, rank, prize = '', pointsAwarded = 0) {
  if (rank < 1 || rank > 10) {
    throw new Error('Rank must be between 1 and 10');
  }

  // Check if user is already a winner
  const existingWinner = this.winners.find((w) => w.user.toString() === userId.toString());
  if (existingWinner) {
    throw new Error('User is already a winner');
  }

  // Check if rank is already taken
  const rankTaken = this.winners.find((w) => w.rank === rank);
  if (rankTaken) {
    throw new Error(`Rank ${rank} is already taken`);
  }

  this.winners.push({
    user: userId,
    rank,
    prize,
    pointsAwarded,
  });

  // Remove from participants
  this.removeParticipant(userId);

  return this;
};

/**
 * Get participant count
 */
eventSchema.methods.getParticipantCount = function () {
  return this.participants.length + this.winners.length;
};

/**
 * Get available capacity
 */
eventSchema.methods.getAvailableCapacity = function () {
  if (!this.capacity) {
    return null; // Unlimited capacity
  }
  return Math.max(0, this.capacity - this.getParticipantCount());
};

/**
 * Check if user is participant
 */
eventSchema.methods.isParticipant = function (userId) {
  return this.participants.includes(userId);
};

/**
 * Check if user is winner
 */
eventSchema.methods.isWinner = function (userId) {
  return this.winners.some((w) => w.user.toString() === userId.toString());
};

/**
 * Get attendee count (visible to public)
 */
eventSchema.methods.getAttendeeCount = function () {
  return this.participants.length;
};

// ===== VIRTUALS =====

/**
 * Is event full
 */
eventSchema.virtual('isFull').get(function () {
  if (!this.capacity) return false;
  return this.getParticipantCount() >= this.capacity;
});

/**
 * Is event registration open
 */
eventSchema.virtual('registrationOpen').get(function () {
  const now = new Date();
  if (this.registrationDeadline) {
    return now < this.registrationDeadline;
  }
  return this.eventType !== 'past';
});

/**
 * Days until event
 */
eventSchema.virtual('daysUntil').get(function () {
  const now = new Date();
  const diffTime = Math.abs(this.date - now);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

/**
 * Is event happening soon (within 7 days)
 */
eventSchema.virtual('isUpcoming').get(function () {
  const now = new Date();
  const in7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  return this.date > now && this.date <= in7Days;
});

// ===== JSON TRANSFORMATION =====
eventSchema.methods.toJSON = function () {
  const event = this.toObject();
  delete event.__v;
  return event;
};

// ===== STATICS =====

/**
 * Get upcoming events
 */
eventSchema.statics.getUpcomingEvents = function (limit = 10) {
  const now = new Date();
  return this.find({
    eventType: { $in: ['upcoming', 'ongoing'] },
    date: { $gte: now },
    isActive: true,
  })
    .sort({ date: 1 })
    .limit(limit)
    .populate('cluster', 'name icon')
    .populate('createdBy', 'fullName');
};

/**
 * Get past events
 */
eventSchema.statics.getPastEvents = function (limit = 10) {
  return this.find({
    eventType: 'past',
    isActive: true,
  })
    .sort({ date: -1 })
    .limit(limit)
    .populate('cluster', 'name icon')
    .populate('createdBy', 'fullName');
};

/**
 * Get events by cluster
 */
eventSchema.statics.getByCluster = function (clusterId, limit = 20) {
  return this.find({
    cluster: clusterId,
    isActive: true,
  })
    .sort({ date: -1 })
    .limit(limit)
    .populate('createdBy', 'fullName');
};

/**
 * Get featured events
 */
eventSchema.statics.getFeaturedEvents = function (limit = 5) {
  return this.find({
    isFeatured: true,
    isActive: true,
  })
    .sort({ date: 1 })
    .limit(limit)
    .populate('cluster', 'name icon');
};

/**
 * Search events
 */
eventSchema.statics.searchEvents = function (query, limit = 20) {
  return this.find({
    isActive: true,
    $or: [
      { title: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } },
      { tags: { $in: [new RegExp(query, 'i')] } },
    ],
  })
    .limit(limit)
    .populate('cluster', 'name icon');
};

/**
 * Get events by category
 */
eventSchema.statics.getByCategory = function (category, limit = 20) {
  return this.find({
    category,
    isActive: true,
  })
    .sort({ date: -1 })
    .limit(limit)
    .populate('cluster', 'name icon');
};

const Event = mongoose.model('Event', eventSchema);

export default Event;
