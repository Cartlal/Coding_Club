# Mongoose Models Documentation

Complete Mongoose models for Coding Club Backend System with validation, indexes, virtual fields, and static methods.

## Overview

- **User Model** - Student members with achievements and badges
- **Admin Model** - Club administrators and moderators
- **Event Model** - Club events with participants and winners
- **Notice Model** - Announcements and club communications
- **Cluster Model** - Interest group management

---

## User Model

**Description**: Represents student members of the coding club.

### Fields

```javascript
{
  // Basic Information
  fullName: String (required, max 100)
  email: String (required, unique, email format)
  password: String (required, min 6, hashed)
  profilePic: String (Base64 image, optional)
  srn: String (required, unique, regex validated)

  // Class Information
  class: {
    year: Enum ['1st Year', '2nd Year', '3rd Year', '4th Year']
    branch: Enum ['CSE', 'ECE', 'Mechanical', 'Civil', 'EEE', 'BME', 'Chemical', 'BCA', 'ISE']
    division: String (single uppercase letter)
  }

  // Account Settings
  bio: String (max 500)
  cluster: ObjectId (ref: Cluster)
  eventsParticipated: [ObjectId] (ref: Event)

  // Achievements & Badges (25 Badge System)
  achievements: [String]
  badges: [String] (enum of 25 badge emojis, max 25)

  // Statistics
  stats: {
    wins: Number (min 0, default 0)
    participation: Number (min 0, default 0)
    clusterPoints: Number (for leaderboard ranking)
  }

  // Account Management
  role: Enum ['user', 'admin', 'moderator'] (default: 'user')
  isActive: Boolean (default: true)
  lastLogin: Date

  // Timestamps
  createdAt: Date
  updatedAt: Date
}
```

### Indexes
- `email` (single)
- `srn` (single)
- `class.branch` (single)
- `class.year` (single)
- `cluster` (single)
- `stats.clusterPoints` (descending - for leaderboard)
- `createdAt` (descending)

### Instance Methods
- `matchPassword(enteredPassword)` - Compare password for login
- `getPublicProfile()` - Get profile without sensitive data
- `addBadge(badge)` - Add badge to user (validates against 25-badge system)
- `addClusterPoints(points)` - Increment cluster points
- `updateLastLogin()` - Update last login timestamp

### Virtual Fields
- `classString` - Returns formatted class (e.g., "3rd Year CSE-A")

### Static Methods
- `getLeaderboard(limit)` - Get top users by cluster points
- `getClusterLeaderboard(clusterId, limit)` - Get leaderboard for specific cluster
- `getByBranch(branch)` - Get all users in a branch
- `getByYear(year)` - Get all users in a year

### Badge System (25 Badges)
```
🏆 Champion      🥇 First Place     🥈 Second Place    🥉 Third Place
⚡ Lightning Fast  💻 Code Master     🧠 Brain Power     🚀 Rocket Launcher
🎯 Bullseye      🔥 On Fire         ⭐ Star Performer  👑 Crowned
🎨 Creative Designer  🔐 Security Expert  📊 Data Analyst  🌟 Rising Star
💡 Innovator     🎓 Scholar         🏅 Achiever        ✨ Brilliant
🎪 Event Master  🤝 Team Player     📈 Growth Mindset  🔬 Researcher
🎭 Multi-talented
```

---

## Admin Model

**Description**: Represents administrators and moderators managing the club.

### Fields

```javascript
{
  // Basic Information
  fullName: String (required, max 100)
  username: String (required, unique, lowercase, 3-50 chars)
  email: String (required, unique, email format)
  password: String (required, min 6, hashed)

  // Admin Information
  cluster: ObjectId (required, ref: Cluster)
  role: Enum ['admin', 'superadmin'] (default: 'admin')

  // Created by Master Admin
  createdBy: ObjectId (ref: Admin, default: null)

  // Account Status
  isActive: Boolean (default: true)
  lastLogin: Date

  // Permissions
  permissions: {
    manageUsers: Boolean (default: true)
    manageEvents: Boolean (default: true)
    manageBadges: Boolean (default: true)
    manageNotices: Boolean (default: true)
    manageAdmins: Boolean (default: false)
  }

  // Activity Log (last 100 entries)
  activityLog: [{
    action: String
    timestamp: Date
    details: Mixed
  }]

  // Timestamps
  createdAt: Date
  updatedAt: Date
}
```

### Indexes
- `username` (single)
- `email` (single)
- `cluster` (single)
- `createdAt` (descending)
- `isActive` (single)

### Instance Methods
- `matchPassword(enteredPassword)` - Compare password for login
- `getPublicProfile()` - Get profile without sensitive data
- `updateLastLogin()` - Update last login timestamp
- `logActivity(action, details)` - Log admin activities
- `hasPermission(permission)` - Check if admin has permission

### Static Methods
- `getActiveAdmins()` - Get all active admins
- `getByCluster(clusterId)` - Get admins for specific cluster
- `getActivityLog(adminId, limit)` - Get activity log for admin

---

## Event Model

**Description**: Represents club events, competitions, and activities.

### Fields

```javascript
{
  // Basic Information
  title: String (required, max 150)
  description: String (required, max 2000)

  // Event Details
  cluster: ObjectId (required, ref: Cluster)
  eventType: Enum ['upcoming', 'past', 'ongoing'] (default: 'upcoming')
  date: Date (required, validates future date for upcoming events)

  // Time & Location
  time: {
    start: String (HH:MM format)
    end: String (HH:MM format)
  }
  location: String (max 200)

  // Content
  image: String (Base64 or URL, optional)
  category: Enum ['Workshop', 'Competition', 'Seminar', 'Course', 'Hackathon', 'Talk', 'Social', 'Other']
  details: String (max 5000)
  instructor: String

  // Creator
  createdBy: ObjectId (required, ref: Admin)

  // Participants
  participants: [ObjectId] (ref: User)
  capacity: Number (optional, null = unlimited)

  // Winners & Rankings (max 10)
  winners: [{
    user: ObjectId (ref: User)
    rank: Enum [1-10]
    prize: String (optional)
    pointsAwarded: Number
  }]

  // Event Settings
  isActive: Boolean (default: true)
  isFeatured: Boolean (default: false)
  tags: [String]

  // Registration
  requirements: [String]
  requiresApproval: Boolean (default: false)
  registrationDeadline: Date

  // Timestamps
  createdAt: Date
  updatedAt: Date
}
```

### Indexes
- `cluster` (single)
- `eventType` (single)
- `date` (single)
- `date` + `eventType` (composite)
- `createdBy` (single)
- `isActive` (single)
- `isFeatured` (single)
- `createdAt` (descending)
- `tags` (single)

### Instance Methods
- `addParticipant(userId)` - Add user to event (checks capacity)
- `removeParticipant(userId)` - Remove user from participants
- `addWinner(userId, rank, prize, pointsAwarded)` - Add winner (max rank 10)
- `getParticipantCount()` - Get total participants count
- `getAvailableCapacity()` - Get remaining capacity
- `isParticipant(userId)` - Check if user is participant
- `isWinner(userId)` - Check if user is winner
- `getAttendeeCount()` - Get public attendee count

### Virtual Fields
- `isFull` - Check if event is at capacity
- `registrationOpen` - Check if registration is open
- `daysUntil` - Get days until event
- `isUpcoming` - Check if event is within 7 days

### Static Methods
- `getUpcomingEvents(limit)` - Get upcoming events
- `getPastEvents(limit)` - Get past events
- `getByCluster(clusterId, limit)` - Get events for cluster
- `getFeaturedEvents(limit)` - Get featured events
- `searchEvents(query, limit)` - Search events by title/description/tags
- `getByCategory(category, limit)` - Get events by category

---

## Notice Model

**Description**: Represents announcements and communications to club members.

### Fields

```javascript
{
  // Basic Information
  title: String (required, max 150)
  message: String (required, max 3000)

  // Creator
  postedBy: ObjectId (required, ref: Admin)

  // Notice Details
  category: Enum ['announcement', 'alert', 'update', 'event', 'deadline', 'other']
  priority: Enum ['low', 'medium', 'high', 'urgent'] (default: 'medium')

  // Content
  image: String (Base64 or URL, optional)
  tags: [String]

  // Status
  isActive: Boolean (default: true)
  isPinned: Boolean (default: false)

  // Engagement Tracking
  views: Number (default: 0)
  viewedBy: [{
    user: ObjectId (ref: User)
    viewedAt: Date
  }]

  // Expiration
  expiresAt: Date (optional, null = no expiration)

  // Cluster-specific
  cluster: ObjectId (ref: Cluster, optional)

  // Linked Resources
  relatedEvent: ObjectId (ref: Event, optional)

  // Timestamps
  createdAt: Date
  updatedAt: Date
}
```

### Indexes
- `postedBy` (single)
- `category` (single)
- `priority` (single)
- `isPinned` + `createdAt` (composite, descending)
- `isActive` (single)
- `cluster` (single)
- `createdAt` (descending)
- `expiresAt` (single)
- `tags` (single)

### Instance Methods
- `recordView(userId)` - Record user view (increments view count)
- `isExpired()` - Check if notice has expired
- `getViewerCount()` - Get number of unique viewers
- `hasUserViewed(userId)` - Check if user has viewed
- `getPriorityColor()` - Get color for UI (green/yellow/orange/red)
- `getCategoryIcon()` - Get icon emoji for category
- `archive()` - Soft delete notice

### Virtual Fields
- `isValid` - Check if notice is still active and not expired
- `postedSince` - Time since posted (e.g., "2 days ago")
- `engagementPercentage` - View engagement percentage

### Static Methods
- `getActiveNotices(limit)` - Get all non-expired active notices (pinned first)
- `getPinnedNotices()` - Get pinned notices only
- `getByCategory(category, limit)` - Get notices by category
- `getByCluster(clusterId, limit)` - Get cluster-specific notices
- `getUrgentNotices(limit)` - Get urgent priority notices
- `searchNotices(query, limit)` - Search notices
- `getTrendingNotices(limit)` - Get most viewed notices

---

## Cluster Model

**Description**: Represents interest groups/clusters within the club.

### Fields

```javascript
{
  // Basic Information
  name: String (required, unique, max 100)
  description: String (required, max 1000)

  // Branding
  icon: String (emoji, default: '⭐')
  color: String (hex color, default: '#3B82F6')
  gradient: String (Tailwind gradient, default: 'from-blue-500 to-blue-600')
  borderColor: String (with opacity, default: 'border-blue-500/30')
  textColor: String (Tailwind class, default: 'text-blue-400')

  // Detailed Information
  foundation: String (max 2000)
  focusAreas: [String]
  technologies: [String]

  // Leadership
  lead: ObjectId (ref: Admin)
  members: [ObjectId] (ref: User)
  admins: [ObjectId] (ref: Admin)

  // Events & Statistics
  totalEvents: Number (default: 0)
  totalMembers: Number (default: 0)
  totalPoints: Number (for ranking)

  // Status
  isActive: Boolean (default: true)
  isFeatured: Boolean (default: false)

  // Statistics
  stats: {
    eventsHeld: Number (default: 0)
    totalParticipants: Number (default: 0)
    averageParticipation: Number
  }

  // Contact
  email: String (email format, optional)

  // Social Links
  socialLinks: {
    instagram: String
    twitter: String
    github: String
    linkedin: String
  }

  // Gallery
  images: [String]

  // Meta
  slug: String (lowercase, unique)
  ranking: Number (optional)

  // Timestamps
  createdAt: Date
  updatedAt: Date
}
```

### Indexes
- `name` (single)
- `slug` (single)
- `isActive` (single)
- `isFeatured` (single)
- `stats.eventsHeld` (descending)
- `totalPoints` (descending)
- `createdAt` (descending)

### Instance Methods
- `addMember(userId)` - Add member to cluster
- `removeMember(userId)` - Remove member from cluster
- `addAdmin(adminId)` - Add admin to cluster
- `removeAdmin(adminId)` - Remove admin from cluster
- `addPoints(points)` - Add points to cluster
- `incrementEventCount()` - Increment events count
- `updateParticipants(count)` - Update participant statistics
- `getPublicProfile()` - Get profile without sensitive data

### Virtual Fields
- `isSetup` - Check if cluster is fully configured
- `engagementScore` - Calculate engagement percentage
- `healthStatus` - Get cluster health status (excellent/good/fair/needs-improvement)

### Static Methods
- `getActiveClusters()` - Get all active clusters (sorted by featured, then points)
- `getFeaturedClusters()` - Get featured clusters
- `getBySlug(slug)` - Get cluster by slug with populated fields
- `getLeaderboard(limit)` - Get cluster leaderboard by points
- `getTopPerformers(limit)` - Get clusters by event count
- `getMostActive(limit)` - Get clusters by participant count
- `searchClusters(query, limit)` - Search clusters by name/description/focus/tech

---

## Validation & Constraints

### Password Security
- Minimum 6 characters
- Hashed with bcryptjs (10 salt rounds)
- Never returned in queries

### Email Validation
- Valid email format required
- Unique constraint
- Lowercase stored

### Badge System
- Maximum 25 badges per user
- Pre-defined set of 25 emojis
- Validation on add

### Event Winners
- Maximum 10 winners per event
- Unique ranks (1-10)
- Automatic removal from participants list

### Date Validations
- Event date must be future for "upcoming" type
- Auto-converts to "past" when date passes

---

## Usage Examples

### Create User
```javascript
const user = new User({
  fullName: 'John Doe',
  email: 'john@example.com',
  password: 'password123',
  srn: 'ARK001',
  class: {
    year: '3rd Year',
    branch: 'CSE',
    division: 'A'
  }
});
await user.save();
```

### Add Badge to User
```javascript
const user = await User.findById(userId);
user.addBadge('🏆');
user.addClusterPoints(100);
await user.save();
```

### Create Event
```javascript
const event = new Event({
  title: 'Hackathon 2025',
  description: '24-hour coding marathon',
  cluster: clusterId,
  eventType: 'upcoming',
  date: new Date('2025-12-20'),
  createdBy: adminId
});
await event.save();
```

### Get Leaderboard
```javascript
const leaderboard = await User.getLeaderboard(100);
```

### Add Event Winner
```javascript
const event = await Event.findById(eventId);
event.addWinner(userId, 1, '₹5000 Prize', 100);
await event.save();
```

---

## Relationships

```
User
├── cluster (Cluster)
├── eventsParticipated (Event)
└── events as winner (Event.winners)

Admin
├── cluster (Cluster)
├── createdBy (Admin - Master)
└── manages (User, Event, Notice)

Event
├── cluster (Cluster)
├── createdBy (Admin)
├── participants (User[])
└── winners (User[])

Notice
├── postedBy (Admin)
├── cluster (Cluster - optional)
└── relatedEvent (Event)

Cluster
├── lead (Admin)
├── members (User[])
└── admins (Admin[])
```

---

## Notes

- All models use timestamps (createdAt, updatedAt)
- Password fields are excluded from default queries (select: false)
- Proper indexes for common queries
- Virtual fields for computed data
- Static methods for common queries
- Pre-save middleware for data integrity
- Comprehensive validation at schema level
