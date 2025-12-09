# Admin APIs - Quick Reference Card

## 🚀 Quick Start

### Import & Register
```javascript
import adminRoutes from './routes/adminRoutes.js';
app.use('/api/admin', adminRoutes);
```

### Get Token
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password"}'
```

### Make Requests
```bash
curl -X POST http://localhost:5000/api/admin/event/add \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{...}'
```

---

## 📋 Endpoint Map

### Events (6)
```
POST   /event/add                 → Create upcoming event
PUT    /event/edit/:id            → Edit upcoming event
DELETE /event/delete/:id          → Delete upcoming event
GET    /event/:id/participants    → List participants
POST   /event/:id/participants/add → Add users to event
POST   /event/:id/winners         → Declare winners
```

### Notices (4)
```
POST   /notice/add              → Create notice
GET    /notice/all              → List notices
PUT    /notice/edit/:id         → Edit notice
DELETE /notice/delete/:id       → Delete notice
```

### Stats (2)
```
GET    /stats                   → Overall + cluster stats
GET    /stats/cluster/:id       → Detailed cluster stats
```

---

## 🔐 Authorization

**All endpoints require**:
- JWT token in `Authorization: Bearer <token>` header
- User role: `admin` or `master`

**Event ops**: Created by you OR in your cluster
**Notice ops**: Posted by you (OR master)
**Stats**: Your cluster (OR all if master)

---

## 📝 Common Requests

### Create Event
```json
POST /event/add
{
  "title": "Workshop",
  "description": "Learn React",
  "cluster": "cluster_id",
  "date": "2024-02-25",
  "time": {"startTime": "14:00", "endTime": "16:00"},
  "location": "Lab 101",
  "capacity": 50
}
```

### Add Participants
```json
POST /event/{id}/participants/add
{
  "userIds": ["user1", "user2", "user3"]
}
```

### Declare Winners
```json
POST /event/{id}/winners
{
  "winners": [
    {"userId": "user1", "rank": 1, "prize": "₹1000", "pointsAwarded": 100},
    {"userId": "user2", "rank": 2, "prize": "₹500", "pointsAwarded": 50},
    {"userId": "user3", "rank": 3, "prize": "Cert", "pointsAwarded": 25}
  ]
}
```

### Post Notice
```json
POST /notice/add
{
  "title": "Registration Extended",
  "message": "Deadline extended to Feb 16",
  "category": "announcement",
  "priority": "high",
  "isPinned": true
}
```

### Get Stats
```bash
GET /stats
GET /stats/cluster/cluster_id
```

---

## ✅ Validation Rules

| Field | Rule |
|-------|------|
| Event date | Must be future |
| Event type | Only "upcoming" creatable |
| Capacity | Min 1 if set |
| Winner rank | 1-10, unique |
| Winners | Max 10 per event |
| Notice category | announcement\|alert\|update\|event\|deadline\|other |
| Notice priority | low\|medium\|high\|urgent |

---

## 🔄 Response Format

### Success ✓
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* response data */ }
}
```

### Error ✗
```json
{
  "success": false,
  "message": "Error description",
  "statusCode": 400
}
```

---

## 🌐 HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK (GET, PUT, DELETE) |
| 201 | Created (POST) |
| 400 | Bad request (validation failed) |
| 401 | Unauthorized (no token) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Not found |
| 409 | Conflict (duplicate) |
| 500 | Server error |

---

## 🛠️ Common Errors & Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| 401 Unauthorized | No token | Add Authorization header |
| 403 Forbidden | Wrong role | Use admin token |
| 400 Bad date | Past date | Use future date |
| 400 Exceeds capacity | Too many users | Remove some users |
| 409 Duplicate user | Already registered | Check participants list |

---

## 📊 Pagination

For list endpoints:
```bash
GET /event/:id/participants?limit=10&page=1
GET /notice/all?limit=20&page=2
```

Response includes:
```json
{
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalNotices": 95,
    "limit": 20
  }
}
```

---

## 🔍 Filtering

### Notices
```bash
GET /notice/all?category=announcement&priority=high
GET /notice/all?cluster=cluster_id
```

---

## 📚 Documentation

| File | Content |
|------|---------|
| ADMIN_API_DOCUMENTATION.md | Full API reference |
| ADMIN_API_TESTING_GUIDE.md | 30+ test cases |
| ADMIN_API_INTEGRATION_GUIDE.md | Setup instructions |
| ADMIN_API_IMPLEMENTATION_SUMMARY.md | Overview |

---

## 🧪 Test Setup

1. **Create test clusters** (via admin or DB)
2. **Create admin account** (role: admin)
3. **Login** to get token
4. **Create test users**
5. **Run test endpoints**

---

## ⚙️ Environment Setup

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/coding-club
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:3000
```

---

## 📝 Key Features

✅ Event management (upcoming only)
✅ Participant management
✅ Winner declaration (max 10)
✅ Notice board system
✅ Cluster-wise statistics
✅ Full authorization
✅ Input validation
✅ Pagination
✅ Error handling

---

## 🎯 Admin Permissions

### Regular Admin
- Manage events in their cluster
- View cluster participants
- Declare winners for cluster events
- Post notices
- View cluster stats

### Master
- Manage all events
- View all participants
- Declare winners everywhere
- Post notices
- View global stats

---

## 🔗 Related APIs

**User APIs**: `/api/users/` (see USER_API_DOCUMENTATION.md)
**Auth APIs**: `/api/auth/` (login, signup)

---

## 📞 Support

1. Check error message
2. Review ADMIN_API_DOCUMENTATION.md
3. Check ADMIN_API_TESTING_GUIDE.md
4. Review ADMIN_API_INTEGRATION_GUIDE.md

---

## 🚨 Important Notes

⚠️ Only **upcoming** events can be created/edited/deleted
⚠️ Only **upcoming** events can have participants added
⚠️ **Max 10 winners** per event
⚠️ Winner **ranks must be unique** (1-10)
⚠️ All **winners must be participants**
⚠️ Regular admins can only manage their cluster
⚠️ Masters have unrestricted access

---

## 📊 Data Flow

```
Admin creates event
  ↓
Admins add participants
  ↓
Users see and register for event
  ↓
Event happens
  ↓
Admin declares winners
  ↓
User stats updated
  ↓
Achievements awarded
```

---

## 💾 Database Updates

When you declare winners:
- Event type → "past"
- User wins → +1
- User clusterPoints → +awarded
- User achievements → checked/awarded

---

## 🏗️ Architecture

```
adminRoutes.js
  ├─ /event/* → eventHandlers
  ├─ /notice/* → noticeHandlers
  └─ /stats/* → statsHandlers

adminController.js (1,100+ lines)
  ├─ Event functions (6)
  ├─ Notice functions (4)
  └─ Stats functions (2)

All protected by:
  - authenticate middleware
  - roleMiddleware(['admin', 'master'])
```

---

## 📈 Statistics Available

**Overall**:
- Total/upcoming/past events
- Total users, admins, notices
- Unique participants
- Total winners

**Per Cluster**:
- Event count by type
- Participant count
- Winner count
- Top events by participation

---

## ⏱️ Pagination Defaults

| Endpoint | Default Limit |
|----------|---------------|
| Participants | 50 |
| Notices | 20 |

---

## 🎓 Learning Path

1. Read ADMIN_API_DOCUMENTATION.md
2. Create test admin account
3. Run through ADMIN_API_TESTING_GUIDE.md
4. Integrate with server (ADMIN_API_INTEGRATION_GUIDE.md)
5. Deploy and monitor

---

## 📞 Quick Help

**"Can't create event"**
→ Ensure date is in future

**"Can't add participants"**
→ Event must be upcoming

**"Can't declare winners"**
→ All must be participants, max 10, unique ranks

**"No results"**
→ Check filters, pagination, authorization

---

**Version**: 1.0.0
**Status**: Production Ready ✅
**Last Updated**: January 2024

