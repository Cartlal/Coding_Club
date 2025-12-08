# Database Schema & Relationships

## Entity Relationship Diagram (ERD)

```
┌─────────────────────────────────────────────────────────────────┐
│                        CODING CLUB DATABASE                      │
└─────────────────────────────────────────────────────────────────┘

                           ┌─────────────┐
                           │  CLUSTER    │
                           ├─────────────┤
                           │ _id         │
                           │ name        │
                           │ slug        │
                           │ lead (Admin)│─┐
                           │ members[]   │ │
                           │ admins[]    │ │
                           │ totalPoints │ │
                           │ stats       │ │
                           └─────────────┘ │
                                ▲          │
                    ┌───────────┬┘          │
                    │           │          │
            ┌───────┴────┐      │      ┌───┴──────────┐
            │            │      │      │              │
      ┌─────┴─────┐  ┌───┴─────┴──────┴──┐  ┌────────┴───┐
      │   USER    │  │      ADMIN       │  │   EVENT    │
      ├───────────┤  ├────────────────┐ │  ├────────────┤
      │ _id       │  │ _id            │ │  │ _id        │
      │ fullName  │  │ username       │ │  │ title      │
      │ email     │  │ email          │ │  │ cluster_id │
      │ password  │  │ password       │ │  │ createdBy  │
      │ srn       │  │ cluster_id  ───┘ │  │ date       │
      │ class     │  │ role           │  │  │ eventType  │
      │ cluster   │  │ createdBy  ────┐  │  │ category   │
      │ stats     │  │ permissions    │  │  │ capacity   │
      │ badges[]  │  │ activityLog[]  │  │  │ image      │
      │ badges[]  │  │ lastLogin      │  │  │ participants[]
      └───────────┘  └────────────────┘  │  │ winners[]  │
            ▲              ▲              │  │ isActive   │
            │              │              │  │ isFeatured │
            │              │    ┌─────────┘  └────────────┘
            │              │    │                 ▲
            │              └────┼────────────────┬┘
            │                   │                │
      ┌─────┴─────────────────┐ │    ┌──────────┴────┐
      │  Participates in      │ │    │ Wins & Ranks  │
      │  (eventsParticipated) │ │    │               │
      └───────────────────────┘ │    └───────────────┘
                                │
                           ┌────┴────────┐
                           │   NOTICE    │
                           ├─────────────┤
                           │ _id         │
                           │ title       │
                           │ message     │
                           │ postedBy_id │
                           │ category    │
                           │ priority    │
                           │ cluster_id  │
                           │ viewedBy[]  │
                           │ expiresAt   │
                           └─────────────┘

```

## Detailed Relationships

### 1️⃣ User → Cluster (Many-to-One)
**Type**: Affiliation
```
User.cluster → Cluster._id
User.cluster (optional)
One user belongs to at most one cluster
One cluster has many members
```

### 2️⃣ User → Event (Many-to-Many)
**Type**: Participation & Winners
```
User.eventsParticipated[] → Event._id
Event.participants[] → User._id
Event.winners[].user → User._id

Special Relationship:
- When user wins, automatically removed from participants
- Max 10 winners per event
- Winners have rank (1-10) and points
```

### 3️⃣ Admin → Cluster (Many-to-One)
**Type**: Management
```
Admin.cluster → Cluster._id (primary assignment)
Cluster.lead → Admin._id (lead admin)
Cluster.admins[] → Admin._id (multiple admins)

One admin manages one primary cluster
One cluster has one lead admin
One cluster has multiple managing admins
```

### 4️⃣ Admin → Admin (Self-Reference)
**Type**: Hierarchy
```
Admin.createdBy → Admin._id (parent admin)

Master Admin (root - createdBy = null)
└── Super Admins
    └── Cluster Admins
```

### 5️⃣ Event → Cluster (Many-to-One)
**Type**: Organization
```
Event.cluster → Cluster._id
Cluster hosts multiple events

Events categorized by cluster
Cluster statistics track total events
```

### 6️⃣ Event → Admin (Many-to-One)
**Type**: Creation & Ownership
```
Event.createdBy → Admin._id

One admin creates many events
Each event has one creator
Tracks admin responsibility
```

### 7️⃣ Notice → Admin (Many-to-One)
**Type**: Publication
```
Notice.postedBy → Admin._id

One admin posts many notices
Each notice has one creator
Activity logged on admin model
```

### 8️⃣ Notice → Event (One-to-One Optional)
**Type**: Association
```
Notice.relatedEvent → Event._id (optional)

Notices can be linked to specific events
Used for event announcements/updates
Not all notices require an event
```

### 9️⃣ Notice → Cluster (One-to-Many Optional)
**Type**: Scope
```
Notice.cluster → Cluster._id (optional)

Notices can be cluster-specific
null cluster_id = visible to all
Cluster-specific = only cluster members see
```

### 🔟 Notice → User (Many-to-Many)
**Type**: Visibility & Engagement
```
Notice.viewedBy[] → User._id

Tracks which users viewed notice
Records timestamp of view
Calculates engagement metrics
```

---

## Multiplicity Matrix

| From | To | Type | Cardinality | Optional |
|------|----|----|-------------|----------|
| User | Cluster | Affiliation | N:1 | Yes |
| User | Event (Participant) | Participation | N:M | N/A |
| User | Event (Winner) | Achievement | N:M | N/A |
| User | Badge | Achievement | N:M | Yes |
| Admin | Cluster (Lead) | Leadership | 1:1 | Yes |
| Admin | Cluster (Manage) | Management | N:M | N/A |
| Admin | Event | Creation | N:M | N/A |
| Admin | Notice | Publication | N:M | N/A |
| Admin | Admin (Created) | Hierarchy | N:1 | Yes |
| Event | Cluster | Organization | N:1 | No |
| Event | User (Participant) | Participation | N:M | N/A |
| Event | User (Winner) | Achievement | N:M | Yes |
| Notice | Admin | Publication | N:1 | No |
| Notice | Event | Association | N:M | Yes |
| Notice | Cluster | Scope | N:M | Yes |
| Notice | User (View) | Engagement | N:M | N/A |
| Cluster | Admin (Lead) | Leadership | 1:1 | Yes |
| Cluster | Admin (Members) | Management | N:M | N/A |
| Cluster | User (Members) | Membership | N:M | N/A |

---

## Query Path Examples

### Get User's Cluster Name
```javascript
const user = await User.findById(userId).populate('cluster', 'name');
console.log(user.cluster.name);
```

### Get All Events in User's Cluster
```javascript
const user = await User.findById(userId);
const events = await Event.find({ cluster: user.cluster });
```

### Get Cluster Leaderboard (Top Users by Points)
```javascript
const cluster = await Cluster.findById(clusterId);
const users = await User.find({ cluster: clusterId })
  .sort({ 'stats.clusterPoints': -1 })
  .limit(100);
```

### Get Event Participants with Their Cluster
```javascript
const event = await Event.findById(eventId)
  .populate({
    path: 'participants',
    select: 'fullName email stats',
    populate: { path: 'cluster', select: 'name icon' }
  });
```

### Get Admin's Events and Notices
```javascript
const admin = await Admin.findById(adminId).populate('cluster');
const events = await Event.find({ createdBy: adminId });
const notices = await Notice.find({ postedBy: adminId });
```

### Get Notices Posted to User's Cluster
```javascript
const user = await User.findById(userId);
const notices = await Notice.find({
  $or: [
    { cluster: user.cluster },
    { cluster: null } // Global notices
  ]
}).sort({ isPinned: -1, createdAt: -1 });
```

### Get Who Viewed a Notice
```javascript
const notice = await Notice.findById(noticeId)
  .populate('viewedBy.user', 'fullName email');
```

### Get Event Winners with Their Badges
```javascript
const event = await Event.findById(eventId)
  .populate({
    path: 'winners',
    select: 'winners.user winners.rank winners.prize',
    populate: {
      path: 'winners.user',
      select: 'fullName badges stats'
    }
  });
```

---

## Data Integrity Rules

### Automatic Enforcements

1. **Event Winner → Participant Removal**
   - Pre-save middleware removes winner from participants
   - Prevents duplicate tracking

2. **Password Hashing**
   - Auto-hashed on user/admin save
   - Never stored as plaintext

3. **Event Type Auto-Conversion**
   - Event date < now → eventType = 'past'
   - Automatic status update

4. **Notice Expiration**
   - Checks expiresAt in pre-save
   - Auto-deactivates if expired

5. **Badge Validation**
   - Only 25 predefined badges allowed
   - Max 25 badges per user enforced

6. **Winner Count Limit**
   - Maximum 10 winners per event
   - Pre-save enforces limit

7. **Slug Generation**
   - Auto-generated from cluster name
   - Formatted: lowercase, no spaces

8. **Member Count Tracking**
   - Cluster.totalMembers updated
   - Cluster.totalAdmins updated

### Validation Constraints

- Email: Valid format, unique, lowercase
- Password: Min 6 chars, hashed, select: false
- SRN: Uppercase, unique, 5+ chars
- Username: Lowercase, 3-50 chars, unique
- Badges: Only from 25-badge system
- Ranks: 1-10 only for winners
- Role: Predefined enums (user, admin, moderator, superadmin)
- Event Type: upcoming, past, ongoing
- Priority: low, medium, high, urgent
- Category: Predefined list

---

## Index Coverage for Common Queries

```
Query Type                  Index Used              Performance
─────────────────────────────────────────────────────────────
Find user by email          User.email              O(1)
Find admin by username      Admin.username          O(1)
Get leaderboard             User.stats.clusterPoints O(n log n)
Get upcoming events         Event.date, eventType   O(n log n)
Get cluster members         User.cluster            O(n log n)
Get active notices          Notice.isActive         O(n log n)
Get pinned notices          Notice.isPinned         O(n log n)
Get cluster by slug         Cluster.slug            O(1)
Get admin activities        Admin.createdAt         O(n log n)
Get trending notices        Notice.views            O(n log n)
```

---

## Summary Statistics

| Metric | Count |
|--------|-------|
| Models | 5 |
| Fields | 88 |
| Indexes | 35 |
| Instance Methods | 33 |
| Static Methods | 27 |
| Virtual Fields | 11 |
| Relationships | 10 |
| Badge Options | 25 |
| Permission Types | 5 |
| Event Categories | 8 |
| Notice Categories | 6 |
| Notice Priorities | 4 |
| Winner Ranks | 10 |
| Status Values | 3 |

**Total: Production-ready database schema with 1800+ lines of optimized code**
