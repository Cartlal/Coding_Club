# Authentication System - Testing Guide

## 🧪 Complete Testing Workflow

This guide provides step-by-step instructions to test the complete authentication system.

---

## Prerequisites

1. Backend server running on `http://localhost:5000`
2. MongoDB running on `mongodb://localhost:27017`
3. `.env` file configured with:
   ```env
   MONGO_URI=mongodb://localhost:27017/arcstack-coding-club
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   MASTER_USERNAME=admin
   MASTER_PASSWORD=admin123
   PORT=5000
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:3000
   ```

---

## Test 1: User Registration

### ✅ Valid User Registration

```bash
curl -X POST http://localhost:5000/api/auth/user/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "email": "john@example.com",
    "srn": "CS21001",
    "year": "2nd Year",
    "branch": "CSE",
    "division": "A",
    "password": "securePassword123"
  }'
```

**Expected Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "fullName": "John Doe",
      "email": "john@example.com",
      "srn": "CS21001",
      "role": "user",
      "class": {
        "year": "2nd Year",
        "branch": "CSE",
        "division": "A"
      }
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "timestamp": "2025-12-08T10:30:00.000Z"
}
```

### ❌ Duplicate Email Registration

```bash
curl -X POST http://localhost:5000/api/auth/user/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Another User",
    "email": "john@example.com",
    "srn": "CS21002",
    "year": "2nd Year",
    "branch": "CSE",
    "division": "A",
    "password": "password123"
  }'
```

**Expected Response (409):**
```json
{
  "success": false,
  "message": "Email or SRN already exists",
  "errors": null,
  "timestamp": "2025-12-08T10:35:00.000Z"
}
```

### ❌ Missing Required Fields

```bash
curl -X POST http://localhost:5000/api/auth/user/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "email": "test@example.com"
  }'
```

**Expected Response (400):**
```json
{
  "success": false,
  "message": "All fields are required",
  "errors": null,
  "timestamp": "2025-12-08T10:40:00.000Z"
}
```

---

## Test 2: User Login

### ✅ Valid User Login

```bash
curl -X POST http://localhost:5000/api/auth/user/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securePassword123"
  }'
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "fullName": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "lastLogin": "2025-12-08T10:45:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "timestamp": "2025-12-08T10:45:00.000Z"
}
```

**Save the token for later tests:**
```bash
$USER_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### ❌ Invalid Password

```bash
curl -X POST http://localhost:5000/api/auth/user/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "wrongPassword"
  }'
```

**Expected Response (401):**
```json
{
  "success": false,
  "message": "Invalid email or password",
  "errors": null,
  "timestamp": "2025-12-08T10:50:00.000Z"
}
```

### ❌ Non-existent Email

```bash
curl -X POST http://localhost:5000/api/auth/user/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "nonexistent@example.com",
    "password": "anyPassword"
  }'
```

**Expected Response (401):**
```json
{
  "success": false,
  "message": "Invalid email or password",
  "errors": null,
  "timestamp": "2025-12-08T10:55:00.000Z"
}
```

---

## Test 3: Master Login

### ✅ Valid Master Login

```bash
curl -X POST http://localhost:5000/api/auth/master/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Master login successful",
  "data": {
    "master": {
      "username": "admin",
      "role": "master",
      "accessLevel": "full_system_access",
      "createdAt": "2025-12-08T11:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "timestamp": "2025-12-08T11:00:00.000Z"
}
```

**Save the token for later tests:**
```bash
$MASTER_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### ❌ Invalid Master Credentials

```bash
curl -X POST http://localhost:5000/api/auth/master/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "wrongPassword"
  }'
```

**Expected Response (401):**
```json
{
  "success": false,
  "message": "Invalid master credentials",
  "errors": null,
  "timestamp": "2025-12-08T11:05:00.000Z"
}
```

### ❌ Missing Credentials

```bash
curl -X POST http://localhost:5000/api/auth/master/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin"
  }'
```

**Expected Response (400):**
```json
{
  "success": false,
  "message": "Username and password are required for master login",
  "errors": null,
  "timestamp": "2025-12-08T11:10:00.000Z"
}
```

---

## Test 4: Protected Routes - Get Current User

### ✅ Valid Token (User)

```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer $USER_TOKEN"
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "User profile retrieved successfully",
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "fullName": "John Doe",
      "email": "john@example.com",
      "role": "user"
    }
  },
  "timestamp": "2025-12-08T11:15:00.000Z"
}
```

### ✅ Valid Token (Master)

```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer $MASTER_TOKEN"
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Master profile retrieved successfully",
  "data": {
    "master": {
      "username": "admin",
      "role": "master",
      "accessLevel": "full_system_access"
    }
  },
  "timestamp": "2025-12-08T11:20:00.000Z"
}
```

### ❌ Missing Token

```bash
curl -X GET http://localhost:5000/api/auth/me
```

**Expected Response (401):**
```json
{
  "success": false,
  "message": "Authorization token is required",
  "errors": null,
  "timestamp": "2025-12-08T11:25:00.000Z"
}
```

### ❌ Invalid Token

```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer invalidToken123"
```

**Expected Response (401):**
```json
{
  "success": false,
  "message": "Invalid token",
  "errors": null,
  "timestamp": "2025-12-08T11:30:00.000Z"
}
```

### ❌ Malformed Authorization Header

```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: $USER_TOKEN"
```

**Expected Response (401):**
```json
{
  "success": false,
  "message": "Authorization token is required",
  "errors": null,
  "timestamp": "2025-12-08T11:35:00.000Z"
}
```

---

## Test 5: Update User Profile

### ✅ Valid Profile Update (User Token Only)

```bash
curl -X PUT http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer $USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Updated",
    "bio": "My awesome bio"
  }'
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "fullName": "John Updated",
      "bio": "My awesome bio",
      "email": "john@example.com",
      "role": "user"
    }
  },
  "timestamp": "2025-12-08T11:40:00.000Z"
}
```

### ❌ Admin Token Cannot Update Profile

```bash
curl -X PUT http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Admin Update"
  }'
```

**Expected Response (403):**
```json
{
  "success": false,
  "message": "Only users can update their profile",
  "errors": null,
  "timestamp": "2025-12-08T11:45:00.000Z"
}
```

### ❌ Master Token Cannot Update Profile

```bash
curl -X PUT http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer $MASTER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Master Update"
  }'
```

**Expected Response (403):**
```json
{
  "success": false,
  "message": "Only users can update their profile",
  "errors": null,
  "timestamp": "2025-12-08T11:50:00.000Z"
}
```

---

## Test 6: Token Verification Endpoints

### ✅ Generic Token Verification (With Token)

```bash
curl -X GET http://localhost:5000/api/auth/verify \
  -H "Authorization: Bearer $USER_TOKEN"
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Token is valid",
  "data": {
    "isValid": true,
    "role": "user",
    "authenticated": true
  },
  "timestamp": "2025-12-08T12:00:00.000Z"
}
```

### ✅ Generic Token Verification (Without Token)

```bash
curl -X GET http://localhost:5000/api/auth/verify
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "No valid token provided",
  "data": {
    "isValid": false,
    "role": null,
    "authenticated": false
  },
  "timestamp": "2025-12-08T12:05:00.000Z"
}
```

### ✅ Admin Token Verification

```bash
curl -X GET http://localhost:5000/api/auth/admin/verify \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Admin token is valid",
  "data": {
    "isValid": true,
    "role": "admin"
  },
  "timestamp": "2025-12-08T12:10:00.000Z"
}
```

### ❌ User Token on Admin Verification

```bash
curl -X GET http://localhost:5000/api/auth/admin/verify \
  -H "Authorization: Bearer $USER_TOKEN"
```

**Expected Response (403):**
```json
{
  "success": false,
  "message": "Access denied. Required roles: admin. Your role: user",
  "errors": null,
  "timestamp": "2025-12-08T12:15:00.000Z"
}
```

### ✅ Master Token Verification

```bash
curl -X GET http://localhost:5000/api/auth/master/verify \
  -H "Authorization: Bearer $MASTER_TOKEN"
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Master token is valid",
  "data": {
    "isValid": true,
    "role": "master",
    "masterUsername": "admin"
  },
  "timestamp": "2025-12-08T12:20:00.000Z"
}
```

### ❌ User Token on Master Verification

```bash
curl -X GET http://localhost:5000/api/auth/master/verify \
  -H "Authorization: Bearer $USER_TOKEN"
```

**Expected Response (403):**
```json
{
  "success": false,
  "message": "Access denied. Required roles: master. Your role: user",
  "errors": null,
  "timestamp": "2025-12-08T12:25:00.000Z"
}
```

---

## Test 7: Admin Login (If Admin Exists in Database)

### Prerequisites
First, create an admin in the database:

```javascript
// In MongoDB or using app
db.admins.insertOne({
  username: "admin_user",
  email: "admin@example.com",
  password: "hashedPassword", // Must be hashed with bcryptjs
  role: "admin",
  permissions: {
    manageUsers: true,
    manageEvents: true,
    manageBadges: true,
    manageNotices: true,
    manageAdmins: false
  }
});
```

### ✅ Valid Admin Login

```bash
curl -X POST http://localhost:5000/api/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "adminPassword123"
  }'
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Admin login successful",
  "data": {
    "admin": {
      "_id": "507f1f77bcf86cd799439012",
      "username": "admin_user",
      "email": "admin@example.com",
      "role": "admin",
      "permissions": {
        "manageUsers": true,
        "manageEvents": true,
        "manageBadges": true,
        "manageNotices": true,
        "manageAdmins": false
      }
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "timestamp": "2025-12-08T12:30:00.000Z"
}
```

---

## PowerShell Testing Script

```powershell
# Save as: test-auth.ps1

$BASE_URL = "http://localhost:5000/api/auth"

# Test 1: User Registration
Write-Host "Test 1: User Registration" -ForegroundColor Green
$body = @{
    fullName = "Test User"
    email = "test@example.com"
    srn = "CS21001"
    year = "2nd Year"
    branch = "CSE"
    division = "A"
    password = "testPassword123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "$BASE_URL/user/register" -Method POST `
  -Headers @{"Content-Type"="application/json"} -Body $body
$USER_TOKEN = $response.data.token
Write-Host "✅ Registration successful. Token: $($USER_TOKEN.Substring(0, 20))..." -ForegroundColor Green

# Test 2: User Login
Write-Host "`nTest 2: User Login" -ForegroundColor Green
$body = @{
    email = "test@example.com"
    password = "testPassword123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "$BASE_URL/user/login" -Method POST `
  -Headers @{"Content-Type"="application/json"} -Body $body
Write-Host "✅ Login successful" -ForegroundColor Green

# Test 3: Master Login
Write-Host "`nTest 3: Master Login" -ForegroundColor Green
$body = @{
    username = "admin"
    password = "admin123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "$BASE_URL/master/login" -Method POST `
  -Headers @{"Content-Type"="application/json"} -Body $body
$MASTER_TOKEN = $response.data.token
Write-Host "✅ Master login successful. Token: $($MASTER_TOKEN.Substring(0, 20))..." -ForegroundColor Green

# Test 4: Get Current User
Write-Host "`nTest 4: Get Current User" -ForegroundColor Green
$response = Invoke-RestMethod -Uri "$BASE_URL/me" -Method GET `
  -Headers @{"Authorization"="Bearer $USER_TOKEN"}
Write-Host "✅ Current user: $($response.data.user.fullName)" -ForegroundColor Green

# Test 5: Update Profile
Write-Host "`nTest 5: Update Profile" -ForegroundColor Green
$body = @{
    fullName = "Updated Name"
    bio = "My updated bio"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "$BASE_URL/profile" -Method PUT `
  -Headers @{"Authorization"="Bearer $USER_TOKEN"; "Content-Type"="application/json"} `
  -Body $body
Write-Host "✅ Profile updated: $($response.data.user.fullName)" -ForegroundColor Green

# Test 6: Verify Token
Write-Host "`nTest 6: Verify Token" -ForegroundColor Green
$response = Invoke-RestMethod -Uri "$BASE_URL/verify" -Method GET `
  -Headers @{"Authorization"="Bearer $USER_TOKEN"}
Write-Host "✅ Token is valid. Role: $($response.data.role)" -ForegroundColor Green

Write-Host "`n✅ All tests completed successfully!" -ForegroundColor Green
```

**Run the script:**
```powershell
.\test-auth.ps1
```

---

## ✅ Complete Test Checklist

- [ ] User Registration (Valid)
- [ ] User Registration (Duplicate Email)
- [ ] User Registration (Missing Fields)
- [ ] User Login (Valid)
- [ ] User Login (Invalid Password)
- [ ] User Login (Non-existent Email)
- [ ] Master Login (Valid)
- [ ] Master Login (Invalid Credentials)
- [ ] Master Login (Missing Credentials)
- [ ] Get Current User (Valid Token - User)
- [ ] Get Current User (Valid Token - Master)
- [ ] Get Current User (Missing Token)
- [ ] Get Current User (Invalid Token)
- [ ] Get Current User (Malformed Header)
- [ ] Update Profile (Valid - User Token)
- [ ] Update Profile (Admin Token - Should Fail)
- [ ] Update Profile (Master Token - Should Fail)
- [ ] Generic Token Verification (With Token)
- [ ] Generic Token Verification (Without Token)
- [ ] Admin Token Verification
- [ ] User Token on Admin Verification (Should Fail)
- [ ] Master Token Verification
- [ ] User Token on Master Verification (Should Fail)

---

## 🐛 Troubleshooting

### Issue: "MongoError: connect ECONNREFUSED"
**Solution:** Ensure MongoDB is running
```bash
# Start MongoDB (if using Docker)
docker run -d -p 27017:27017 --name mongodb mongo
```

### Issue: "JWT_SECRET is not defined"
**Solution:** Ensure .env file exists and is loaded
```bash
# Check .env file
cat .env

# Restart server to reload .env
```

### Issue: "CORS error" in frontend
**Solution:** Update CORS_ORIGIN in .env
```env
CORS_ORIGIN=http://localhost:3000
```

### Issue: "Invalid master credentials"
**Solution:** Verify .env contains correct master credentials
```env
MASTER_USERNAME=admin
MASTER_PASSWORD=admin123
```

---

## 📊 Test Summary

Once all tests pass, you can be confident that:
✅ User registration works correctly
✅ User login with password verification works
✅ Master login with hardcoded credentials works
✅ JWT tokens are generated correctly
✅ Protected routes enforce authentication
✅ Role-based access control works
✅ Error handling is appropriate
✅ All HTTP status codes are correct
✅ Responses follow the standardized format

---

## Next: Frontend Integration

Once all backend tests pass, integrate with:
- `client/src/pages/Login.jsx` - Update login form
- `client/src/pages/Signup.jsx` - Update signup form
- Create authentication context in React
- Create protected route components
- Add API interceptors for token handling
