# Admin APIs Testing Guide

## Setup & Prerequisites

### Required

1. **MongoDB**: Running and connected
2. **JWT Token**: Valid admin token from login endpoint
3. **Admin Account**: Created with proper cluster assignment
4. **Postman/Insomnia**: API testing tool
5. **Test Clusters**: Create test clusters first
6. **Test Users**: Create regular users for testing participant management

### Environment Variables

```env
BASE_URL=http://localhost:5000/api
ADMIN_TOKEN=<your_jwt_token_from_login>
EVENT_ID=<test_event_id>
NOTICE_ID=<test_notice_id>
CLUSTER_ID=<test_cluster_id>
USER_ID=<test_user_id>
```

---

## Test Data Setup

### Step 1: Create Test Clusters

```json
POST /admin/cluster/create (if endpoint exists) or create via MongoDB
{
  "name": "Programming",
  "icon": "💻",
  "color": "#3b82f6",
  "description": "Programming and web development cluster"
}

{
  "name": "Design",
  "icon": "🎨",
  "color": "#ec4899",
  "description": "UI/UX and graphic design cluster"
}
```

### Step 2: Create Admin Account

```bash
# Via signup or admin creation endpoint
POST /auth/signup-admin
{
  "fullName": "Test Admin",
  "username": "testadmin",
  "email": "testadmin@example.com",
  "password": "TestPassword123!",
  "cluster": "67a9c1f2e4b0d2a3c1f2e4b0",
  "role": "admin"
}
```

### Step 3: Login and Get Token

```bash
POST /auth/login
{
  "email": "testadmin@example.com",
  "password": "TestPassword123!"
}

# Response contains token
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Step 4: Create Test Users

```bash
# Create multiple users via user signup or admin bulk create
POST /users/create (or similar)
[
  {"fullName":"Alice","email":"alice@example.com","class":"3rd Year"},
  {"fullName":"Bob","email":"bob@example.com","class":"2nd Year"},
  {"fullName":"Charlie","email":"charlie@example.com","class":"1st Year"}
]
```

---

## Test Cases

### Test Suite 1: Event Management

#### 1.1 Add Event - Success Case

**Test**: Create a new upcoming event with valid data

```bash
POST /admin/event/add
Authorization: Bearer {{ADMIN_TOKEN}}
Content-Type: application/json

{
  "title": "Test Web Development Workshop",
  "description": "A comprehensive workshop on modern web development",
  "cluster": "{{CLUSTER_ID}}",
  "date": "2024-02-25",
  "time": {
    "startTime": "14:00",
    "endTime": "16:00"
  },
  "location": "Lab 101, Building A",
  "category": "Workshop",
  "image": null,
  "details": "Learn React, Node.js, and MongoDB",
  "instructor": "John Doe",
  "capacity": 50,
  "registrationDeadline": "2024-02-24",
  "requirements": ["JavaScript basics"],
  "tags": ["web", "frontend", "react"]
}
```

**Expected Response**: 201 Created
```json
{
  "success": true,
  "message": "Event created successfully",
  "data": {
    "_id": "<new_event_id>",
    "title": "Test Web Development Workshop",
    "date": "2024-02-25T00:00:00.000Z",
    "eventType": "upcoming",
    "capacity": 50,
    "participants": [],
    "winners": []
  }
}
```

**Validation**:
- ✓ Status code is 201
- ✓ Response has success: true
- ✓ Event ID generated
- ✓ eventType is "upcoming"
- ✓ participants array is empty
- ✓ createdBy matches admin ID

---

#### 1.2 Add Event - Past Date Validation

**Test**: Try creating event with past date (should fail)

```bash
POST /admin/event/add
Authorization: Bearer {{ADMIN_TOKEN}}
Content-Type: application/json

{
  "title": "Past Event",
  "description": "Event in the past",
  "cluster": "{{CLUSTER_ID}}",
  "date": "2020-01-01",
  "time": {"startTime": "14:00", "endTime": "16:00"},
  "location": "Lab 101",
  "capacity": 50
}
```

**Expected Response**: 400 Bad Request
```json
{
  "success": false,
  "message": "Event date must be in the future for upcoming events",
  "statusCode": 400
}
```

**Validation**:
- ✓ Status code is 400
- ✓ success: false
- ✓ Appropriate error message

---

#### 1.3 Add Event - Invalid Cluster

**Test**: Try creating event with non-existent cluster

```bash
POST /admin/event/add
Authorization: Bearer {{ADMIN_TOKEN}}
Content-Type: application/json

{
  "title": "Event",
  "description": "...",
  "cluster": "invalid_cluster_id",
  "date": "2024-02-25",
  "time": {"startTime": "14:00", "endTime": "16:00"},
  "capacity": 50
}
```

**Expected Response**: 404 Not Found
```json
{
  "success": false,
  "message": "Cluster not found",
  "statusCode": 404
}
```

---

#### 1.4 Edit Event - Success Case

**Test**: Update event details (only upcoming events)

```bash
PUT /admin/event/edit/{{EVENT_ID}}
Authorization: Bearer {{ADMIN_TOKEN}}
Content-Type: application/json

{
  "title": "Updated Workshop Title",
  "capacity": 60,
  "location": "Lab 102, Building B",
  "tags": ["web", "advanced", "mern"]
}
```

**Expected Response**: 200 OK
```json
{
  "success": true,
  "message": "Event updated successfully",
  "data": {
    "_id": "{{EVENT_ID}}",
    "title": "Updated Workshop Title",
    "capacity": 60,
    "location": "Lab 102, Building B"
  }
}
```

**Validation**:
- ✓ Only upcoming events can be edited
- ✓ Changes reflected in response
- ✓ Admin must be creator or in same cluster

---

#### 1.5 Edit Event - Non-Upcoming Event

**Test**: Try editing a past event (should fail)

**Setup**: First, create and mark an event as past

```bash
PUT /admin/event/edit/{{PAST_EVENT_ID}}
Authorization: Bearer {{ADMIN_TOKEN}}
Content-Type: application/json

{
  "title": "Updated Past Event"
}
```

**Expected Response**: 400 Bad Request
```json
{
  "success": false,
  "message": "Can only edit upcoming events",
  "statusCode": 400
}
```

---

#### 1.6 Edit Event - Permission Denied

**Test**: Regular admin edits event from different cluster

**Setup**: Create event in cluster A, login as admin from cluster B

```bash
PUT /admin/event/edit/{{CLUSTER_A_EVENT_ID}}
Authorization: Bearer {{CLUSTER_B_ADMIN_TOKEN}}
Content-Type: application/json

{
  "title": "Unauthorized Edit"
}
```

**Expected Response**: 403 Forbidden
```json
{
  "success": false,
  "message": "You can only edit events you created or in your cluster",
  "statusCode": 403
}
```

---

#### 1.7 Delete Event - Success Case

**Test**: Delete an upcoming event

```bash
DELETE /admin/event/delete/{{EVENT_ID}}
Authorization: Bearer {{ADMIN_TOKEN}}
```

**Expected Response**: 200 OK
```json
{
  "success": true,
  "message": "Event deleted successfully",
  "data": {
    "deletedId": "{{EVENT_ID}}"
  }
}
```

**Validation**:
- ✓ Event removed from database
- ✓ Verify with GET (should 404)

---

#### 1.8 Delete Event - Non-Upcoming Event

**Test**: Try deleting a past event

```bash
DELETE /admin/event/delete/{{PAST_EVENT_ID}}
Authorization: Bearer {{ADMIN_TOKEN}}
```

**Expected Response**: 400 Bad Request
```json
{
  "success": false,
  "message": "Can only delete upcoming events",
  "statusCode": 400
}
```

---

### Test Suite 2: Participant Management

#### 2.1 Get Event Participants

**Test**: Retrieve all participants for an event with pagination

```bash
GET /admin/event/{{EVENT_ID}}/participants?limit=10&page=1
Authorization: Bearer {{ADMIN_TOKEN}}
```

**Expected Response**: 200 OK
```json
{
  "success": true,
  "message": "Event participants retrieved successfully",
  "data": {
    "event": {
      "_id": "{{EVENT_ID}}",
      "title": "Test Workshop",
      "capacity": 50
    },
    "participants": [
      {
        "_id": "user_id_1",
        "fullName": "Alice Johnson",
        "email": "alice@example.com",
        "class": "3rd Year",
        "stats": {...},
        "badges": [...]
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 2,
      "totalParticipants": 15,
      "limit": 10
    }
  }
}
```

**Validation**:
- ✓ Pagination works correctly
- ✓ User fields populated
- ✓ Stats and badges included

---

#### 2.2 Add Participants - Success Case

**Test**: Manually add users to event

```bash
POST /admin/event/{{EVENT_ID}}/participants/add
Authorization: Bearer {{ADMIN_TOKEN}}
Content-Type: application/json

{
  "userIds": [
    "{{USER_ID_1}}",
    "{{USER_ID_2}}",
    "{{USER_ID_3}}"
  ]
}
```

**Expected Response**: 200 OK
```json
{
  "success": true,
  "message": "Participants added successfully",
  "data": {
    "event": "{{EVENT_ID}}",
    "addedCount": 3,
    "totalParticipants": 3
  }
}
```

**Validation**:
- ✓ Users added to event
- ✓ User stats updated (participation++)
- ✓ Users' eventsParticipated array updated
- ✓ Count matches input

---

#### 2.3 Add Participants - Duplicate Prevention

**Test**: Try adding same user twice

```bash
# First add
POST /admin/event/{{EVENT_ID}}/participants/add
Authorization: Bearer {{ADMIN_TOKEN}}
Content-Type: application/json

{
  "userIds": ["{{USER_ID_1}}"]
}

# Response: 200, user added

# Second add (same user)
POST /admin/event/{{EVENT_ID}}/participants/add
Authorization: Bearer {{ADMIN_TOKEN}}
Content-Type: application/json

{
  "userIds": ["{{USER_ID_1}}"]
}
```

**Expected Response**: 409 Conflict
```json
{
  "success": false,
  "message": "All users are already registered for this event",
  "statusCode": 409
}
```

---

#### 2.4 Add Participants - Capacity Exceeded

**Test**: Try adding more participants than capacity

**Setup**: Create event with capacity: 3, add 4 users

```bash
POST /admin/event/{{EVENT_ID}}/participants/add
Authorization: Bearer {{ADMIN_TOKEN}}
Content-Type: application/json

{
  "userIds": ["{{USER_ID_1}}", "{{USER_ID_2}}", "{{USER_ID_3}}", "{{USER_ID_4}}"]
}
```

**Expected Response**: 400 Bad Request
```json
{
  "success": false,
  "message": "Adding 4 participants would exceed capacity of 3",
  "statusCode": 400
}
```

---

#### 2.5 Add Participants - Non-Upcoming Event

**Test**: Try adding participants to past event

```bash
POST /admin/event/{{PAST_EVENT_ID}}/participants/add
Authorization: Bearer {{ADMIN_TOKEN}}
Content-Type: application/json

{
  "userIds": ["{{USER_ID_1}}"]
}
```

**Expected Response**: 400 Bad Request
```json
{
  "success": false,
  "message": "Can only add participants to upcoming events",
  "statusCode": 400
}
```

---

### Test Suite 3: Winner Declaration

#### 3.1 Declare Winners - Success Case

**Test**: Declare 3 winners with ranks and prizes

```bash
POST /admin/event/{{EVENT_ID}}/winners
Authorization: Bearer {{ADMIN_TOKEN}}
Content-Type: application/json

{
  "winners": [
    {
      "userId": "{{USER_ID_1}}",
      "rank": 1,
      "prize": "Gift Voucher - ₹1000",
      "pointsAwarded": 100
    },
    {
      "userId": "{{USER_ID_2}}",
      "rank": 2,
      "prize": "Gift Voucher - ₹500",
      "pointsAwarded": 50
    },
    {
      "userId": "{{USER_ID_3}}",
      "rank": 3,
      "prize": "Certificate",
      "pointsAwarded": 25
    }
  ]
}
```

**Expected Response**: 200 OK
```json
{
  "success": true,
  "message": "Winners declared successfully",
  "data": {
    "_id": "{{EVENT_ID}}",
    "title": "Test Workshop",
    "eventType": "past",
    "winners": [
      {
        "user": {...},
        "rank": 1,
        "prize": "Gift Voucher - ₹1000",
        "pointsAwarded": 100
      }
    ]
  }
}
```

**Validation**:
- ✓ Event type changed to "past"
- ✓ Winners array populated
- ✓ User stats updated (wins++, clusterPoints += pointsAwarded)
- ✓ Achievements checked and awarded

---

#### 3.2 Declare Winners - Non-Participant

**Test**: Try declaring user as winner who is not a participant

**Setup**: Add winners not in participants list

```bash
POST /admin/event/{{EVENT_ID}}/winners
Authorization: Bearer {{ADMIN_TOKEN}}
Content-Type: application/json

{
  "winners": [
    {
      "userId": "{{RANDOM_USER_NOT_PARTICIPANT}}",
      "rank": 1,
      "prize": "Prize"
    }
  ]
}
```

**Expected Response**: 400 Bad Request
```json
{
  "success": false,
  "message": "User {{RANDOM_USER_NOT_PARTICIPANT}} is not a participant in this event",
  "statusCode": 400
}
```

---

#### 3.3 Declare Winners - Duplicate Ranks

**Test**: Try declaring winners with duplicate ranks

```bash
POST /admin/event/{{EVENT_ID}}/winners
Authorization: Bearer {{ADMIN_TOKEN}}
Content-Type: application/json

{
  "winners": [
    {"userId": "{{USER_ID_1}}", "rank": 1, "prize": "First"},
    {"userId": "{{USER_ID_2}}", "rank": 1, "prize": "Also First"},
    {"userId": "{{USER_ID_3}}", "rank": 3, "prize": "Third"}
  ]
}
```

**Expected Response**: 400 Bad Request
```json
{
  "success": false,
  "message": "Duplicate ranks are not allowed",
  "statusCode": 400
}
```

---

#### 3.4 Declare Winners - Invalid Rank

**Test**: Try declaring winners with invalid rank

```bash
POST /admin/event/{{EVENT_ID}}/winners
Authorization: Bearer {{ADMIN_TOKEN}}
Content-Type: application/json

{
  "winners": [
    {"userId": "{{USER_ID_1}}", "rank": 11, "prize": "Invalid"}
  ]
}
```

**Expected Response**: 400 Bad Request
```json
{
  "success": false,
  "message": "Rank must be between 1 and 10",
  "statusCode": 400
}
```

---

#### 3.5 Declare Winners - Exceeds Max

**Test**: Try declaring more than 10 winners

```bash
POST /admin/event/{{EVENT_ID}}/winners
Authorization: Bearer {{ADMIN_TOKEN}}
Content-Type: application/json

{
  "winners": [
    {"userId": "{{USER_ID_1}}", "rank": 1, "prize": "1st"},
    {"userId": "{{USER_ID_2}}", "rank": 2, "prize": "2nd"},
    // ... 11 total winners
  ]
}
```

**Expected Response**: 400 Bad Request
```json
{
  "success": false,
  "message": "Maximum 10 winners can be declared",
  "statusCode": 400
}
```

---

### Test Suite 4: Notice Board

#### 4.1 Add Notice - Success Case

**Test**: Post announcement notice

```bash
POST /admin/notice/add
Authorization: Bearer {{ADMIN_TOKEN}}
Content-Type: application/json

{
  "title": "Test Notice Title",
  "message": "This is a test notice for the notice board",
  "category": "announcement",
  "priority": "high",
  "image": null,
  "tags": ["test", "notice"],
  "cluster": null,
  "isPinned": true,
  "expiresAt": "2024-02-28"
}
```

**Expected Response**: 201 Created
```json
{
  "success": true,
  "message": "Notice created successfully",
  "data": {
    "_id": "{{NOTICE_ID}}",
    "title": "Test Notice Title",
    "message": "This is a test notice...",
    "postedBy": {...},
    "category": "announcement",
    "priority": "high",
    "isPinned": true,
    "views": 0,
    "isActive": true,
    "createdAt": "2024-01-20T10:00:00.000Z"
  }
}
```

**Validation**:
- ✓ Notice ID generated
- ✓ postedBy matches admin ID
- ✓ isActive is true
- ✓ views count is 0
- ✓ createdAt timestamp set

---

#### 4.2 Add Notice - Cluster-Specific

**Test**: Post notice for specific cluster only

```bash
POST /admin/notice/add
Authorization: Bearer {{ADMIN_TOKEN}}
Content-Type: application/json

{
  "title": "Programming Cluster Update",
  "message": "Important update for programming cluster",
  "category": "update",
  "priority": "medium",
  "cluster": "{{CLUSTER_ID}}"
}
```

**Expected Response**: 201 Created
```json
{
  "success": true,
  "message": "Notice created successfully",
  "data": {
    "_id": "{{NOTICE_ID}}",
    "title": "Programming Cluster Update",
    "cluster": {"_id": "{{CLUSTER_ID}}", "name": "Programming"}
  }
}
```

---

#### 4.3 Get All Notices

**Test**: Retrieve notices with pagination

```bash
GET /admin/notice/all?limit=10&page=1
Authorization: Bearer {{ADMIN_TOKEN}}
```

**Expected Response**: 200 OK
```json
{
  "success": true,
  "message": "Notices retrieved successfully",
  "data": {
    "notices": [
      {
        "_id": "{{NOTICE_ID}}",
        "title": "Test Notice",
        "postedBy": {...},
        "isPinned": true,
        "views": 5,
        "createdAt": "2024-01-20T10:00:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 1,
      "totalNotices": 1,
      "limit": 10
    }
  }
}
```

**Validation**:
- ✓ Pinned notices appear first
- ✓ Sorted by creation date
- ✓ Only active notices returned
- ✓ Pagination works

---

#### 4.4 Get Notices - With Filters

**Test**: Filter notices by category and priority

```bash
GET /admin/notice/all?category=announcement&priority=urgent
Authorization: Bearer {{ADMIN_TOKEN}}
```

**Expected Response**: 200 OK with filtered results

---

#### 4.5 Edit Notice

**Test**: Update notice that you posted

```bash
PUT /admin/notice/edit/{{NOTICE_ID}}
Authorization: Bearer {{ADMIN_TOKEN}}
Content-Type: application/json

{
  "title": "Updated Notice Title",
  "priority": "urgent",
  "isPinned": false
}
```

**Expected Response**: 200 OK
```json
{
  "success": true,
  "message": "Notice updated successfully",
  "data": {
    "_id": "{{NOTICE_ID}}",
    "title": "Updated Notice Title",
    "priority": "urgent",
    "isPinned": false,
    "updatedAt": "2024-01-20T11:00:00.000Z"
  }
}
```

---

#### 4.6 Edit Notice - Permission Denied

**Test**: Try editing notice posted by another admin

```bash
PUT /admin/notice/edit/{{OTHER_ADMIN_NOTICE_ID}}
Authorization: Bearer {{YOUR_ADMIN_TOKEN}}
Content-Type: application/json

{
  "title": "Unauthorized Edit"
}
```

**Expected Response**: 403 Forbidden
```json
{
  "success": false,
  "message": "You can only edit notices you posted",
  "statusCode": 403
}
```

---

#### 4.7 Delete Notice

**Test**: Delete notice that you posted

```bash
DELETE /admin/notice/delete/{{NOTICE_ID}}
Authorization: Bearer {{ADMIN_TOKEN}}
```

**Expected Response**: 200 OK
```json
{
  "success": true,
  "message": "Notice deleted successfully",
  "data": {
    "deletedId": "{{NOTICE_ID}}"
  }
}
```

---

### Test Suite 5: Statistics

#### 5.1 Get Admin Stats - Master

**Test**: Master user gets global statistics

```bash
GET /admin/stats
Authorization: Bearer {{MASTER_TOKEN}}
```

**Expected Response**: 200 OK
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
      "uniqueParticipants": 320,
      "totalWinners": 85
    },
    "clusterWise": [
      {
        "clusterId": "...",
        "clusterName": "Programming",
        "totalEvents": 6,
        "upcomingEvents": 2,
        "pastEvents": 4,
        "totalParticipants": 180,
        "totalWinners": 45
      }
    ],
    "adminScope": "all"
  }
}
```

**Validation**:
- ✓ Global statistics retrieved
- ✓ All clusters in clusterWise array
- ✓ adminScope is "all"

---

#### 5.2 Get Admin Stats - Regular Admin

**Test**: Regular admin sees only their cluster stats

```bash
GET /admin/stats
Authorization: Bearer {{REGULAR_ADMIN_TOKEN}}
```

**Expected Response**: 200 OK
```json
{
  "success": true,
  "message": "Statistics retrieved successfully",
  "data": {
    "overall": {
      "totalEvents": 6,
      "upcomingEvents": 2,
      "pastEvents": 4,
      "uniqueParticipants": 150,
      "totalWinners": 35
    },
    "clusterWise": [
      {
        "clusterId": "{{ADMIN_CLUSTER_ID}}",
        "clusterName": "Programming",
        "totalEvents": 6,
        "totalParticipants": 150,
        "totalWinners": 35
      }
    ],
    "userCluster": "{{ADMIN_CLUSTER_ID}}",
    "adminScope": "cluster"
  }
}
```

**Validation**:
- ✓ Only admin's cluster stats shown
- ✓ adminScope is "cluster"
- ✓ userCluster field included

---

#### 5.3 Get Cluster Stats

**Test**: Get detailed statistics for a specific cluster

```bash
GET /admin/stats/cluster/{{CLUSTER_ID}}
Authorization: Bearer {{ADMIN_TOKEN}}
```

**Expected Response**: 200 OK
```json
{
  "success": true,
  "message": "Cluster statistics retrieved successfully",
  "data": {
    "cluster": {
      "_id": "{{CLUSTER_ID}}",
      "name": "Programming",
      "memberCount": 145
    },
    "events": {
      "total": 6,
      "upcoming": 2,
      "past": 4
    },
    "participants": {
      "unique": 120
    },
    "winners": 35,
    "topEvents": [
      {
        "_id": "event_id",
        "title": "Event Title",
        "participants": 45,
        "eventType": "past",
        "date": "2024-01-15T00:00:00.000Z"
      }
    ]
  }
}
```

**Validation**:
- ✓ Member count from cluster
- ✓ Event statistics accurate
- ✓ Top 5 events included
- ✓ Sorted by participation

---

#### 5.4 Get Cluster Stats - Permission Denied

**Test**: Regular admin accessing different cluster's stats

```bash
GET /admin/stats/cluster/{{OTHER_CLUSTER_ID}}
Authorization: Bearer {{REGULAR_ADMIN_TOKEN}}
```

**Expected Response**: 403 Forbidden
```json
{
  "success": false,
  "message": "You can only view stats for your cluster",
  "statusCode": 403
}
```

---

## Authentication Tests

### 6.1 Missing Token

**Test**: Request without authorization header

```bash
POST /admin/event/add
Content-Type: application/json

{
  "title": "Event",
  // ... other fields
}
```

**Expected Response**: 401 Unauthorized
```json
{
  "success": false,
  "message": "Authorization token is required",
  "statusCode": 401
}
```

---

### 6.2 Expired Token

**Test**: Request with expired JWT

```bash
POST /admin/event/add
Authorization: Bearer {{EXPIRED_TOKEN}}
```

**Expected Response**: 401 Unauthorized
```json
{
  "success": false,
  "message": "Token expired",
  "statusCode": 401
}
```

---

### 6.3 Invalid Token

**Test**: Request with malformed JWT

```bash
POST /admin/event/add
Authorization: Bearer invalid_token_string
```

**Expected Response**: 401 Unauthorized
```json
{
  "success": false,
  "message": "Invalid token",
  "statusCode": 401
}
```

---

### 6.4 Wrong Role

**Test**: Regular user trying to access admin endpoint

```bash
POST /admin/event/add
Authorization: Bearer {{USER_TOKEN}}
```

**Expected Response**: 403 Forbidden
```json
{
  "success": false,
  "message": "You do not have permission to access this resource",
  "statusCode": 403
}
```

---

## Postman Collection

Save this as `Admin_API_Tests.postman_collection.json`:

```json
{
  "info": {
    "name": "Admin APIs - Complete Test Suite",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Event Management",
      "item": [
        {
          "name": "Add Event",
          "request": {
            "method": "POST",
            "header": [{"key": "Authorization", "value": "Bearer {{ADMIN_TOKEN}}"}],
            "url": {"raw": "{{BASE_URL}}/admin/event/add"}
          }
        }
      ]
    },
    {
      "name": "Participant Management",
      "item": []
    },
    {
      "name": "Winner Declaration",
      "item": []
    },
    {
      "name": "Notice Board",
      "item": []
    },
    {
      "name": "Statistics",
      "item": []
    }
  ]
}
```

---

## Integration Testing Checklist

- [ ] All endpoints accessible with valid token
- [ ] All endpoints return 401 without token
- [ ] All endpoints return 403 with wrong role
- [ ] Event creation validates future date
- [ ] Event editing only for upcoming events
- [ ] Event deletion only for upcoming events
- [ ] Participant capacity limits enforced
- [ ] Duplicate participant prevention works
- [ ] Winner declaration validates participants
- [ ] Winner declaration prevents duplicate ranks
- [ ] Notice creation works for all users
- [ ] Notice editing restricted to poster
- [ ] Notice deletion restricted to poster
- [ ] Statistics accurate for master
- [ ] Statistics scoped for regular admins
- [ ] Cluster-wise stats filtered correctly
- [ ] Pagination works for notices and participants
- [ ] Filters work for notices (category, priority, cluster)

---

## Performance Testing

### Bulk Participant Add

```bash
# Test with 100+ users
POST /admin/event/{{EVENT_ID}}/participants/add
Authorization: Bearer {{ADMIN_TOKEN}}

{
  "userIds": [/* 100 user IDs */]
}
```

**Expectations**:
- Response time < 2 seconds
- All users successfully added
- User stats updated correctly

---

## Troubleshooting

| Error | Cause | Solution |
|-------|-------|----------|
| 401 Unauthorized | Invalid/missing token | Get new token from login |
| 403 Forbidden | Wrong role | Use admin token |
| 404 Not Found | Resource doesn't exist | Check ID validity |
| 400 Bad Request | Invalid date/capacity | Validate input format |
| 409 Conflict | Duplicate user in event | Check existing participants |

---

