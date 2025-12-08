# Master APIs Integration Guide

Step-by-step guide to integrate the master-only APIs into your Express server.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [File Locations](#file-locations)
3. [Integration Steps](#integration-steps)
4. [Server Configuration](#server-configuration)
5. [Middleware Setup](#middleware-setup)
6. [Testing Integration](#testing-integration)
7. [Environment Variables](#environment-variables)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

✅ Node.js and npm installed  
✅ Express.js server running  
✅ MongoDB connected and running  
✅ Authentication middleware implemented  
✅ Role-based middleware implemented  
✅ User, Admin, Event, Notice, Cluster models created  
✅ `sendSuccess` and `sendError` utility functions available  

---

## File Locations

### New Files Created

```
server/
├── controllers/
│   └── masterController.js       (NEW - 1,300+ lines)
├── routes/
│   └── masterRoutes.js           (NEW - 60 lines)
└── docs/
    ├── MASTER_API_DOCUMENTATION.md       (NEW)
    ├── MASTER_API_TESTING_GUIDE.md       (NEW)
    └── MASTER_API_INTEGRATION_GUIDE.md   (THIS FILE)
```

### Existing Files to Modify

```
server/
├── server.js                     (MODIFY - Add route import and registration)
└── .env                         (VERIFY - Environment variables)
```

---

## Integration Steps

### Step 1: Copy New Files to Project

Copy the following files to your server directory:

```bash
# From the files we created:
server/controllers/masterController.js
server/routes/masterRoutes.js
```

No modifications needed - files are ready to use.

### Step 2: Verify Dependencies in masterController.js

Open `server/controllers/masterController.js` and verify these imports are available:

```javascript
const Admin = require('../models/Admin');
const User = require('../models/User');
const Event = require('../models/Event');
const Cluster = require('../models/Cluster');
const { sendSuccess, sendError } = require('../utils/responseHandler');
const bcryptjs = require('bcryptjs');
```

If any are missing or have different paths, update the import statements.

### Step 3: Verify Middleware in masterRoutes.js

Open `server/routes/masterRoutes.js` and verify middleware imports:

```javascript
const authenticate = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
```

Update paths if middleware is in different location.

### Step 4: Register Routes in server.js

Open your main `server.js` file and add the master routes import and registration.

**Find the section** where other routes are imported:

```javascript
// Around line 20-30, find existing route imports:
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const eventRoutes = require('./routes/eventRoutes');
// ... other routes
```

**Add the master routes import**:

```javascript
const masterRoutes = require('./routes/masterRoutes');  // ADD THIS LINE
```

**Find the section** where routes are registered with `app.use()`:

```javascript
// Around line 50-70, find existing route registrations:
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/events', eventRoutes);
// ... other routes
```

**Add the master routes registration**:

```javascript
app.use('/api/master', masterRoutes);  // ADD THIS LINE
```

**Complete Example** of updated server.js:

```javascript
// ... existing imports ...
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const eventRoutes = require('./routes/eventRoutes');
const masterRoutes = require('./routes/masterRoutes');  // ← NEW

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/master', masterRoutes);  // ← NEW

// ... rest of configuration ...
```

### Step 5: Verify Model Relationships

Ensure your models support the relationships used in masterController.js:

**User Model** should have:
```javascript
fullName, email, class, srn, password, stats, badges, isActive, createdAt
```

**Admin Model** should have:
```javascript
fullName, username, email, password, cluster, role, isActive, createdBy, deactivatedAt, deactivatedBy, createdAt
```

**Event Model** should have:
```javascript
title, description, eventType, date, cluster, winners (with user reference), createdBy, isActive, createdAt
```

**Cluster Model** should have:
```javascript
name, members, admins
```

### Step 6: Test Server Startup

Start your server and check for errors:

```bash
# From server directory
npm start
# or
node server.js
```

**Expected Output**:
```
Server running on port 5000
Database connected
Routes initialized
```

**If you see errors**:
- Check that all imports in masterController.js exist
- Verify middleware paths are correct
- Check that all models are available

---

## Server Configuration

### Complete server.js Setup Example

```javascript
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

// Database Connection
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const eventRoutes = require('./routes/eventRoutes');
const noticeRoutes = require('./routes/noticeRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');
const masterRoutes = require('./routes/masterRoutes');  // ← ADD THIS

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/master', masterRoutes);  // ← ADD THIS

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

---

## Middleware Setup

### Authentication Middleware Verification

Your `authenticate` middleware should:
- Extract JWT token from `Authorization: Bearer <token>` header
- Verify and decode the token
- Set `req.user` with user data including `role`
- Call `next()` on success
- Return 401 error if token is invalid

**Example authenticate middleware** (if not already present):

```javascript
// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token not provided'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
};
```

### Role Middleware Verification

Your `roleMiddleware` should:
- Accept array of allowed roles
- Check if `req.user.role` is in allowed roles
- Allow request if role matches
- Return 403 error if role doesn't match

**Example roleMiddleware** (if not already present):

```javascript
// middleware/roleMiddleware.js
module.exports = (allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user?.role;
    
    if (!userRole) {
      return res.status(403).json({
        success: false,
        message: 'Role not found'
      });
    }

    const roles = Array.isArray(allowedRoles) 
      ? allowedRoles 
      : [allowedRoles];

    if (!roles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Master role required'
      });
    }

    next();
  };
};
```

---

## Testing Integration

### Quick Integration Test

```bash
# 1. Start the server
npm start

# 2. Test master routes are accessible
curl http://localhost:5000/api/master/stats \
  -H "Authorization: Bearer test_token"

# Expected: 401 (invalid token) or 403 (no master role)
# NOT: 404 (route not found)
```

### Test Each Endpoint

Create a simple test script (`test-master-integration.js`):

```javascript
const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api/master';
const TOKEN = 'your_test_token_here'; // Replace with valid master token

async function testEndpoints() {
  const endpoints = [
    { method: 'GET', url: '/stats' },
    { method: 'GET', url: '/users?limit=5' },
    { method: 'GET', url: '/stats/export?format=json' }
  ];

  for (const endpoint of endpoints) {
    try {
      const response = await axios({
        method: endpoint.method,
        url: BASE_URL + endpoint.url,
        headers: {
          'Authorization': `Bearer ${TOKEN}`
        }
      });
      console.log(`✓ ${endpoint.method} ${endpoint.url} - ${response.status}`);
    } catch (error) {
      console.log(`✗ ${endpoint.method} ${endpoint.url} - ${error.response?.status}`);
    }
  }
}

testEndpoints();
```

Run with:
```bash
node test-master-integration.js
```

---

## Environment Variables

Ensure your `.env` file includes:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/coding_club

# JWT
JWT_SECRET=your_secret_key_here
JWT_EXPIRY=7d

# Master Account (if using default master)
MASTER_USERNAME=master
MASTER_PASSWORD=SecurePassword123!
```

**Note**: Don't hardcode master credentials in code. Use environment variables.

---

## API Endpoint Summary

After integration, these endpoints will be available:

### Admin Management
- `POST /api/master/create-admin` - Create admin
- `DELETE /api/master/remove-admin/:id` - Deactivate admin
- `PUT /api/master/reactivate-admin/:id` - Reactivate admin

### User Management
- `GET /api/master/users` - List all users
- `DELETE /api/master/remove-user/:id` - Remove user (3-step)

### Past Event Management
- `POST /api/master/event/past/add` - Create past event
- `PUT /api/master/event/past/edit/:id` - Update past event
- `DELETE /api/master/event/past/delete/:id` - Delete past event

### Statistics
- `GET /api/master/stats` - Get system statistics
- `GET /api/master/stats/export` - Export system data

All endpoints protected with master-only authentication.

---

## Troubleshooting

### Issue: "Cannot find module 'masterController'"

**Solution**: 
- Verify file location: `server/controllers/masterController.js`
- Check import path in routes file
- Ensure file extension is `.js`

### Issue: "roleMiddleware is not a function"

**Solution**:
- Check middleware export: `module.exports = ...`
- Verify path in masterRoutes.js import
- Check middleware accepts array of roles

### Issue: "Route not found (404)"

**Solution**:
- Verify route is registered in server.js
- Check spelling: `/api/master` (not `/api/masters`)
- Restart server after adding routes
- Check middleware order (should be before route registration)

### Issue: "Cluster not found" on every request

**Solution**:
- Verify Cluster model import in masterController.js
- Check database has cluster documents
- Verify cluster IDs are ObjectIds

### Issue: "Password hashing fails"

**Solution**:
- Verify bcryptjs is installed: `npm install bcryptjs`
- Check bcryptjs version compatibility
- Ensure password is string before hashing

### Issue: "Token verification fails"

**Solution**:
- Verify JWT_SECRET in .env matches server.js
- Check token hasn't expired
- Verify token format: `Bearer <token>`
- Check authenticate middleware is applied

### Issue: Response shows passwords

**Solution**:
- Verify password fields are excluded in queries
- Check `.select('-password')` is used in User/Admin queries
- Review response formatting in utils

---

## Performance Optimization

### Database Indexing

Create indexes for better performance:

```javascript
// In your database initialization:
db.users.createIndex({ email: 1 });
db.users.createIndex({ srn: 1 });
db.users.createIndex({ class: 1 });
db.admins.createIndex({ username: 1 });
db.admins.createIndex({ email: 1 });
db.admins.createIndex({ cluster: 1 });
db.events.createIndex({ cluster: 1 });
db.events.createIndex({ date: 1 });
db.events.createIndex({ eventType: 1 });
```

### Query Optimization

The controller already uses efficient patterns:
- `.select('-password')` to exclude passwords
- `.populate()` for related data
- `.limit()` and `.skip()` for pagination
- Aggregation pipelines for statistics

### Response Caching

For stats endpoint, consider adding caching:

```javascript
// Add to masterController.js if needed:
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 300 }); // 5 minutes

// In getSystemStats:
const cachedStats = cache.get('system_stats');
if (cachedStats) {
  return sendSuccess(res, cachedStats, 'System statistics retrieved (cached)');
}
// ... calculate stats ...
cache.set('system_stats', stats);
```

---

## Verification Checklist

After integration, verify:

- [ ] `masterController.js` exists in `server/controllers/`
- [ ] `masterRoutes.js` exists in `server/routes/`
- [ ] Route import added to `server.js`
- [ ] Route registration added to `server.js`
- [ ] Server starts without errors
- [ ] Authentication middleware working
- [ ] Role middleware working
- [ ] All 9 endpoints respond (even if with 401/403)
- [ ] Master token properly verified
- [ ] Database models accessible
- [ ] No console errors on startup
- [ ] Response format consistent

---

## Next Steps

1. ✅ Integration complete
2. Run tests from [MASTER_API_TESTING_GUIDE.md](./MASTER_API_TESTING_GUIDE.md)
3. Deploy to staging environment
4. Load test with production-like data
5. Monitor logs for errors
6. Gradual rollout to production

---

## Support & Updates

For issues or feature requests:
1. Check this guide's troubleshooting section
2. Review error logs in console
3. Check API documentation for endpoint details
4. Verify environment variables are set

---

