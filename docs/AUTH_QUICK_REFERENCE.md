# Authentication System - Quick Reference

## 🚀 Quick Start

### User Registration
```bash
POST /auth/user/register
Content-Type: application/json

{
  "fullName": "John Doe",
  "email": "john@example.com",
  "srn": "CS21001",
  "year": "2nd Year",
  "branch": "CSE",
  "division": "A",
  "password": "securePassword123",
  "profilePic": "data:image/jpeg;base64,..." (optional)
}

Response: { user, token }
```

### User Login
```bash
POST /auth/user/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}

Response: { user, token }
```

### Admin Login
```bash
POST /auth/admin/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "adminPassword123"
}

Response: { admin, token }
```

### Master Login
```bash
POST /auth/master/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}

Response: { master, token }
```

---

## 🔐 Protected Routes

All protected routes require:
```
Authorization: Bearer <token>
```

### Get Current User Profile
```bash
GET /auth/me
Headers: Authorization: Bearer <token>

Response: { user | admin | master }
```

### Update User Profile (users only)
```bash
PUT /auth/profile
Headers: Authorization: Bearer <token>
Content-Type: application/json

{
  "fullName": "Updated Name",
  "bio": "My bio",
  "profilePic": "data:image/jpeg;base64,..."
}

Response: { user }
```

### Verify Token
```bash
GET /auth/verify
Headers: Authorization: Bearer <token>

Response: { isValid: true, role: "user|admin|master" }
```

---

## 🛡️ Role-Based Access Control

### Apply Role Middleware to Routes

```javascript
import { authenticate } from '../middleware/auth.js';
import { roleMiddleware, masterOnly, adminOrMaster } from '../middleware/roleMiddleware.js';

// Single role check
router.post('/user-action', authenticate, roleMiddleware('user'), controller);

// Multiple roles
router.delete('/admin-action', authenticate, roleMiddleware(['admin', 'master']), controller);

// Master only
router.post('/system-action', authenticate, masterOnly, controller);

// Admin or Master
router.post('/critical-action', authenticate, adminOrMaster, controller);
```

---

## 📋 Middleware Reference

### Authentication Middleware
- `authenticate()` - Verify JWT token
- `optionalAuth()` - Optional authentication
- `authorize(role)` - Check specific role
- `adminOrMaster()` - Admin or master check
- `masterOnly()` - Master only
- `userOnly()` - User only
- `checkRoles(array)` - Multi-role check
- `verifyOwnership()` - Verify user owns resource

### Role Middleware
- `roleMiddleware(role|array)` - General role checker
- `masterOnly()` - Master only
- `adminOrMaster()` - Admin or master
- `userOnly()` - User only
- `captureRole()` - Capture role for logging

### Master Validation Middleware
- `validateMasterCredentials()` - Validate hardcoded credentials
- `requireMasterRole()` - Check JWT has master role
- `optionalMasterCheck()` - Optional master verification
- `logMasterAccess()` - Log master access attempts

---

## 💾 Environment Variables (.env)

```env
# MongoDB Configuration
MONGO_URI=mongodb://localhost:27017/arcstack-coding-club

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Master Account (Hardcoded Credentials)
MASTER_USERNAME=admin
MASTER_PASSWORD=admin123

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

---

## 🎯 Common Patterns

### Protect User-Only Routes
```javascript
router.post(
  '/register-event',
  authenticate,
  roleMiddleware('user'),
  registerEventController
);
```

### Admin Management Routes
```javascript
router.post(
  '/create-event',
  authenticate,
  roleMiddleware('admin'),
  createEventController
);
```

### System Administration (Master/Admin)
```javascript
router.delete(
  '/reset-event/:id',
  authenticate,
  roleMiddleware(['admin', 'master']),
  resetEventController
);
```

### Master-Only Operations
```javascript
router.post(
  '/system/backup',
  authenticate,
  masterOnly,
  backupSystemController
);
```

---

## 🔍 Token Structure

### User/Admin Token
```json
{
  "userId": "507f1f77bcf86cd799439011",
  "role": "user" | "admin",
  "iat": 1702094400,
  "exp": 1702699200
}
```

### Master Token
```json
{
  "masterUsername": "admin",
  "role": "master",
  "iat": 1702094400,
  "exp": 1702699200
}
```

---

## 🚨 Error Codes

| Status | Error | Cause |
|--------|-------|-------|
| 400 | Required fields missing | Incomplete request body |
| 401 | Invalid credentials | Wrong email/password/username |
| 401 | Token required | Missing Authorization header |
| 401 | Invalid token | Malformed or expired token |
| 403 | Access denied | Insufficient role permissions |
| 404 | Not found | User/admin doesn't exist |
| 409 | Already exists | Email or SRN duplicate |

---

## 📱 Frontend Example

### User Registration
```javascript
const handleSignup = async (formData) => {
  try {
    const response = await fetch('/api/auth/user/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: formData.fullName,
        email: formData.email,
        srn: formData.srn,
        year: formData.year,
        branch: formData.branch,
        division: formData.division,
        password: formData.password,
      }),
    });

    const { data } = await response.json();
    localStorage.setItem('authToken', data.token);
    localStorage.setItem('userRole', data.user.role);
    navigate('/dashboard');
  } catch (error) {
    console.error('Signup failed:', error);
  }
};
```

### Protected API Call
```javascript
const fetchProfile = async () => {
  const token = localStorage.getItem('authToken');
  const response = await fetch('/api/auth/me', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (response.status === 401) {
    localStorage.removeItem('authToken');
    navigate('/login');
  }

  return response.json();
};
```

### Using Axios Interceptor
```javascript
import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Usage: const data = await api.get('/auth/me');
```

---

## ✅ Testing Checklist

- [ ] User can register with valid data
- [ ] User cannot register with duplicate email/SRN
- [ ] User can login with correct credentials
- [ ] User cannot login with wrong password
- [ ] User receives valid JWT token
- [ ] Protected routes return 401 without token
- [ ] Protected routes return 403 with wrong role
- [ ] Admin can login with valid credentials
- [ ] Master can login with .env credentials
- [ ] Token contains correct role
- [ ] User can fetch their own profile
- [ ] User can update their profile
- [ ] Admin can verify admin token
- [ ] Master can verify master token

---

## 🔒 Security Notes

1. **Password Security**
   - Minimum 6 characters
   - Hashed with bcryptjs (10 rounds)
   - Never returned in API responses

2. **JWT Security**
   - 7-day expiration
   - HMAC-SHA256 algorithm
   - Change JWT_SECRET in production

3. **Master Account**
   - Hardcoded credentials in .env
   - Constant-time comparison
   - Timing attack prevention

4. **Error Handling**
   - Generic error messages (don't reveal if email exists)
   - Proper HTTP status codes
   - No stack traces in production

---

## 📞 Support

For detailed documentation, see `AUTHENTICATION_GUIDE.js`

For implementation questions, check the example controllers in `authController.js`

For route definitions, review `authRoutes.js`
