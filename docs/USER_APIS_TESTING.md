# User API Testing Guide

Quick reference for testing user-facing APIs with cURL or Postman.

## Setup

1. Get JWT token from login:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

Store the token returned in the response.

2. Set environment variable (for convenience):
```bash
export TOKEN="your_jwt_token_here"
```

Or in Postman, create a collection variable `{{token}}`.

---

## Test Endpoints

### 1. Get User Profile with QR Code
```bash
curl -X GET http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response:** 200 OK with qrCode data URL

---

### 2. Get User Statistics
```bash
curl -X GET http://localhost:5000/api/users/stats \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response:** 200 OK with wins, participation, clusterPoints

---

### 3. Get User Badges
```bash
curl -X GET http://localhost:5000/api/users/badges \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response:** 200 OK with all 25 badges, earned status, and auto-assignment results

---

### 4. Get Global Leaderboard
```bash
curl -X GET "http://localhost:5000/api/users/leaderboard?limit=10&page=1&sortBy=clusterPoints" \
  -H "Authorization: Bearer $TOKEN"
```

**Query Parameters:**
- `limit=10` - Show 10 users per page
- `page=1` - First page
- `sortBy=clusterPoints` - Sort by cluster points (alternatives: wins, participation, name)

**Expected Response:** 200 OK with ranked user list, current user highlighted

---

### 5. Get Class Leaderboard
```bash
curl -X GET "http://localhost:5000/api/users/class-leaderboard?limit=50&page=1" \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response:** 200 OK with class-filtered leaderboard

---

### 6. Get User Events
```bash
curl -X GET "http://localhost:5000/api/users/events?status=all" \
  -H "Authorization: Bearer $TOKEN"
```

**Query Parameters:**
- `status=all` - All events (alternatives: upcoming, past)

**Expected Response:** 200 OK with user's registered events

---

### 7. Register for Event
```bash
curl -X POST http://localhost:5000/api/users/event/EVENT_ID/register \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{}'
```

Replace `EVENT_ID` with actual event ID.

**Expected Response:** 201 Created with registration confirmation

---

### 8. Unregister from Event
```bash
curl -X DELETE http://localhost:5000/api/users/event/EVENT_ID/register \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response:** 200 OK with unregistration confirmation

---

## Postman Collection Template

Import this as a Postman collection:

```json
{
  "info": {
    "name": "User APIs",
    "description": "Coding Club User-facing APIs"
  },
  "item": [
    {
      "name": "Get Profile",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{token}}"
          }
        ],
        "url": {
          "raw": "{{baseUrl}}/users/profile",
          "host": ["{{baseUrl}}"],
          "path": ["users", "profile"]
        }
      }
    },
    {
      "name": "Get Stats",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{token}}"
          }
        ],
        "url": {
          "raw": "{{baseUrl}}/users/stats",
          "host": ["{{baseUrl}}"],
          "path": ["users", "stats"]
        }
      }
    },
    {
      "name": "Get Badges",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{token}}"
          }
        ],
        "url": {
          "raw": "{{baseUrl}}/users/badges",
          "host": ["{{baseUrl}}"],
          "path": ["users", "badges"]
        }
      }
    },
    {
      "name": "Get Leaderboard",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{token}}"
          }
        ],
        "url": {
          "raw": "{{baseUrl}}/users/leaderboard?limit=10&page=1&sortBy=clusterPoints",
          "host": ["{{baseUrl}}"],
          "path": ["users", "leaderboard"],
          "query": [
            {"key": "limit", "value": "10"},
            {"key": "page", "value": "1"},
            {"key": "sortBy", "value": "clusterPoints"}
          ]
        }
      }
    },
    {
      "name": "Get Class Leaderboard",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{token}}"
          }
        ],
        "url": {
          "raw": "{{baseUrl}}/users/class-leaderboard?limit=50&page=1",
          "host": ["{{baseUrl}}"],
          "path": ["users", "class-leaderboard"],
          "query": [
            {"key": "limit", "value": "50"},
            {"key": "page", "value": "1"}
          ]
        }
      }
    },
    {
      "name": "Get User Events",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{token}}"
          }
        ],
        "url": {
          "raw": "{{baseUrl}}/users/events?status=all",
          "host": ["{{baseUrl}}"],
          "path": ["users", "events"],
          "query": [
            {"key": "status", "value": "all"}
          ]
        }
      }
    },
    {
      "name": "Register for Event",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{token}}"
          },
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{}"
        },
        "url": {
          "raw": "{{baseUrl}}/users/event/EVENT_ID/register",
          "host": ["{{baseUrl}}"],
          "path": ["users", "event", "EVENT_ID", "register"]
        }
      }
    },
    {
      "name": "Unregister from Event",
      "request": {
        "method": "DELETE",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{token}}"
          }
        ],
        "url": {
          "raw": "{{baseUrl}}/users/event/EVENT_ID/register",
          "host": ["{{baseUrl}}"],
          "path": ["users", "event", "EVENT_ID", "register"]
        }
      }
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:5000/api"
    },
    {
      "key": "token",
      "value": ""
    }
  ]
}
```

---

## Common Test Scenarios

### Scenario 1: New User Registration Flow

1. Register new user (POST /auth/register)
2. Login to get token (POST /auth/login)
3. View profile (GET /user/profile) - Should have 0 badges, 0 stats
4. Get badges (GET /user/badges) - No badges earned yet
5. Check leaderboard (GET /user/leaderboard) - Should appear at bottom

### Scenario 2: Event Registration

1. Get leaderboard (GET /user/leaderboard) - See available events
2. Register for event (POST /user/event/:eventId/register)
3. View user events (GET /user/events?status=upcoming)
4. Check stats (GET /user/stats) - participation should increase by 1
5. Unregister (DELETE /user/event/:eventId/register)
6. Check stats again - participation should decrease

### Scenario 3: Badge Progression

1. Get profile (GET /user/profile) - baseline stats
2. Update user stats (admin endpoint) - set participation to 5
3. Get badges (GET /user/badges) - Should auto-assign "Bullseye" badge
4. Check profile (GET /user/profile) - Badge count increased
5. Repeat for different badge thresholds

---

## Troubleshooting

### 401 Unauthorized
- Check token is valid and not expired
- Verify Authorization header format: `Bearer <token>`
- Ensure user role is 'user' (not 'admin' or 'master')

### 403 Forbidden
- User role doesn't match endpoint requirement
- Check roleMiddleware is correctly applied

### 404 Not Found
- Event ID doesn't exist
- User not found
- Check endpoint path spelling

### 400 Bad Request
- Event not upcoming (for registration)
- User already registered for event
- Event capacity reached
- Registration deadline passed

### 409 Conflict
- User already registered for event (registration endpoint)

---

## Performance Tips

1. **Leaderboard:** Use `limit=50` for faster response
2. **Badges:** Endpoint is computationally intensive - cache in frontend if possible
3. **QR Code:** Generated on-the-fly, can be cached by frontend
4. **Events:** Use `status` filter to reduce data transfer

---

## Expected Database State for Testing

```javascript
// Sample test user data
{
  fullName: "Test User",
  email: "test@example.com",
  srn: "1234567890",
  class: { year: 2, branch: "CSE", division: "A" },
  stats: {
    wins: 3,
    participation: 12,
    clusterPoints: 450
  },
  badges: ["🏅", "⭐", "💡"],
  achievements: ["First win", "10 events"],
  eventsParticipated: ["event_id_1", "event_id_2"]
}

// Sample event data
{
  title: "Web Dev Hackathon",
  date: new Date("2024-02-15"),
  eventType: "upcoming",
  participants: ["user_id_1", "user_id_2"],
  capacity: 100
}
```

---

## Notes

- All timestamps are in ISO 8601 format
- QR code is generated fresh on each request
- Badges are auto-assigned on each badges endpoint call
- Leaderboard updates are real-time
- No caching on these endpoints (always fresh data)
