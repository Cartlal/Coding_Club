# Admin API Integration Guide

## Overview

This guide explains how to integrate the Admin API routes and controllers into your main Express server application.

## File Structure

```
server/
├── controllers/
│   ├── userController.js       (existing - user endpoints)
│   ├── adminController.js      (new - admin endpoints)
│   ├── authController.js       (existing - authentication)
│   └── ...
├── routes/
│   ├── userRoutes.js          (existing)
│   ├── adminRoutes.js         (new)
│   ├── authRoutes.js          (existing)
│   └── ...
├── middleware/
│   ├── auth.js                (existing - authentication)
│   ├── roleMiddleware.js      (existing - role-based access)
│   └── ...
├── models/
│   ├── User.js                (existing)
│   ├── Event.js               (existing)
│   ├── Notice.js              (existing)
│   ├── Admin.js               (existing)
│   ├── Cluster.js             (existing)
│   └── ...
├── utils/
│   ├── response.js            (existing - sendSuccess/sendError)
│   └── ...
└── server.js or index.js      (main server file)
```

## Integration Steps

### Step 1: Import Routes in Main Server File

In your main server file (e.g., `server.js` or `index.js`):

```javascript
// ============================================
// IMPORT ROUTES
// ============================================

import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';  // ADD THIS LINE
import authRoutes from './routes/authRoutes.js';
// ... other imports
```

### Step 2: Register Admin Routes

Add the admin routes to your Express app after user routes and auth routes:

```javascript
// ============================================
// REGISTER ROUTES
// ============================================

// Authentication routes (no auth required)
app.use('/api/auth', authRoutes);

// User routes (auth required, user role)
app.use('/api/users', userRoutes);

// Admin routes (auth required, admin/master role)
app.use('/api/admin', adminRoutes);  // ADD THIS LINE

// ... other routes
```

**Important**: The order matters!
- Auth routes first (public access)
- User routes second
- Admin routes third
- Error handling last

### Step 3: Verify Middleware Stack

Ensure your authentication and role middleware are properly exported and available:

**File: `middleware/auth.js`**
```javascript
export const authenticate = (req, res, next) => {
  // ... implementation
};

export const authMiddleware = authenticate; // Alias for compatibility
```

**File: `middleware/roleMiddleware.js`**
```javascript
export const roleMiddleware = (allowedRoles) => {
  // ... implementation
};

export const adminOrMaster = (req, res, next) => {
  // ... implementation
};

export const masterOnly = (req, res, next) => {
  // ... implementation
};
```

### Step 4: Verify Response Utilities

Ensure sendSuccess and sendError are properly exported:

**File: `utils/response.js`**
```javascript
export const sendSuccess = (res, data, message = 'Success', statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const sendError = (res, message, statusCode = 500) => {
  res.status(statusCode).json({
    success: false,
    message,
    statusCode,
  });
};
```

### Step 5: Verify Models are Properly Exported

Ensure all required models are exported from your models:

**File: `models/index.js` (optional but recommended)**
```javascript
import User from './User.js';
import Event from './Event.js';
import Notice from './Notice.js';
import Admin from './Admin.js';
import Cluster from './Cluster.js';

export { User, Event, Notice, Admin, Cluster };
```

Or import directly in controller:
```javascript
import Admin from '../models/Admin.js';
import Event from '../models/Event.js';
import Notice from '../models/Notice.js';
import Cluster from '../models/Cluster.js';
import User from '../models/User.js';
```

### Step 6: Complete Example Server File

Here's a complete example of how your `server.js` should look:

```javascript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// ============================================
// MIDDLEWARE
// ============================================

// Body parser
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  })
);

// Request logging (optional)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ============================================
// DATABASE CONNECTION
// ============================================

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✓ MongoDB connected');
  } catch (error) {
    console.error('✗ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

connectDB();

// ============================================
// IMPORT ROUTES
// ============================================

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

// ============================================
// REGISTER ROUTES
// ============================================

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Coding Club API Server',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      admin: '/api/admin',
    },
  });
});

// Auth routes (public)
app.use('/api/auth', authRoutes);

// User routes (protected)
app.use('/api/users', userRoutes);

// Admin routes (protected, admin/master only)
app.use('/api/admin', adminRoutes);

// ============================================
// ERROR HANDLING
// ============================================

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    statusCode: 404,
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Error:', error);

  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message,
    statusCode,
    ...(process.env.NODE_ENV === 'development' && { error: error.stack }),
  });
});

// ============================================
// START SERVER
// ============================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n╔════════════════════════════════════╗`);
  console.log(`║  Coding Club API Server Running   ║`);
  console.log(`║  Port: ${PORT.toString().padEnd(30)}║`);
  console.log(`║  URL: http://localhost:${PORT.toString().padEnd(25)}║`);
  console.log(`╚════════════════════════════════════╝\n`);
  console.log('Available Routes:');
  console.log('  - GET  http://localhost:' + PORT);
  console.log('  - POST http://localhost:' + PORT + '/api/auth/login');
  console.log('  - GET  http://localhost:' + PORT + '/api/users/profile');
  console.log('  - POST http://localhost:' + PORT + '/api/admin/event/add');
  console.log('  - GET  http://localhost:' + PORT + '/api/admin/stats');
});

export default app;
```

## Environment Variables

Add these to your `.env` file:

```env
# Server
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000

# Database
MONGODB_URI=mongodb://localhost:27017/coding-club

# JWT
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=7d

# Admin credentials
MASTER_USERNAME=master
MASTER_PASSWORD=secure_password_here
```

## API Base URL

Once integrated, all API endpoints will be available at:

```
http://localhost:5000/api/admin/...
```

## Quick Route Reference

### Event Management
```
POST   /api/admin/event/add                    - Create event
PUT    /api/admin/event/edit/:id               - Edit event
DELETE /api/admin/event/delete/:id             - Delete event
GET    /api/admin/event/:id/participants       - Get participants
POST   /api/admin/event/:id/participants/add   - Add participants
POST   /api/admin/event/:id/winners            - Declare winners
```

### Notice Board
```
POST   /api/admin/notice/add                   - Create notice
GET    /api/admin/notice/all                   - Get all notices
PUT    /api/admin/notice/edit/:id              - Edit notice
DELETE /api/admin/notice/delete/:id            - Delete notice
```

### Statistics
```
GET    /api/admin/stats                        - Get overall stats
GET    /api/admin/stats/cluster/:clusterId     - Get cluster stats
```

## Testing Integration

### 1. Test Server Startup

```bash
npm start
# Should see:
# ✓ MongoDB connected
# Coding Club API Server Running
# Port: 5000
```

### 2. Test Root Endpoint

```bash
curl http://localhost:5000/
```

Response:
```json
{
  "message": "Coding Club API Server",
  "version": "1.0.0",
  "endpoints": {
    "auth": "/api/auth",
    "users": "/api/users",
    "admin": "/api/admin"
  }
}
```

### 3. Test Admin Routes (Requires Token)

```bash
# First, get an admin token
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password"}'

# Then test admin endpoint
curl -X POST http://localhost:5000/api/admin/event/add \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{...event data...}'
```

## Troubleshooting Integration Issues

### Issue 1: "Cannot find module 'adminRoutes'"

**Solution**: Verify the file path is correct
```javascript
// ✓ Correct
import adminRoutes from './routes/adminRoutes.js';

// ✗ Wrong
import adminRoutes from './routes/adminRoutes'; // Missing .js extension
import adminRoutes from '../routes/adminRoutes.js'; // Wrong path
```

### Issue 2: "authenticate is not a function"

**Solution**: Verify middleware is properly exported in `auth.js`
```javascript
// Make sure this exists in auth.js:
export const authenticate = (req, res, next) => { ... };
```

### Issue 3: Routes not working - 404 errors

**Solution**: Ensure routes are registered before error handlers
```javascript
// ✓ Correct order
app.use('/api/admin', adminRoutes);
app.use((req, res) => { /* 404 handler */ });

// ✗ Wrong order (routes registered after 404 handler)
app.use((req, res) => { /* 404 handler */ });
app.use('/api/admin', adminRoutes);
```

### Issue 4: CORS errors

**Solution**: Ensure CORS is configured before routes
```javascript
// CORS must be before routes
app.use(cors({ ... }));
app.use('/api/admin', adminRoutes);
```

### Issue 5: Missing response utilities

**Solution**: Verify `response.js` is properly created and exported
```javascript
// In adminController.js
import { sendSuccess, sendError } from '../utils/response.js';
```

## Dependencies Check

Ensure all required packages are installed:

```bash
npm list express mongoose cors dotenv jsonwebtoken bcryptjs
```

Should show all installed. If missing, install:

```bash
npm install express mongoose cors dotenv jsonwebtoken bcryptjs
```

## Database Requirements

Ensure these models exist in your MongoDB:
- Users collection
- Events collection
- Notices collection
- Admins collection
- Clusters collection

Check in MongoDB:
```javascript
// In MongoDB shell
show dbs
use coding-club
show collections
// Should see: users, events, notices, admins, clusters
```

## Performance Considerations

1. **Indexing**: Ensure these indexes exist:
   ```javascript
   // Event.js
   event.collection.createIndex({ cluster: 1, eventType: 1 });
   
   // Notice.js
   notice.collection.createIndex({ cluster: 1, createdAt: -1 });
   
   // Admin.js
   admin.collection.createIndex({ cluster: 1, role: 1 });
   ```

2. **Pagination**: All list endpoints support pagination with `limit` and `page` parameters

3. **Population**: Queries populate references, may affect performance with large datasets

## Security Checklist

- [ ] JWT_SECRET is strong and unique
- [ ] CORS is properly configured
- [ ] Role middleware is enforced on all admin routes
- [ ] Cluster authorization checks are in place
- [ ] Input validation is performed
- [ ] Error messages don't expose sensitive data
- [ ] Sensitive fields are excluded from responses

## Next Steps

1. **Run server**: `npm start`
2. **Test endpoints**: Use Postman collection provided
3. **Monitor logs**: Check console for errors
4. **Deploy**: Follow deployment guide

## Support & Maintenance

- For API issues: Check `ADMIN_API_DOCUMENTATION.md`
- For testing: Check `ADMIN_API_TESTING_GUIDE.md`
- For errors: Enable debug logging in `.env`

---

