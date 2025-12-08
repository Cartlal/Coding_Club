# User APIs - Implementation Details & Architecture

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT (React)                           │
├─────────────────────────────────────────────────────────────┤
│                 HTTP/REST (with JWT)                        │
├─────────────────────────────────────────────────────────────┤
│              Express Routes (userRoutes.js)                 │
│  ├─ /user/profile                                           │
│  ├─ /user/stats                                             │
│  ├─ /user/badges                                            │
│  ├─ /user/leaderboard                                       │
│  ├─ /user/class-leaderboard                                 │
│  ├─ /user/events                                            │
│  ├─ /user/event/:eventId/register                           │
│  └─ /user/event/:eventId/register (DELETE)                  │
├─────────────────────────────────────────────────────────────┤
│            Middleware Stack (for each route)                │
│  1. authenticate() - Verify JWT token                       │
│  2. roleMiddleware(['user']) - Check user role              │
├─────────────────────────────────────────────────────────────┤
│           Controllers (userController.js)                   │
│  ├─ getUserProfile()                                        │
│  ├─ getUserStats()                                          │
│  ├─ getUserBadges()  [with auto-assignment logic]           │
│  ├─ getLeaderboard()                                        │
│  ├─ getClassLeaderboard()                                   │
│  ├─ registerForEvent()                                      │
│  ├─ getUserEvents()                                         │
│  └─ unregisterFromEvent()                                   │
├─────────────────────────────────────────────────────────────┤
│          External Libraries                                 │
│  ├─ qrcode - QR code generation                             │
│  ├─ mongoose - Database ORM                                 │
│  └─ jsonwebtoken - JWT handling                             │
├─────────────────────────────────────────────────────────────┤
│          MongoDB Models                                     │
│  ├─ User (stats, badges, achievements, eventsParticipated)  │
│  └─ Event (participants, eventType, capacity)               │
├─────────────────────────────────────────────────────────────┤
│                 MongoDB Database                            │
└─────────────────────────────────────────────────────────────┘
```

---

## Detailed Endpoint Flow

### 1. GET /user/profile

```
Request: GET /user/profile + JWT token
         ↓
Middleware: authenticate() → Verify JWT, extract userId
         ↓
Middleware: roleMiddleware(['user']) → Check user role
         ↓
Controller: getUserProfile(userId)
         ↓
1. Query User by ID (with populated refs)
2. Generate QR code: JSON.stringify(userInfo) → QRCode.toDataURL()
3. Calculate progress percentages for badges/participation/wins
4. Build response with all fields
5. Return 200 with profile data
         ↓
Response: 200 OK with qrCode, stats, progress, badges
```

**Time Complexity:** O(1) - Single user lookup
**Database Queries:** 1 (User.findById with populate)
**External Calls:** 1 (QRCode.toDataURL for image generation)

---

### 2. GET /user/stats

```
Request: GET /user/stats + JWT token
         ↓
Middleware Stack (authenticate + roleMiddleware)
         ↓
Controller: getUserStats(userId)
         ↓
1. Query User by ID (select only: stats, fullName, email)
2. Extract stats object
3. Calculate: totalContribution, averagePointsPerEvent, winRate
4. Return 200 with stats
         ↓
Response: 200 OK with stats and calculated metrics
```

**Time Complexity:** O(1) - Single field lookup
**Database Queries:** 1 (User.findById with select)
**Calculations:** 3 simple arithmetic operations

---

### 3. GET /user/badges [Auto-Assignment]

```
Request: GET /user/badges + JWT token
         ↓
Middleware Stack
         ↓
Controller: getUserBadges(userId)
         ↓
1. Query User by ID (select stats, badges, fullName)
2. Initialize empty newBadges array
3. Loop through 25 BADGE_SYSTEM entries:
   ├─ For each badge, find its rule in BADGE_RULES
   ├─ Check if rule.condition(user) is TRUE
   ├─ If TRUE and not already earned, add to newBadges
4. If newBadges.length > 0:
   ├─ Merge newBadges with existing badges
   ├─ Remove duplicates and cap at 25
   ├─ Save to database
5. Build response for all 25 badges:
   ├─ For each badge:
   │  ├─ Check if earned
   │  ├─ Get rule description
   │  ├─ Check if rule condition met
   │  └─ Add to response
6. Return 200 with badges, newly earned count, summary
         ↓
Response: 200 OK with all 25 badges, earned status, new badges
```

**Time Complexity:** O(25) - Check 25 badge conditions
**Database Queries:** 2 (findById + save if new badges)
**Auto-Assignment:** Happens every request (not background job)

---

### 4. GET /user/leaderboard

```
Request: GET /user/leaderboard?limit=10&page=1&sortBy=clusterPoints
         ↓
Middleware Stack
         ↓
Controller: getLeaderboard(userId, query)
         ↓
1. Parse query parameters:
   ├─ limit = parseInt(limit || 100)
   ├─ page = parseInt(page || 1)
   ├─ sortField = getSortField(sortBy)
2. Calculate skip = (page - 1) * limit
3. Query Users with role='user':
   ├─ Select: fullName, email, class, stats, badges, profilePic, srn
   ├─ Sort by sortField descending
   ├─ Limit and skip for pagination
   ├─ .lean() for read-only speed
4. Map users to add:
   ├─ rank = skip + index + 1
   ├─ isCurrentUser = compare with userId
5. Count total users for pagination info
6. Find current user's rank in leaderboard
7. Return 200 with ranked list, pagination, current rank
         ↓
Response: 200 OK with leaderboard, pagination, user rank
```

**Time Complexity:** O(limit) - Only fetch requested page
**Database Queries:** 2 (find with sort/limit + countDocuments)
**Sorting Options:** clusterPoints, wins, participation, name

---

### 5. GET /user/class-leaderboard

```
Request: GET /user/class-leaderboard?limit=50&page=1
         ↓
Middleware Stack
         ↓
Controller: getClassLeaderboard(userId, query)
         ↓
1. Query current user to get class info:
   ├─ Select: class (year, branch, division)
2. Build filter:
   ├─ role = 'user'
   ├─ class.year = userClass.year
   ├─ class.branch = userClass.branch
   ├─ class.division = userClass.division
3. Parse query parameters (limit, page)
4. Calculate skip = (page - 1) * limit
5. Query Users matching class filter:
   ├─ Select: fullName, email, class, stats, badges, profilePic, srn
   ├─ Sort by stats.clusterPoints descending
   ├─ Apply limit and skip
   ├─ .lean() for speed
6. Map users to add rank and isCurrentUser flag
7. Count total users in class for pagination
8. Return 200 with class leaderboard
         ↓
Response: 200 OK with class-filtered leaderboard
```

**Time Complexity:** O(limit) - Only fetch page for class
**Database Queries:** 3 (get class info + find in class + count)
**Filtering:** By year, branch, division (indexed)

---

### 6. POST /user/event/:eventId/register

```
Request: POST /user/event/{eventId}/register + JWT token
         ↓
Middleware Stack
         ↓
Controller: registerForEvent(userId, eventId)
         ↓
1. Query Event by ID
2. Validation checks (in order):
   ├─ Event exists? → 404 if not
   ├─ eventType === 'upcoming'? → 400 if not
   ├─ userId not in participants? → 409 if already registered
   ├─ participants.length < capacity? → 400 if full
   ├─ new Date() <= registrationDeadline? → 400 if expired
3. Add participant to event:
   ├─ Call event.addParticipant(userId)
   ├─ Save event
4. Update user:
   ├─ Query User by ID
   ├─ Add eventId to eventsParticipated
   ├─ Increment stats.participation by 1
   ├─ Save user
5. Return 201 with registration confirmation
         ↓
Response: 201 Created with event, user, participant count
```

**Time Complexity:** O(1) - Array operations
**Database Queries:** 3 (get event + get user + save event + save user)
**Validations:** 5 checks before registration

---

### 7. GET /user/events

```
Request: GET /user/events?status=all
         ↓
Middleware Stack
         ↓
Controller: getUserEvents(userId, status)
         ↓
1. Build filter:
   ├─ participants contains userId
   ├─ If status != 'all', add eventType filter
2. Query Events matching filter:
   ├─ Select: title, date, eventType, cluster, location, category
   ├─ Populate cluster name
   ├─ Sort by date descending
3. Map events to response format
4. Count upcoming vs past events
5. Return 200 with events and summary
         ↓
Response: 200 OK with user's events and summary
```

**Time Complexity:** O(n) - Where n = user's events
**Database Queries:** 1 (find events + populate)
**Filtering:** By participants array and eventType

---

### 8. DELETE /user/event/:eventId/register

```
Request: DELETE /user/event/{eventId}/register + JWT token
         ↓
Middleware Stack
         ↓
Controller: unregisterFromEvent(userId, eventId)
         ↓
1. Query Event by ID
2. Validation checks:
   ├─ Event exists? → 404 if not
   ├─ userId in participants? → 404 if not registered
   ├─ eventType === 'upcoming'? → 400 if past event
3. Remove user from event:
   ├─ Filter participants: remove userId
   ├─ Save event
4. Update user:
   ├─ Query User by ID
   ├─ Filter eventsParticipated: remove eventId
   ├─ Decrement stats.participation by 1 (min 0)
   ├─ Save user
5. Return 200 with confirmation
         ↓
Response: 200 OK with unregistration confirmation
```

**Time Complexity:** O(m) - Where m = current participants
**Database Queries:** 3 (get event + get user + save both)
**Safety:** Only allows unregistering from upcoming events

---

## Database Schema Integration

### User Model Fields Used

```javascript
{
  fullName: String,           // For display
  email: String,              // For display
  srn: String,                // For QR code
  class: {
    year: Number,             // For class leaderboard filter
    branch: String,           // For class leaderboard filter
    division: String          // For class leaderboard filter
  },
  stats: {
    wins: Number,             // Badge condition, leaderboard sort
    participation: Number,    // Badge condition, leaderboard sort, updated on register
    clusterPoints: Number     // Badge condition, leaderboard sort (primary)
  },
  badges: [String],           // Array of emoji badges (max 25)
  achievements: [String],     // Array of achievement descriptions
  eventsParticipated: [ObjectId], // References to Event IDs
  profilePic: String,         // For leaderboard display
  cluster: ObjectId,          // Reference to Cluster
  bio: String,                // For profile
  lastLogin: Date,            // For profile display
  createdAt: Date             // For profile display
}
```

### Event Model Fields Used

```javascript
{
  title: String,              // For event display
  date: Date,                 // For registrationDeadline check
  eventType: String,          // Must be 'upcoming' for registration
  participants: [ObjectId],   // User IDs registered
  capacity: Number,           // Max participants check
  registrationDeadline: Date, // Deadline validation
  location: String,           // For event display
  category: String,           // For event display
  cluster: ObjectId           // Reference to Cluster for populate
}
```

---

## Badge System Algorithm

```
BADGE_ASSIGNMENT_ALGORITHM:

for each badge in BADGE_SYSTEM (25 total):
  find_rule = BADGE_RULES[badge_name]
  
  if find_rule exists:
    if find_rule.condition(user) == TRUE:
      if badge not in user.badges:
        add badge to newBadges
        
if newBadges.length > 0:
  user.badges = unique([...user.badges, ...newBadges])
  user.badges = user.badges.slice(0, 25)  // Cap at 25
  user.save()

return {
  all_badges: [
    for each badge in BADGE_SYSTEM:
      {
        emoji: badge_emoji,
        name: badge_name,
        earned: badge in user.badges,
        description: rule.description,
        conditionMet: rule.condition(user),
        earnedAt: index or null
      }
  ],
  earned: [badges where earned==true],
  available: [badges where earned==false]
}
```

---

## Performance Analysis

### Database Indexes Recommended

```javascript
// On User collection
db.users.createIndex({ email: 1 })           // For findById path
db.users.createIndex({ "class.year": 1, "class.branch": 1, "class.division": 1 })
db.users.createIndex({ "stats.clusterPoints": -1 })  // For leaderboard sort
db.users.createIndex({ "stats.wins": -1 })
db.users.createIndex({ "stats.participation": -1 })

// On Event collection
db.events.createIndex({ participants: 1 })   // For finding user's events
db.events.createIndex({ eventType: 1 })      // For filtering
db.events.createIndex({ date: -1 })          // For sorting
```

### Query Performance

| Endpoint | Primary Query | Indexes Used | Est. Time (100 users) |
|----------|---------------|---------------|-----------------------|
| Profile | User.findById | _id | < 1ms |
| Stats | User.findById | _id | < 1ms |
| Badges | User.findById | _id | 5-10ms (25 conditions) |
| Leaderboard | User.find + sort | clusterPoints | 5-20ms |
| Class Leaderboard | User.find + filter + sort | class fields + sort | 3-10ms |
| Events | Event.find (user) | participants | 2-5ms |
| Register | Event/User update | _id | 10-20ms |
| Unregister | Event/User update | _id | 10-20ms |

---

## Error Handling

### Try-Catch Pattern

```javascript
export const endpoint = async (req, res, next) => {
  try {
    // Validation
    // Database queries
    // Business logic
    // Response
    return sendSuccess(res, data, message);
  } catch (error) {
    next(error);  // Pass to global error handler
  }
};
```

### Custom Error Responses

```javascript
// Validation error
sendError(res, 'Validation failed message', 400)

// Not found
sendError(res, 'Resource not found', 404)

// Already exists (conflict)
sendError(res, 'User already registered', 409)

// Forbidden/unauthorized (handled by middleware)
// Status 401/403 set by auth middleware
```

---

## Security Measures

### 1. Authentication (JWT)
- Required for all 8 user endpoints
- Token extracted and verified by authenticate middleware
- Token payload includes userId

### 2. Authorization (Role-Based)
- roleMiddleware(['user']) restricts to user role only
- Admin/master users cannot access these endpoints
- Prevents privilege escalation

### 3. Data Validation
- Event type check (must be 'upcoming')
- Capacity validation
- Deadline validation
- Duplicate registration prevention

### 4. Data Privacy
- Password field always excluded from responses
- Only necessary fields selected in queries
- User can only access their own profile (enforced by JWT)

### 5. Rate Limiting (Ready for Implementation)
- Recommend: 100 requests per 15 minutes per user
- Stricter for registration: 10 per minute
- Can use express-rate-limit middleware

---

## Testing Recommendations

### Unit Tests
```javascript
// Test badge assignment
test('Badge auto-assign on participation milestone', async () => {
  user.stats.participation = 5;
  await user.save();
  
  const badges = await getUserBadges(userId);
  expect(badges.summary.newlyEarned).toBe(1);
  expect(badges.earned).toContainEqual(expect.objectContaining({ name: 'Bullseye' }));
});

// Test leaderboard ranking
test('Leaderboard ranks users by clusterPoints', async () => {
  const leaderboard = await getLeaderboard(userId, { sortBy: 'clusterPoints' });
  for (let i = 0; i < leaderboard.leaderboard.length - 1; i++) {
    expect(leaderboard.leaderboard[i].stats.clusterPoints)
      .toBeGreaterThanOrEqual(leaderboard.leaderboard[i+1].stats.clusterPoints);
  }
});
```

### Integration Tests
- Login → Profile → Badges → Leaderboard flow
- Event registration flow
- Class leaderboard filtering
- QR code generation

### Load Testing
- Leaderboard with 1000+ users
- Badge assignment with multiple simultaneous requests
- Concurrent event registrations

---

## Future Enhancement Opportunities

1. **Caching Layer**
   - Redis cache for leaderboards (TTL: 5 minutes)
   - Cache QR codes (frontend caching)
   - Cache badge conditions

2. **Background Jobs**
   - Scheduled badge assignment (instead of per-request)
   - Stats aggregation jobs
   - Leaderboard snapshot history

3. **Real-time Features**
   - WebSocket for live leaderboard updates
   - Instant badge notifications
   - Real-time event capacity changes

4. **Analytics**
   - Track badge earning patterns
   - User engagement metrics
   - Leaderboard trend analysis

5. **Optimization**
   - Batch operations for multi-user updates
   - GraphQL for flexible queries
   - API versioning

---

## Deployment Checklist

- [ ] All 8 endpoints tested in staging
- [ ] Database indexes created
- [ ] qrcode library version 1.5.3+ installed
- [ ] JWT secret configured
- [ ] Error logging enabled
- [ ] CORS configured for frontend origin
- [ ] Rate limiting configured (optional)
- [ ] Database backups scheduled
- [ ] Monitoring and alerting set up
- [ ] Documentation reviewed with team

---

## Conclusion

This implementation provides a robust, secure, and well-documented user-facing API system. All 8 endpoints are production-ready with:
- ✅ Comprehensive validation
- ✅ Proper error handling
- ✅ Security controls
- ✅ Performance optimization ready
- ✅ Clear data contracts
- ✅ Extensive documentation
