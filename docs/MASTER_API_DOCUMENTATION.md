# Master APIs Documentation

## Overview

The Master APIs provide exclusive administrative capabilities for system masters. These endpoints enable:
- Admin account creation and management
- System-wide user management with safety confirmations
- Past event record management
- Complete system statistics and analytics

All routes are protected with master-only authentication.

## Authentication & Authorization

**All endpoints require**:
- Valid JWT token in `Authorization: Bearer <token>` header
- User role must be `master` (exclusive access)

Master accounts have:
- ✅ All admin permissions plus exclusive features
- ✅ System-wide access (unrestricted by cluster)
- ✅ User and admin management capabilities
- ✅ Complete system statistics and analytics

## Base URL
```
http://localhost:5000/api/master
```

---

## ADMIN MANAGEMENT ENDPOINTS

### 1. Create Admin Account

Create a new admin for any cluster.

```http
POST /create-admin
Authorization: Bearer <master-token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "fullName": "John Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecurePassword123!",
  "cluster": "67a9c1f2e4b0d2a3c1f2e4b0"
}
```

**Response (201 Created)**:
```json
{
  "success": true,
  "message": "Admin created successfully",
  "data": {
    "_id": "67a9c1f2e4b0d2a3c1f2e3f0",
    "fullName": "John Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "cluster": {
      "_id": "67a9c1f2e4b0d2a3c1f2e4b0",
      "name": "Programming",
      "icon": "💻",
      "color": "#3b82f6"
    },
    "role": "admin",
    "isActive": true,
    "permissions": {
      "manageUsers": true,
      "manageEvents": true
    },
    "createdBy": {
      "_id": "master_id",
      "fullName": "Master Admin",
      "username": "master"
    },
    "createdAt": "2024-01-20T10:00:00.000Z"
  }
}
```

**Validation Rules**:
- All fields required
- Username and email must be unique (case-insensitive)
- Password minimum 8 characters
- Cluster must exist
- Password is hashed with bcryptjs

**Error Responses**:
```json
// Username exists
{
  "success": false,
  "message": "Username already exists",
  "statusCode": 409
}

// Weak password
{
  "success": false,
  "message": "Password must be at least 8 characters long",
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

### 2. Remove Admin

Deactivate an admin account (soft delete, not permanent).

```http
DELETE /remove-admin/:id
Authorization: Bearer <master-token>
```

**Request Parameters**:
- `id`: Admin ID (required)

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Admin deactivated successfully",
  "data": {
    "_id": "67a9c1f2e4b0d2a3c1f2e3f0",
    "fullName": "John Doe",
    "isActive": false,
    "deactivatedAt": "2024-01-20T11:00:00.000Z",
    "deactivatedBy": "master_id"
  }
}
```

**Safety Features**:
- Cannot remove master/superadmin accounts
- Cannot remove last active admin from a cluster
- Soft delete - admin can be reactivated
- Logs who deactivated and when

**Error Responses**:
```json
// Cannot remove master
{
  "success": false,
  "message": "Cannot remove master/superadmin accounts",
  "statusCode": 403
}

// Last admin in cluster
{
  "success": false,
  "message": "Cannot remove the last active admin from a cluster",
  "statusCode": 400
}
```

---

### 3. Reactivate Admin

Restore a deactivated admin account.

```http
PUT /reactivate-admin/:id
Authorization: Bearer <master-token>
```

**Request Parameters**:
- `id`: Admin ID (required)

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Admin reactivated successfully",
  "data": {
    "_id": "67a9c1f2e4b0d2a3c1f2e3f0",
    "fullName": "John Doe",
    "isActive": true,
    "deactivatedAt": null,
    "deactivatedBy": null
  }
}
```

---

## USER MANAGEMENT ENDPOINTS

### 4. Get All Users

Retrieve all users with pagination, filtering, and search.

```http
GET /users?limit=50&page=1&class=3rd+Year&search=john
Authorization: Bearer <master-token>
```

**Query Parameters**:
- `limit`: Results per page (default: 50)
- `page`: Page number (default: 1)
- `class`: Filter by class (optional)
- `search`: Search by name, email, or SRN (optional)

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": {
    "users": [
      {
        "_id": "67a9c1f2e4b0d2a3c1f2e5f0",
        "fullName": "John Smith",
        "email": "john@example.com",
        "class": "3rd Year",
        "srn": "PES1234567",
        "stats": {
          "participation": 5,
          "wins": 2,
          "clusterPoints": 150
        },
        "badges": ["active-participant", "first-winner"],
        "eventsParticipated": 5,
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 2,
      "totalUsers": 85,
      "limit": 50
    }
  }
}
```

**Features**:
- Search across multiple fields (name, email, SRN)
- Filter by class
- Sorted by creation date (newest first)
- Password excluded from response

---

### 5. Remove User (3-Step Confirmation)

Delete user account with multi-step safety confirmation.

#### Step 1: Generate Confirmation Token

```http
DELETE /remove-user/:id
Authorization: Bearer <master-token>
Content-Type: application/json

{
  "step": "1"
}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Step 1 complete: Confirmation token generated. Use token and master password in next step.",
  "data": {
    "userId": "67a9c1f2e4b0d2a3c1f2e5f0",
    "userName": "John Smith",
    "email": "john@example.com",
    "removalInitiatedAt": "2024-01-20T11:00:00.000Z",
    "removalInitiatedBy": "master_id",
    "confirmationToken": "ABC123DEF456",
    "requiresPasswordConfirmation": true
  }
}
```

#### Step 2: Verify Master Password

```http
DELETE /remove-user/:id
Authorization: Bearer <master-token>
Content-Type: application/json

{
  "step": "2",
  "password": "master_password",
  "confirmationToken": "ABC123DEF456"
}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Step 2 complete: Master password verified. Proceed to step 3 for final deletion.",
  "data": {
    "userId": "67a9c1f2e4b0d2a3c1f2e5f0",
    "verified": true,
    "nextStep": 3
  }
}
```

**Validation**:
- Requires valid master password
- Confirms master's identity before proceeding
- No permanent changes yet

#### Step 3: Final Deletion

```http
DELETE /remove-user/:id
Authorization: Bearer <master-token>
Content-Type: application/json

{
  "step": "3",
  "password": "master_password"
}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Step 3 complete: User permanently deleted from system",
  "data": {
    "userId": "67a9c1f2e4b0d2a3c1f2e5f0",
    "userName": "John Smith",
    "userEmail": "john@example.com",
    "deletedAt": "2024-01-20T11:05:00.000Z",
    "deletedBy": "master_id",
    "reason": "Master-initiated removal"
  }
}
```

**Safety Features**:
- 3-step confirmation process
- Master password required at steps 2 and 3
- Token-based verification
- Comprehensive logging
- Prevents accidental deletion

**Error Responses**:
```json
// Invalid password
{
  "success": false,
  "message": "Invalid master password. User removal cancelled.",
  "statusCode": 401
}

// Missing step
{
  "success": false,
  "message": "Step 1 complete: Confirmation token generated...",
  "statusCode": 200
}
```

---

## PAST EVENT MANAGEMENT ENDPOINTS

### 6. Add Past Event

Create a historical event record (for archival purposes).

```http
POST /event/past/add
Authorization: Bearer <master-token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "title": "Programming Workshop - 2023",
  "description": "Historical workshop from 2023",
  "cluster": "67a9c1f2e4b0d2a3c1f2e4b0",
  "date": "2023-12-15",
  "time": {
    "startTime": "14:00",
    "endTime": "16:00"
  },
  "location": "Lab 101",
  "category": "Workshop",
  "instructor": "Jane Smith",
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
    }
  ],
  "tags": ["2023", "workshop", "programming"]
}
```

**Response (201 Created)**:
```json
{
  "success": true,
  "message": "Past event created successfully",
  "data": {
    "_id": "67a9c1f2e4b0d2a3c1f2e4b1",
    "title": "Programming Workshop - 2023",
    "description": "Historical workshop from 2023",
    "eventType": "past",
    "date": "2023-12-15T00:00:00.000Z",
    "cluster": {
      "_id": "67a9c1f2e4b0d2a3c1f2e4b0",
      "name": "Programming"
    },
    "winners": [
      {
        "user": {
          "_id": "67a9c1f2e4b0d2a3c1f2e5f0",
          "fullName": "John Smith",
          "email": "john@example.com"
        },
        "rank": 1,
        "prize": "Gift Voucher - ₹1000",
        "pointsAwarded": 100
      }
    ],
    "isActive": true,
    "createdBy": "master_id",
    "createdAt": "2024-01-20T10:00:00.000Z"
  }
}
```

**Validation**:
- Date must be in the past
- Maximum 10 winners
- Winner ranks must be 1-10 and unique
- All winners must have userId and rank

---

### 7. Edit Past Event

Update historical event information.

```http
PUT /event/past/edit/:id
Authorization: Bearer <master-token>
Content-Type: application/json
```

**Request Parameters**:
- `id`: Event ID (required)

**Request Body** (all optional):
```json
{
  "title": "Updated Event Title",
  "description": "Updated description",
  "location": "New Location",
  "winners": [
    {"userId": "...", "rank": 1, "prize": "...", "pointsAwarded": 100}
  ]
}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Past event updated successfully",
  "data": { /* updated event */ }
}
```

**Restrictions**:
- Only past events can be edited
- All validation rules apply (date, winners, etc.)

---

### 8. Delete Past Event

Permanently delete a past event record.

```http
DELETE /event/past/delete/:id
Authorization: Bearer <master-token>
Content-Type: application/json
```

**Request Body** (required):
```json
{
  "password": "master_password"
}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Past event deleted successfully",
  "data": {
    "deletedId": "67a9c1f2e4b0d2a3c1f2e4b1"
  }
}
```

**Safety Features**:
- Master password required for confirmation
- Only deletes past events
- Permanent deletion (use with caution)

**Error Responses**:
```json
// Invalid password
{
  "success": false,
  "message": "Invalid master password",
  "statusCode": 401
}

// Not a past event
{
  "success": false,
  "message": "Can only delete past events through this endpoint",
  "statusCode": 400
}
```

---

## STATISTICS ENDPOINTS

### 9. Get System Statistics

Retrieve complete system-wide analytics and statistics.

```http
GET /stats
Authorization: Bearer <master-token>
```

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "System statistics retrieved successfully",
  "data": {
    "timestamp": "2024-01-20T11:00:00.000Z",
    "overall": {
      "totalEvents": 25,
      "upcomingEvents": 8,
      "pastEvents": 14,
      "ongoingEvents": 3,
      "totalUsers": 450,
      "totalAdmins": 12,
      "totalMasters": 1,
      "totalClusters": 3,
      "totalNotices": 48,
      "uniqueParticipants": 320,
      "totalWinners": 85
    },
    "engagement": {
      "avgEventsPerUser": 2.5,
      "maxEventsAnyUser": 15,
      "totalParticipations": 1125
    },
    "clusterWise": [
      {
        "clusterId": "67a9c1f2e4b0d2a3c1f2e4b0",
        "clusterName": "Programming",
        "totalEvents": 10,
        "upcomingEvents": 3,
        "pastEvents": 6,
        "ongoingEvents": 1,
        "totalParticipants": 145,
        "totalWinners": 35
      }
    ],
    "classDistribution": [
      {
        "_id": "3rd Year",
        "count": 180
      },
      {
        "_id": "2nd Year",
        "count": 150
      },
      {
        "_id": "1st Year",
        "count": 120
      }
    ],
    "topEvents": [
      {
        "_id": "event_id",
        "title": "Web Development Bootcamp",
        "participantCount": 45,
        "eventType": "past",
        "date": "2024-01-15T00:00:00.000Z"
      }
    ],
    "topBadges": [
      {
        "_id": "active-participant",
        "count": 185
      },
      {
        "_id": "first-winner",
        "count": 75
      }
    ]
  }
}
```

**Statistics Included**:

**Overall Metrics**:
- Event counts by type
- Total users, admins, masters, clusters
- Total notices and unique participants
- Total winners

**Engagement Metrics**:
- Average events per user
- Maximum events participated by any user
- Total participation count

**Cluster Breakdown**:
- Per-cluster event statistics
- Per-cluster participant count
- Per-cluster winner count

**Distribution Analysis**:
- Class-wise user distribution
- Top events by participation
- Top badges by frequency

---

### 10. Export System Data

Export system data for backup or analysis.

```http
GET /stats/export?format=json
Authorization: Bearer <master-token>
```

**Query Parameters**:
- `format`: Export format (default: json)
  - `json`: JSON format (recommended)
  - `csv`: CSV format (summary)

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "System data exported as JSON",
  "data": {
    "exportedAt": "2024-01-20T11:00:00.000Z",
    "exportedBy": "master_id",
    "data": {
      "users": 450,
      "admins": 12,
      "events": 25,
      "notices": 48,
      "clusters": 3,
      "summary": {
        "users": [ /* user objects */ ],
        "admins": [ /* admin objects */ ],
        "events": [ /* event objects */ ],
        "notices": [ /* notice objects */ ],
        "clusters": [ /* cluster objects */ ]
      }
    }
  }
}
```

**Use Cases**:
- Regular backups
- Data analysis and reporting
- Database migration
- Compliance and audits
- Performance analysis

---

## HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success (GET, PUT, DELETE) |
| 201 | Created (POST) |
| 400 | Bad Request (validation failed) |
| 401 | Unauthorized (invalid/missing token or password) |
| 403 | Forbidden (not master role) |
| 404 | Not Found |
| 409 | Conflict (duplicate username/email) |
| 500 | Server Error |

---

## Error Response Format

All errors follow this format:

```json
{
  "success": false,
  "message": "Error description",
  "statusCode": 400
}
```

---

## Key Features

✅ **Admin Management**
- Create admins for any cluster
- Deactivate and reactivate accounts
- Prevent removing last cluster admin

✅ **User Management**
- Search and filter users
- 3-step removal confirmation
- Master password re-validation
- Comprehensive logging

✅ **Past Event Management**
- Create historical event records
- Full editing capabilities
- Password-protected deletion
- Winner assignment flexibility

✅ **System Statistics**
- Comprehensive analytics
- Cluster-wise breakdown
- Engagement metrics
- Data export capabilities

✅ **Security**
- Master-only access
- Password confirmation for destructive ops
- Multi-step confirmation processes
- Safe error messages
- No sensitive data in responses

---

## Authorization Model

**Master Role**:
- ✅ Create and remove admins
- ✅ Manage all users system-wide
- ✅ Create and manage past events
- ✅ View complete system statistics
- ✅ Export system data
- ✅ All admin permissions included
- ✅ No cluster restrictions

---

## Rate Limiting & Throttling

Currently not implemented. Recommended for future:
- Admin creation throttling
- User deletion rate limits
- Data export frequency limits

---

## Version Information

**Current Version**: 1.2.0  
**Release Date**: January 2024  
**Status**: Production Ready  

---

