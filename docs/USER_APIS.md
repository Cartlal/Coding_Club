# User-Facing APIs Documentation

Complete reference for all user-facing API endpoints in the Coding Club backend.

## Overview

All user-facing endpoints are protected with:
- `authMiddleware` - Requires valid JWT token
- `roleMiddleware(['user'])` - Restricts access to users with 'user' role only

Base URL: `/api/users`

## Endpoints

### 1. Get User Profile with QR Code

**Endpoint:** `GET /user/profile`

**Authentication:** Required (JWT + User role)

**Description:** 
Retrieves complete user profile with:
- User details (name, email, class, cluster)
- QR code (generated on-the-fly from user JSON)
- Statistics (wins, participation, cluster points)
- Progress tracking (badges, participation, wins)
- Achievements and earned badges

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "user_id",
    "fullName": "John Doe",
    "email": "john@example.com",
    "profilePic": "url",
    "srn": "student_reg_number",
    "class": {
      "year": 2,
      "branch": "CSE",
      "division": "A"
    },
    "cluster": {
      "_id": "cluster_id",
      "name": "Web Dev",
      "icon": "🌐",
      "color": "#3498db"
    },
    "bio": "Student bio",
    "qrCode": "data:image/png;base64,...", // QR code as data URL
    "stats": {
      "wins": 3,
      "participation": 12,
      "clusterPoints": 450
    },
    "progress": {
      "badges": {
        "earned": 8,
        "total": 25,
        "percentage": 32
      },
      "participation": {
        "count": 12,
        "target": 25,
        "percentage": 48
      },
      "wins": {
        "count": 3,
        "target": 10,
        "percentage": 30
      }
    },
    "badges": ["🏅", "⭐", "💡"],
    "achievements": ["First win", "10 events"],
    "eventsParticipated": 12,
    "createdAt": "2024-01-15T10:30:00Z",
    "lastLogin": "2024-01-20T14:45:00Z"
  }
}
```

**Error Responses:**
- `404` - User not found

---

### 2. Get User Statistics

**Endpoint:** `GET /user/stats`

**Authentication:** Required (JWT + User role)

**Description:**
Retrieves user statistics and calculated metrics.

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "stats": {
      "wins": 3,
      "participation": 12,
      "clusterPoints": 450
    },
    "summary": {
      "totalContribution": 15,
      "averagePointsPerEvent": 38,
      "winRate": 25
    }
  }
}
```

**Metrics:**
- `totalContribution` = wins + participation count
- `averagePointsPerEvent` = clusterPoints / participation (or 0)
- `winRate` = (wins / participation) × 100 percentage

---

### 3. Get User Badges with Auto-Assignment

**Endpoint:** `GET /user/badges`

**Authentication:** Required (JWT + User role)

**Description:**
Returns all 25 possible badges with earned status. **Auto-assigns** badges based on achievement rules on each request.

**25 Available Badges:**
```
🏆 Champion         🥇 First Place      🥈 Second Place    🥉 Third Place
⚡ Lightning Fast    💻 Code Master      🧠 Brain Power     🚀 Rocket Launcher
🎯 Bullseye         🔥 On Fire          ⭐ Star Performer  👑 Crowned
🎨 Creative Designer 🔐 Security Expert  📊 Data Analyst   🌟 Rising Star
💡 Innovator        🎓 Scholar          🏅 Achiever        ✨ Brilliant
🎪 Event Master     🤝 Team Player      📈 Growth Mindset  🔬 Researcher
🎭 Multi-talented
```

**Badge Assignment Rules:**

| Badge | Condition | Description |
|-------|-----------|-------------|
| 🎯 Bullseye | participation >= 5 | Participated in 5+ events |
| 🤝 Team Player | participation >= 10 | Participated in 10+ events |
| 🎪 Event Master | participation >= 25 | Participated in 25+ events |
| 🥉 Third Place | wins >= 1 | Won 1 event (3rd place+) |
| 🥈 Second Place | wins >= 2 | Won 2+ events (2nd place+) |
| 🥇 First Place | wins >= 3 | Won 3+ events (1st place) |
| 🏆 Champion | wins >= 5 | Won 5+ events (1st place) |
| 💻 Code Master | clusterPoints >= 100 | Earned 100+ cluster points |
| 🚀 Rocket Launcher | clusterPoints >= 250 | Earned 250+ cluster points |
| 🔥 On Fire | participation >= 10 && wins >= 2 | Active with multiple wins |
| 🌟 Rising Star | participation >= 15 && wins >= 1 | Consistent participation |
| ⭐ Star Performer | wins >= 3 && clusterPoints >= 150 | Excellent overall |
| 🏅 Achiever | participation >= 5 | First milestone |
| ⚡ Lightning Fast | wins >= 1 | Quick learner |
| 🧠 Brain Power | clusterPoints >= 50 | Intellectual contribution |
| 👑 Crowned | wins >= 5 && clusterPoints >= 200 | Ultimate champion |
| 🎨 Creative Designer | badges.length >= 5 | Diverse skill set |
| 🔐 Security Expert | participation >= 8 | Security-focused |
| 📊 Data Analyst | clusterPoints >= 75 | Data-driven approach |
| 💡 Innovator | wins >= 2 | Problem solver |
| 🎓 Scholar | participation >= 12 | Dedicated learner |
| ✨ Brilliant | wins >= 4 && participation >= 10 | Exceptional achievement |
| 📈 Growth Mindset | participation >= 8 && wins >= 1 | Continuously improving |
| 🔬 Researcher | clusterPoints >= 120 | Research-oriented |
| 🎭 Multi-talented | badges.length >= 8 | Master of multiple skills |

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe"
    },
    "summary": {
      "totalEarned": 8,
      "totalAvailable": 25,
      "percentage": 32,
      "newlyEarned": 2
    },
    "badges": {
      "earned": [
        {
          "emoji": "🏅",
          "name": "Achiever",
          "earned": true,
          "description": "Took the first step towards success",
          "conditionMet": true,
          "earnedAt": 0
        }
      ],
      "available": [
        {
          "emoji": "🏆",
          "name": "Champion",
          "earned": false,
          "description": "Won 5+ events (1st place)",
          "conditionMet": false,
          "earnedAt": null
        }
      ],
      "all": [/* all 25 badges with earned status */]
    }
  }
}
```

---

### 4. Get Global Leaderboard

**Endpoint:** `GET /user/leaderboard?limit=100&page=1&sortBy=clusterPoints`

**Authentication:** Required (JWT + User role)

**Query Parameters:**
- `limit` (default: 100) - Results per page
- `page` (default: 1) - Page number for pagination
- `sortBy` (default: clusterPoints) - Sort field: `clusterPoints`, `wins`, `participation`, `name`

**Description:**
Global leaderboard ranking all users by points. Current user is highlighted in response.

**Response:**
```json
{
  "success": true,
  "data": {
    "leaderboard": [
      {
        "_id": "user_id",
        "fullName": "Alice Smith",
        "email": "alice@example.com",
        "class": {
          "year": 2,
          "branch": "CSE",
          "division": "A"
        },
        "stats": {
          "wins": 5,
          "participation": 20,
          "clusterPoints": 750
        },
        "badges": ["🏆", "🥇", "⭐"],
        "profilePic": "url",
        "srn": "1234567890",
        "rank": 1,
        "isCurrentUser": false
      },
      {
        "_id": "current_user_id",
        "fullName": "John Doe",
        "rank": 5,
        "isCurrentUser": true,
        "stats": {
          "wins": 3,
          "participation": 12,
          "clusterPoints": 450
        }
        // ... other fields
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalUsers": 250,
      "limit": 100
    },
    "currentUserRank": 5
  }
}
```

---

### 5. Get Class-Wise Leaderboard

**Endpoint:** `GET /user/class-leaderboard?limit=50&page=1`

**Authentication:** Required (JWT + User role)

**Query Parameters:**
- `limit` (default: 50) - Results per page
- `page` (default: 1) - Page number for pagination

**Description:**
Leaderboard for user's specific class (year, branch, division). Current user is highlighted.

**Response:**
```json
{
  "success": true,
  "data": {
    "class": {
      "year": 2,
      "branch": "CSE",
      "division": "A"
    },
    "leaderboard": [
      {
        "_id": "user_id",
        "fullName": "Alice Smith",
        "email": "alice@example.com",
        "class": { "year": 2, "branch": "CSE", "division": "A" },
        "stats": {
          "wins": 5,
          "participation": 20,
          "clusterPoints": 750
        },
        "badges": ["🏆", "🥇"],
        "rank": 1,
        "isCurrentUser": false
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 2,
      "totalUsers": 45,
      "limit": 50
    },
    "currentUserRank": 5
  }
}
```

---

### 6. Register for Event

**Endpoint:** `POST /user/event/:eventId/register`

**Authentication:** Required (JWT + User role)

**URL Parameters:**
- `eventId` - Event ID to register for

**Request Body:** (Empty or no specific fields required)
```json
{}
```

**Description:**
Register logged-in user for an upcoming event. Validates:
- Event exists
- Event is in 'upcoming' status
- User not already registered
- Event capacity not reached
- Registration deadline not passed

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "event": {
      "_id": "event_id",
      "title": "Web Dev Hackathon",
      "date": "2024-02-15T10:00:00Z",
      "location": "Auditorium"
    },
    "user": {
      "_id": "user_id",
      "fullName": "John Doe"
    },
    "status": "registered",
    "participantCount": 45,
    "message": "Successfully registered for event"
  }
}
```

**Error Responses:**
- `404` - Event not found
- `400` - Can only register for upcoming events
- `409` - Already registered for this event
- `400` - Event capacity reached
- `400` - Registration deadline passed

---

### 7. Get User's Events

**Endpoint:** `GET /user/events?status=all`

**Authentication:** Required (JWT + User role)

**Query Parameters:**
- `status` (default: all) - Filter: `upcoming`, `past`, `all`

**Description:**
Get all events user has registered for, filtered by event status.

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id"
    },
    "events": [
      {
        "_id": "event_id",
        "title": "Web Dev Hackathon",
        "date": "2024-02-15T10:00:00Z",
        "type": "upcoming",
        "cluster": {
          "_id": "cluster_id",
          "name": "Web Dev"
        },
        "location": "Auditorium",
        "category": "hackathon"
      }
    ],
    "summary": {
      "total": 8,
      "upcoming": 3,
      "past": 5
    }
  }
}
```

---

### 8. Unregister from Event

**Endpoint:** `DELETE /user/event/:eventId/register`

**Authentication:** Required (JWT + User role)

**URL Parameters:**
- `eventId` - Event ID to unregister from

**Description:**
Remove user from event participant list. Can only unregister from upcoming events.

**Response:**
```json
{
  "success": true,
  "data": {
    "event": "Web Dev Hackathon",
    "status": "unregistered"
  }
}
```

**Error Responses:**
- `404` - Event not found
- `404` - User not registered for this event
- `400` - Can only unregister from upcoming events

---

## Public Endpoints (No Authentication Required)

### Get All Members

**Endpoint:** `GET /members?page=1&limit=10&branch=CSE&year=2&search=john`

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Results per page (default: 10)
- `branch` - Filter by branch
- `year` - Filter by year
- `search` - Search by name or email

### Get Member by ID

**Endpoint:** `GET /members/:id`

### Get Faculty Members

**Endpoint:** `GET /faculty?search=dr`

---

## Error Handling

All errors follow standard format:

```json
{
  "success": false,
  "error": "Error message",
  "statusCode": 400
}
```

Common HTTP Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict (e.g., already registered)
- `500` - Server Error

---

## Authentication

### JWT Token Required

Include token in request header:
```
Authorization: Bearer <your_jwt_token>
```

Token is obtained from login endpoints:
- `POST /auth/login` - User login
- `POST /auth/admin/login` - Admin login

---

## Badge System Details

The badge system is **automatic and dynamic**:
- Badges are auto-assigned on each profile/badge request
- System checks all 25 badge conditions against user stats
- New badges are added automatically as conditions are met
- Maximum 25 badges per user
- Each badge has unique condition and description

**Key Points:**
- Badges earned based on actual achievements
- No manual intervention needed
- System updates on every request
- Provides motivation through progressive unlocking
- Visible on profile and leaderboards

---

## Rate Limiting

No rate limiting currently implemented. Consider adding:
- 100 requests per 15 minutes per user IP
- More restrictive for registration endpoints

---

## Examples

### Complete User Journey

1. **User logs in:**
   ```
   POST /auth/login
   → Receive JWT token
   ```

2. **User views profile:**
   ```
   GET /user/profile
   → See QR code, stats, badges, progress
   ```

3. **User checks stats:**
   ```
   GET /user/stats
   → See wins, participation, points, metrics
   ```

4. **User views global leaderboard:**
   ```
   GET /user/leaderboard
   → See ranking, points, highlighted position
   ```

5. **User views class leaderboard:**
   ```
   GET /user/class-leaderboard
   → See class ranking
   ```

6. **User registers for event:**
   ```
   POST /user/event/:eventId/register
   → Confirmation of registration
   ```

7. **User views registered events:**
   ```
   GET /user/events
   → See all registered events
   ```

8. **User checks badges (auto-assigned):**
   ```
   GET /user/badges
   → See all 25 badges with earned status
   → System auto-assigns any newly earned badges
   ```

---

## Implementation Notes

- QR code generated on-the-fly using `qrcode` library
- Contains: user ID, name, email, SRN, class, points, badge count
- All timestamps in ISO 8601 format
- Pagination supports 1-based indexing
- Database queries optimized with proper field selection
- Error handling with appropriate HTTP status codes
