# Admin APIs Documentation

## Overview

The Admin APIs provide comprehensive management capabilities for club administrators. These endpoints allow admins to manage events, post notices, declare winners, track participants, and view statistics. All routes are protected with authentication and role-based authorization.

## Authentication & Authorization

All admin endpoints require:
1. **Authentication**: Valid JWT token in `Authorization: Bearer <token>` header
2. **Authorization**: User must be `admin` or `master` role

Additionally:
- **Regular Admins** can only manage events in their assigned cluster
- **Masters** have unrestricted access to all events and statistics
- Event management requires the admin to be either the event creator or in the same cluster as the event

## Base URL
```
http://localhost:5000/api/admin
```

---

## EVENT MANAGEMENT ENDPOINTS

### 1. Add Event (Upcoming Only)

Create a new upcoming event in a cluster.

```http
POST /admin/event/add
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Web Development Workshop",
  "description": "Learn modern web development with React and Node.js",
  "cluster": "67a9c1f2e4b0d2a3c1f2e4b0",
  "date": "2024-02-15",
  "time": {
    "startTime": "14:00",
    "endTime": "16:00"
  },
  "location": "Room 101, Building A",
  "category": "Workshop",
  "image": "https://example.com/image.jpg",
  "details": "Hands-on workshop covering HTML, CSS, and JavaScript",
  "instructor": "John Doe",
  "capacity": 50,
  "registrationDeadline": "2024-02-14",
  "requirements": ["Basic programming knowledge"],
  "tags": ["web", "frontend", "react"]
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Event created successfully",
  "data": {
    "_id": "67a9c1f2e4b0d2a3c1f2e4b1",
    "title": "Web Development Workshop",
    "description": "Learn modern web development with React and Node.js",
    "date": "2024-02-15T00:00:00.000Z",
    "capacity": 50,
    "participants": [],
    "winners": [],
    "eventType": "upcoming",
    "isActive": true,
    "cluster": {
      "_id": "67a9c1f2e4b0d2a3c1f2e4b0",
      "name": "Programming"
    },
    "createdBy": {
      "_id": "67a9c1f2e4b0d2a3c1f2e3f0",
      "fullName": "Jane Smith",
      "username": "janesmith"
    },
    "createdAt": "2024-01-20T10:00:00.000Z"
  }
}
```

**Validation Rules:**
- `title`, `description` are required
- `date` must be in the future
- `cluster` must be valid and existing
- `capacity` must be >= 1 if provided
- Only upcoming events can be created (eventType: 'upcoming')
- Admin can create in their own cluster or specify another cluster

**Error Responses:**
```json
// Future date validation
{
  "success": false,
  "message": "Event date must be in the future for upcoming events",
  "statusCode": 400
}

// Cluster not found
{
  "success": false,
  "message": "Cluster not found",
  "statusCode": 404
}
```

---

### 2. Edit Event

Modify an existing upcoming event. Only the creator or an admin in the same cluster can edit.

```http
PUT /admin/event/edit/:id
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Parameters:**
- `id`: Event ID (required)

**Request Body (All optional, only include fields to update):**
```json
{
  "title": "Advanced Web Development Workshop",
  "description": "Updated description",
  "date": "2024-02-16",
  "time": {
    "startTime": "15:00",
    "endTime": "17:00"
  },
  "capacity": 60,
  "registrationDeadline": "2024-02-15",
  "tags": ["web", "advanced", "react", "node.js"]
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Event updated successfully",
  "data": {
    "_id": "67a9c1f2e4b0d2a3c1f2e4b1",
    "title": "Advanced Web Development Workshop",
    "description": "Updated description",
    "date": "2024-02-16T00:00:00.000Z",
    "capacity": 60,
    "eventType": "upcoming",
    "updatedAt": "2024-01-20T11:00:00.000Z"
  }
}
```

**Restrictions:**
- Only upcoming events can be edited
- Admin must be event creator OR in the same cluster
- Future date validation applies to new date

**Error Responses:**
```json
// Event not found
{
  "success": false,
  "message": "Event not found",
  "statusCode": 404
}

// Not upcoming event
{
  "success": false,
  "message": "Can only edit upcoming events",
  "statusCode": 400
}

// Permission denied
{
  "success": false,
  "message": "You can only edit events you created or in your cluster",
  "statusCode": 403
}
```

---

### 3. Delete Event

Remove an upcoming event. Only the creator or an admin in the same cluster can delete.

```http
DELETE /admin/event/delete/:id
Authorization: Bearer <token>
```

**Request Parameters:**
- `id`: Event ID (required)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Event deleted successfully",
  "data": {
    "deletedId": "67a9c1f2e4b0d2a3c1f2e4b1"
  }
}
```

**Restrictions:**
- Only upcoming events can be deleted
- Past or ongoing events cannot be deleted
- Admin must be event creator OR in the same cluster

**Error Responses:**
```json
// Cannot delete past event
{
  "success": false,
  "message": "Can only delete upcoming events",
  "statusCode": 400
}

// Permission denied
{
  "success": false,
  "message": "You can only delete events you created or in your cluster",
  "statusCode": 403
}
```

---

### 4. Get Event Participants

Retrieve all participants registered for an event with pagination.

```http
GET /admin/event/:id/participants?limit=50&page=1
Authorization: Bearer <token>
```

**Request Parameters:**
- `id`: Event ID (required)
- `limit`: Results per page (default: 50)
- `page`: Page number (default: 1)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Event participants retrieved successfully",
  "data": {
    "event": {
      "_id": "67a9c1f2e4b0d2a3c1f2e4b1",
      "title": "Web Development Workshop",
      "capacity": 50
    },
    "participants": [
      {
        "_id": "67a9c1f2e4b0d2a3c1f2e5f0",
        "fullName": "Alice Johnson",
        "email": "alice@example.com",
        "class": "3rd Year",
        "stats": {
          "participation": 5,
          "wins": 2,
          "clusterPoints": 150
        },
        "profilePic": "https://example.com/alice.jpg",
        "badges": ["active-participant", "winner"]
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 2,
      "totalParticipants": 45,
      "limit": 50
    }
  }
}
```

**User Fields Included:**
- `fullName`, `email`, `class`, `srn`
- `stats`: participation count, wins, clusterPoints
- `profilePic`, `badges`

---

### 5. Add Participants Manually

Register users for an event manually (without user request).

```http
POST /admin/event/:id/participants/add
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Parameters:**
- `id`: Event ID (required)

**Request Body:**
```json
{
  "userIds": [
    "67a9c1f2e4b0d2a3c1f2e5f0",
    "67a9c1f2e4b0d2a3c1f2e5f1",
    "67a9c1f2e4b0d2a3c1f2e5f2"
  ]
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Participants added successfully",
  "data": {
    "event": "67a9c1f2e4b0d2a3c1f2e4b1",
    "addedCount": 3,
    "totalParticipants": 28
  }
}
```

**Validation:**
- All users must exist
- Event must be upcoming
- Users must not already be registered
- Adding users must not exceed event capacity
- Admin must be event creator OR in the same cluster

**Error Responses:**
```json
// Capacity exceeded
{
  "success": false,
  "message": "Adding 3 participants would exceed capacity of 50",
  "statusCode": 400
}

// User already registered
{
  "success": false,
  "message": "All users are already registered for this event",
  "statusCode": 409
}

// Permission denied
{
  "success": false,
  "message": "You can only manage participants for events you created or in your cluster",
  "statusCode": 403
}
```

---

### 6. Declare Winners

Announce event winners with rankings and prizes.

```http
POST /admin/event/:id/winners
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Parameters:**
- `id`: Event ID (required)

**Request Body:**
```json
{
  "winners": [
    {
      "userId": "67a9c1f2e4b0d2a3c1f2e5f0",
      "rank": 1,
      "prize": "Gift Voucher - ₹1000",
      "pointsAwarded": 100
    },
    {
      "userId": "67a9c1f2e4b0d2a3c1f2e5f1",
      "rank": 2,
      "prize": "Gift Voucher - ₹500",
      "pointsAwarded": 50
    },
    {
      "userId": "67a9c1f2e4b0d2a3c1f2e5f2",
      "rank": 3,
      "prize": "Certificate",
      "pointsAwarded": 25
    }
  ]
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Winners declared successfully",
  "data": {
    "_id": "67a9c1f2e4b0d2a3c1f2e4b1",
    "title": "Web Development Workshop",
    "eventType": "past",
    "winners": [
      {
        "user": {
          "_id": "67a9c1f2e4b0d2a3c1f2e5f0",
          "fullName": "Alice Johnson",
          "email": "alice@example.com"
        },
        "rank": 1,
        "prize": "Gift Voucher - ₹1000",
        "pointsAwarded": 100
      },
      {
        "user": {
          "_id": "67a9c1f2e4b0d2a3c1f2e5f1",
          "fullName": "Bob Smith",
          "email": "bob@example.com"
        },
        "rank": 2,
        "prize": "Gift Voucher - ₹500",
        "pointsAwarded": 50
      }
    ],
    "cluster": {
      "_id": "67a9c1f2e4b0d2a3c1f2e4b0",
      "name": "Programming"
    }
  }
}
```

**Winner Object Structure:**
- `userId`: User to declare as winner (required)
- `rank`: Position (1-10, required, no duplicates)
- `prize`: Prize description or name (optional)
- `pointsAwarded`: Cluster points to award (optional, default: 0)

**Validation Rules:**
- Maximum 10 winners per event
- All winners must be event participants
- Ranks must be between 1 and 10
- No duplicate ranks allowed
- Admin must be event creator OR in the same cluster

**Side Effects:**
- Event type changed to 'past' (if upcoming/ongoing)
- User stats updated: `wins++`, `clusterPoints += pointsAwarded`
- User achievements may be updated (e.g., "First Winner" badge)

**Error Responses:**
```json
// Exceeds max winners
{
  "success": false,
  "message": "Maximum 10 winners can be declared",
  "statusCode": 400
}

// Invalid rank
{
  "success": false,
  "message": "Rank must be between 1 and 10",
  "statusCode": 400
}

// User not participant
{
  "success": false,
  "message": "User 67a9c1f2e4b0d2a3c1f2e5f0 is not a participant in this event",
  "statusCode": 400
}

// Duplicate ranks
{
  "success": false,
  "message": "Duplicate ranks are not allowed",
  "statusCode": 400
}
```

---

## NOTICE BOARD ENDPOINTS

### 7. Add Notice

Post an announcement or notice to the notice board.

```http
POST /admin/notice/add
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Registration Deadline Extended",
  "message": "The registration deadline for the Web Development Workshop has been extended to February 16, 2024.",
  "category": "announcement",
  "priority": "high",
  "image": "https://example.com/notice-image.jpg",
  "tags": ["registration", "deadline", "workshop"],
  "cluster": "67a9c1f2e4b0d2a3c1f2e4b0",
  "expiresAt": "2024-02-20",
  "relatedEvent": "67a9c1f2e4b0d2a3c1f2e4b1",
  "isPinned": true
}
```

**Request Body Fields:**
- `title`: Notice title (required)
- `message`: Notice content (required)
- `category`: Type of notice (optional, default: "announcement")
  - Enum: `announcement`, `alert`, `update`, `event`, `deadline`, `other`
- `priority`: Importance level (optional, default: "medium")
  - Enum: `low`, `medium`, `high`, `urgent`
- `image`: Cover image URL (optional)
- `tags`: Label array (optional)
- `cluster`: Target cluster ID (optional, null = all clusters)
- `expiresAt`: Expiration date (optional)
- `relatedEvent`: Event ID if notice is about an event (optional)
- `isPinned`: Pin to top (optional, default: false)

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Notice created successfully",
  "data": {
    "_id": "67a9c1f2e4b0d2a3c1f2e4c1",
    "title": "Registration Deadline Extended",
    "message": "The registration deadline for the Web Development Workshop has been extended to February 16, 2024.",
    "postedBy": {
      "_id": "67a9c1f2e4b0d2a3c1f2e3f0",
      "fullName": "Jane Smith",
      "username": "janesmith"
    },
    "category": "announcement",
    "priority": "high",
    "isPinned": true,
    "views": 0,
    "cluster": {
      "_id": "67a9c1f2e4b0d2a3c1f2e4b0",
      "name": "Programming"
    },
    "relatedEvent": {
      "_id": "67a9c1f2e4b0d2a3c1f2e4b1",
      "title": "Web Development Workshop"
    },
    "createdAt": "2024-01-20T10:00:00.000Z"
  }
}
```

---

### 8. Get All Notices

Retrieve all notices with optional filtering and pagination.

```http
GET /admin/notice/all?limit=20&page=1&category=announcement&priority=high
Authorization: Bearer <token>
```

**Query Parameters:**
- `limit`: Results per page (default: 20)
- `page`: Page number (default: 1)
- `category`: Filter by category (optional)
- `priority`: Filter by priority level (optional)
- `cluster`: Filter by cluster (optional)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Notices retrieved successfully",
  "data": {
    "notices": [
      {
        "_id": "67a9c1f2e4b0d2a3c1f2e4c1",
        "title": "Registration Deadline Extended",
        "message": "The registration deadline...",
        "postedBy": {
          "_id": "67a9c1f2e4b0d2a3c1f2e3f0",
          "fullName": "Jane Smith",
          "username": "janesmith"
        },
        "category": "announcement",
        "priority": "high",
        "isPinned": true,
        "views": 125,
        "cluster": {
          "_id": "67a9c1f2e4b0d2a3c1f2e4b0",
          "name": "Programming"
        },
        "createdAt": "2024-01-20T10:00:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalNotices": 95,
      "limit": 20
    }
  }
}
```

**Features:**
- Pinned notices appear first
- Sorted by creation date (newest first)
- Only active notices are returned
- View count included

---

### 9. Edit Notice

Modify an existing notice. Only the poster or master can edit.

```http
PUT /admin/notice/edit/:id
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Parameters:**
- `id`: Notice ID (required)

**Request Body (All optional, only include fields to update):**
```json
{
  "title": "Updated Title",
  "message": "Updated message content",
  "priority": "urgent",
  "isPinned": false,
  "expiresAt": "2024-02-25"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Notice updated successfully",
  "data": {
    "_id": "67a9c1f2e4b0d2a3c1f2e4c1",
    "title": "Updated Title",
    "message": "Updated message content",
    "priority": "urgent",
    "isPinned": false,
    "updatedAt": "2024-01-20T11:30:00.000Z"
  }
}
```

**Permission:**
- Only the notice poster can edit (unless admin is master)

---

### 10. Delete Notice

Remove a notice from the board.

```http
DELETE /admin/notice/delete/:id
Authorization: Bearer <token>
```

**Request Parameters:**
- `id`: Notice ID (required)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Notice deleted successfully",
  "data": {
    "deletedId": "67a9c1f2e4b0d2a3c1f2e4c1"
  }
}
```

**Permission:**
- Only the notice poster can delete (unless admin is master)

---

## STATISTICS ENDPOINTS

### 11. Get Admin Statistics

Retrieve overall statistics including cluster-wise breakdown and totals.

```http
GET /admin/stats
Authorization: Bearer <token>
```

**Response (200 OK) - Master/Superadmin:**
```json
{
  "success": true,
  "message": "Statistics retrieved successfully",
  "data": {
    "overall": {
      "totalEvents": 25,
      "upcomingEvents": 8,
      "pastEvents": 17,
      "totalUsers": 450,
      "totalAdmins": 12,
      "totalNotices": 48,
      "uniqueParticipants": 320,
      "totalWinners": 85
    },
    "clusterWise": [
      {
        "clusterId": "67a9c1f2e4b0d2a3c1f2e4b0",
        "clusterName": "Programming",
        "totalEvents": 10,
        "upcomingEvents": 3,
        "pastEvents": 7,
        "totalParticipants": 145,
        "totalWinners": 35
      },
      {
        "clusterId": "67a9c1f2e4b0d2a3c1f2e4b2",
        "clusterName": "Design",
        "totalEvents": 8,
        "upcomingEvents": 2,
        "pastEvents": 6,
        "totalParticipants": 120,
        "totalWinners": 28
      }
    ],
    "adminScope": "all"
  }
}
```

**Response (200 OK) - Regular Admin (shows only their cluster in overview):**
```json
{
  "success": true,
  "message": "Statistics retrieved successfully",
  "data": {
    "overall": {
      "totalEvents": 10,
      "upcomingEvents": 3,
      "pastEvents": 7,
      "totalUsers": 450,
      "totalAdmins": 12,
      "totalNotices": 48,
      "uniqueParticipants": 145,
      "totalWinners": 35
    },
    "clusterWise": [
      {
        "clusterId": "67a9c1f2e4b0d2a3c1f2e4b0",
        "clusterName": "Programming",
        "totalEvents": 10,
        "upcomingEvents": 3,
        "pastEvents": 7,
        "totalParticipants": 145,
        "totalWinners": 35
      }
    ],
    "userCluster": "67a9c1f2e4b0d2a3c1f2e4b0",
    "adminScope": "cluster"
  }
}
```

**Statistics Included:**
- **Overall Stats**: Total events, users, admins, notices, unique participants, total winners
- **Cluster-wise Stats**: Per-cluster event count, participant count, winner count
- **Scope Indicator**: "all" for master/superadmin, "cluster" for regular admin

---

### 12. Get Cluster Statistics

Detailed statistics for a specific cluster.

```http
GET /admin/stats/cluster/:clusterId
Authorization: Bearer <token>
```

**Request Parameters:**
- `clusterId`: Cluster ID (required)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Cluster statistics retrieved successfully",
  "data": {
    "cluster": {
      "_id": "67a9c1f2e4b0d2a3c1f2e4b0",
      "name": "Programming",
      "memberCount": 145
    },
    "events": {
      "total": 10,
      "upcoming": 3,
      "past": 7
    },
    "participants": {
      "unique": 120
    },
    "winners": 35,
    "topEvents": [
      {
        "_id": "67a9c1f2e4b0d2a3c1f2e4b1",
        "title": "Web Development Workshop",
        "participants": 45,
        "eventType": "past",
        "date": "2024-01-15T00:00:00.000Z"
      },
      {
        "_id": "67a9c1f2e4b0d2a3c1f2e4b2",
        "title": "Python Basics",
        "participants": 38,
        "eventType": "past",
        "date": "2024-01-10T00:00:00.000Z"
      }
    ]
  }
}
```

**Features:**
- Total and breakdown of events by type
- Unique participant count
- Total winners
- Top 5 events by participation

**Permission:**
- Regular admins can only view their own cluster
- Masters can view any cluster

**Error Responses:**
```json
// Cluster not found
{
  "success": false,
  "message": "Cluster not found",
  "statusCode": 404
}

// Permission denied
{
  "success": false,
  "message": "You can only view stats for your cluster",
  "statusCode": 403
}
```

---

## Authorization & Permission Model

### Admin Roles

1. **Regular Admin**
   - Can manage events, notices, and participants in their assigned cluster only
   - Can view statistics for their cluster
   - Cannot manage events outside their cluster
   - Cannot edit/delete notices posted by other admins

2. **Master/Superadmin**
   - Unrestricted access to all clusters and events
   - Can manage any event regardless of creator
   - Can view global statistics
   - Can edit/delete any notice

### Permission Checks

**Event Management:**
```
Allowed if: 
  - User is Master, OR
  - User created the event AND event is upcoming, OR
  - User is in same cluster as event AND event is upcoming
```

**Notice Management:**
```
Allowed if:
  - User is Master, OR
  - User posted the notice
```

**Participant Management:**
```
Allowed if:
  - User is Master, OR
  - User created the event AND event is upcoming, OR
  - User is in same cluster as event AND event is upcoming
```

---

## Common HTTP Status Codes

| Code | Meaning | Use Case |
|------|---------|----------|
| 200 | OK | Successful GET, PUT, DELETE |
| 201 | Created | Successful POST |
| 400 | Bad Request | Invalid input data, validation failed |
| 401 | Unauthorized | Missing or invalid JWT token |
| 403 | Forbidden | Insufficient permissions (wrong role or not creator) |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Resource already exists or operation conflicts |
| 500 | Internal Server Error | Unexpected server error |

---

## Error Response Format

All error responses follow this format:

```json
{
  "success": false,
  "message": "Error description",
  "statusCode": 400
}
```

---

## Rate Limiting & Throttling

Currently not implemented. Future versions may include:
- Request rate limiting per admin
- Event creation/deletion throttling
- Notice posting frequency limits

---

## Example Usage Workflows

### Workflow 1: Create and Manage an Event

```bash
# 1. Create event
curl -X POST http://localhost:5000/api/admin/event/add \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"title":"Workshop","description":"...","cluster":"...","date":"2024-02-15",...}'

# 2. Add participants
curl -X POST http://localhost:5000/api/admin/event/:eventId/participants/add \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"userIds":["userId1","userId2",...]}' 

# 3. Get participants
curl -X GET http://localhost:5000/api/admin/event/:eventId/participants \
  -H "Authorization: Bearer <token>"

# 4. Declare winners
curl -X POST http://localhost:5000/api/admin/event/:eventId/winners \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"winners":[{"userId":"...","rank":1,"prize":"...","pointsAwarded":100},...]}' 

# 5. View stats
curl -X GET http://localhost:5000/api/admin/stats \
  -H "Authorization: Bearer <token>"
```

### Workflow 2: Post and Update Notices

```bash
# 1. Post notice
curl -X POST http://localhost:5000/api/admin/notice/add \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"title":"Notice","message":"...","category":"announcement",...}'

# 2. Get all notices
curl -X GET "http://localhost:5000/api/admin/notice/all?limit=20&page=1" \
  -H "Authorization: Bearer <token>"

# 3. Edit notice
curl -X PUT http://localhost:5000/api/admin/notice/edit/:noticeId \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"priority":"high","isPinned":true}'

# 4. Delete notice
curl -X DELETE http://localhost:5000/api/admin/notice/delete/:noticeId \
  -H "Authorization: Bearer <token>"
```

---

## Security Considerations

1. **Authentication**: All endpoints require valid JWT token
2. **Authorization**: Role and cluster-based access control enforced
3. **Input Validation**: All inputs validated against schema
4. **Data Isolation**: Admins can only access their cluster's data (except masters)
5. **Audit Trail**: All admin actions logged with admin ID and timestamp
6. **Event Type Restrictions**: Only upcoming events can be created/edited/deleted

---

## Integration with User APIs

These admin APIs work in conjunction with user APIs:

- **Event Creation** (Admin) → Users can register (User API)
- **Winner Declaration** (Admin) → User stats updated automatically
- **Notice Posting** (Admin) → Users view notices (User API)
- **Statistics** (Admin) → Based on data from user participation

---

## Future Enhancements

1. **Event Analytics**: Advanced metrics and participant engagement tracking
2. **Bulk Operations**: Bulk participant management and winner declaration
3. **Event Templates**: Save event templates for recurring events
4. **Notification System**: Notify admins and users of important events
5. **Audit Logging**: Detailed audit trail of all admin actions
6. **Export Features**: Export event reports, participant lists, statistics as CSV/PDF
7. **Event Scheduling**: Auto-publish events on specific dates
8. **Advanced Filters**: More sophisticated notice and event filtering

---

## Support & Troubleshooting

**Common Issues:**

1. **"Admin not found or inactive"**
   - Ensure your admin account exists and is active
   - Check admin ID in JWT token

2. **"Can only manage events in your cluster"**
   - Regular admins are cluster-specific
   - Contact your Master admin to create events in other clusters

3. **"Duplicate ranks"**
   - Each winner must have a unique rank (1-10)
   - No two winners can have the same rank

4. **Token expired**
   - Refresh your JWT token
   - Re-login to get a new token

---

## Version History

- **v1.0** (January 2024): Initial release with 12 core admin endpoints

