# 🚀 Quick Reference - Mongoose Models

## Import All Models

```javascript
import { User, Admin, Event, Notice, Cluster } from './models';

// Or individual imports
import User from './models/User.js';
import Admin from './models/Admin.js';
import Event from './models/Event.js';
import Notice from './models/Notice.js';
import Cluster from './models/Cluster.js';
```

---

## User Model Quick Reference

### Create User
```javascript
const user = new User({
  fullName: 'John Doe',
  email: 'john@example.com',
  password: 'password123',
  srn: 'ARK001',
  class: { year: '3rd Year', branch: 'CSE', division: 'A' }
});
await user.save();
```

### Login
```javascript
const user = await User.findOne({ email }).select('+password');
const valid = await user.matchPassword(password);
```

### Add Badge
```javascript
const user = await User.findById(userId);
user.addBadge('🏆'); // Validates against 25-badge system
await user.save();
```

### Get Leaderboard
```javascript
const top100 = await User.getLeaderboard(100);
```

### Get by Branch/Year
```javascript
const cseUsers = await User.getByBranch('CSE');
const thirdYearUsers = await User.getByYear('3rd Year');
```

---

## Admin Model Quick Reference

### Create Admin
```javascript
const admin = new Admin({
  fullName: 'Admin Name',
  username: 'adminname',
  email: 'admin@example.com',
  password: 'admin123',
  cluster: clusterId,
  createdBy: masterAdminId // null for master
});
await admin.save();
```

### Log Activity
```javascript
const admin = await Admin.findById(adminId);
admin.logActivity('event_created', { eventId: eventId });
await admin.save();
```

### Check Permission
```javascript
const admin = await Admin.findById(adminId);
if (admin.hasPermission('manageEvents')) {
  // Allow event management
}
```

### Get Active Admins
```javascript
const admins = await Admin.getActiveAdmins();
```

---

## Event Model Quick Reference

### Create Event
```javascript
const event = new Event({
  title: 'Hackathon 2025',
  description: 'Description here',
  cluster: clusterId,
  eventType: 'upcoming',
  date: new Date('2025-12-20'),
  createdBy: adminId
});
await event.save();
```

### Register User
```javascript
const event = await Event.findById(eventId);
event.addParticipant(userId);
await event.save();
```

### Mark Winner (Rank 1-10)
```javascript
const event = await Event.findById(eventId);
event.addWinner(userId, 1, '₹5000 Prize', 100); // rank, prize, points
await event.save();
```

### Get Upcoming Events
```javascript
const upcoming = await Event.getUpcomingEvents(10);
```

### Get by Category
```javascript
const workshops = await Event.getByCategory('Workshop', 15);
```

### Search Events
```javascript
const results = await Event.searchEvents('hackathon', 20);
```

---

## Notice Model Quick Reference

### Create Notice
```javascript
const notice = new Notice({
  title: 'Registration Deadline',
  message: 'Please register by Dec 15',
  postedBy: adminId,
  category: 'deadline',
  priority: 'high',
  isPinned: true
});
await notice.save();
```

### Record View
```javascript
const notice = await Notice.findById(noticeId);
notice.recordView(userId);
await notice.save();
```

### Get Active Notices
```javascript
const notices = await Notice.getActiveNotices(20); // Non-expired, sorted by pinned
```

### Get Pinned Notices
```javascript
const pinned = await Notice.getPinnedNotices();
```

### Get Urgent
```javascript
const urgent = await Notice.getUrgentNotices(10);
```

### Archive Notice
```javascript
const notice = await Notice.findById(noticeId);
notice.archive(); // Soft delete
await notice.save();
```

---

## Cluster Model Quick Reference

### Create Cluster
```javascript
const cluster = new Cluster({
  name: 'Development',
  description: 'Build amazing applications',
  icon: '💻',
  lead: adminId
});
await cluster.save();
```

### Add Member
```javascript
const cluster = await Cluster.findById(clusterId);
cluster.addMember(userId);
await cluster.save();
```

### Add Admin
```javascript
const cluster = await Cluster.findById(clusterId);
cluster.addAdmin(adminId);
await cluster.save();
```

### Get by Slug
```javascript
const cluster = await Cluster.getBySlug('development');
```

### Get Leaderboard
```javascript
const ranked = await Cluster.getLeaderboard(10);
```

### Get Active Clusters
```javascript
const clusters = await Cluster.getActiveClusters();
```

### Search Clusters
```javascript
const results = await Cluster.searchClusters('web development', 20);
```

---

## Common Patterns

### Get User with Cluster
```javascript
const user = await User.findById(userId).populate('cluster', 'name icon');
```

### Get Event with Participants
```javascript
const event = await Event.findById(eventId)
  .populate('participants', 'fullName email')
  .populate('cluster', 'name icon');
```

### Get Notice Views
```javascript
const notice = await Notice.findById(noticeId)
  .populate('viewedBy.user', 'fullName email');
console.log(`Viewed by ${notice.viewedBy.length} users`);
```

### Get Cluster Members Count
```javascript
const cluster = await Cluster.findById(clusterId);
console.log(`Members: ${cluster.totalMembers}`);
```

---

## Validation & Errors

### Password Requirements
- Minimum 6 characters
- Auto-hashed with bcryptjs (10 rounds)

### Email Validation
- Valid email format required
- Unique across system
- Stored as lowercase

### Badge System
- 25 predefined badges only
- Maximum 25 badges per user
- Usage: `user.addBadge('🏆')`

### Event Winners
- Maximum 10 winners per event
- Ranks 1-10 only
- Auto-removed from participants

### SRN Validation
- Must be 5+ characters
- Uppercase only
- Unique per user

---

## Status Fields

### User Role
- `'user'` - Regular member (default)
- `'admin'` - Can manage events/notices
- `'moderator'` - Limited admin access

### Admin Role
- `'admin'` - Manages cluster
- `'superadmin'` - Full access

### Event Type
- `'upcoming'` - Future events
- `'past'` - Completed events
- `'ongoing'` - Currently happening

### Notice Priority
- `'low'` - Green
- `'medium'` - Yellow (default)
- `'high'` - Orange
- `'urgent'` - Red

### Notice Category
- `'announcement'` - General announcement
- `'alert'` - Important alert
- `'update'` - System update
- `'event'` - Event-related
- `'deadline'` - Important deadline
- `'other'` - Other notices

---

## Key Virtual Fields

### User
- `user.classString` → "3rd Year CSE-A"

### Event
- `event.isFull` → true/false
- `event.registrationOpen` → true/false
- `event.daysUntil` → 5
- `event.isUpcoming` → true/false

### Notice
- `notice.isValid` → true/false (active & not expired)
- `notice.postedSince` → "2 days ago"

### Cluster
- `cluster.isSetup` → true/false
- `cluster.engagementScore` → 75 (percentage)
- `cluster.healthStatus` → "excellent"/"good"/"fair"/"needs-improvement"

---

## Indexes Created (35 Total)

### Performance-Critical
- User.email, User.srn, User.stats.clusterPoints
- Event.date, Event.eventType
- Notice.isPinned, Notice.expiresAt
- Cluster.slug, Cluster.totalPoints

All commonly queried fields are indexed.

---

## Timestamp Fields (Auto-Managed)

```javascript
{
  createdAt: Date,  // Set on creation
  updatedAt: Date   // Updated on each save
}
```

---

## File Locations

```
server/models/
├── User.js              (User model)
├── Admin.js             (Admin model)
├── Event.js             (Event model)
├── Notice.js            (Notice model)
├── Cluster.js           (Cluster model)
├── index.js             (Exports)
├── README.md            (Full documentation)
└── USAGE_EXAMPLES.js    (Code examples)
```

---

## Next Steps

1. Import models in controllers
2. Create CRUD endpoints
3. Add route handlers
4. Implement authentication middleware
5. Create API documentation
6. Add error handling
7. Write tests
8. Deploy to production

---

## Documentation Files

- `README.md` - Complete model documentation
- `USAGE_EXAMPLES.js` - Practical code examples
- `DATABASE_SCHEMA.md` - ERD and relationships
- `MODELS_SUMMARY.md` - Feature overview
- `VERIFICATION_CHECKLIST.md` - Completeness checklist

---

**Last Updated:** December 8, 2025
**Status:** ✅ Production Ready
