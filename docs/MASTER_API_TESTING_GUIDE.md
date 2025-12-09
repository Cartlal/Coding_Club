# Master APIs Testing Guide

Complete testing guide for all master-only endpoints with examples, setup instructions, and test cases.

## Table of Contents
1. [Test Setup](#test-setup)
2. [Test Data](#test-data)
3. [Test Cases](#test-cases)
4. [Integration Testing](#integration-testing)
5. [Performance Testing](#performance-testing)

---

## Test Setup

### Prerequisites
- Node.js and npm installed
- MongoDB running locally or remote
- API server running on port 5000
- Postman or similar HTTP client (or use curl/PowerShell)

### Test Environment Setup

```bash
# Install dependencies
npm install

# Start MongoDB (if local)
mongod

# Start the server
npm start
# Server runs on http://localhost:5000
```

### Master Account Setup

Create a test master account in MongoDB:

```javascript
// Connect to MongoDB and run:
db.admins.insertOne({
  fullName: "Test Master",
  username: "testmaster",
  email: "testmaster@example.com",
  password: "$2a$10$...", // bcryptjs hashed password
  role: "master",
  cluster: ObjectId("cluster_id"),
  isActive: true,
  createdAt: new Date()
})
```

Or create via API if other masters exist.

### Get Master Token

```bash
# Login to get token (assuming login endpoint exists)
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "username": "testmaster",
  "password": "TestPassword123!"
}

# Response includes:
# {
#   "token": "eyJhbGciOiJIUzI1NiIs..."
# }
```

**Store this token** for use in all test requests:
```bash
TOKEN="eyJhbGciOiJIUzI1NiIs..."
```

---

## Test Data

### Test Clusters

```javascript
// Create test clusters
db.clusters.insertMany([
  {
    _id: ObjectId(),
    name: "Programming",
    icon: "💻",
    color: "#3b82f6"
  },
  {
    _id: ObjectId(),
    name: "Design",
    icon: "🎨",
    color: "#ec4899"
  },
  {
    _id: ObjectId(),
    name: "Marketing",
    icon: "📢",
    color: "#f59e0b"
  }
])
```

### Test Users

```javascript
// Create test users
db.users.insertMany([
  {
    _id: ObjectId(),
    fullName: "Test User 1",
    email: "user1@example.com",
    class: "3rd Year",
    srn: "PES0001001",
    password: "$2a$10$...", // hashed
    isActive: true
  },
  {
    _id: ObjectId(),
    fullName: "Test User 2",
    email: "user2@example.com",
    class: "2nd Year",
    srn: "PES0002002",
    password: "$2a$10$...", // hashed
    isActive: true
  }
])
```

### Test Event

```javascript
// Create a past event for testing
db.events.insertOne({
  _id: ObjectId(),
  title: "Test Workshop 2023",
  description: "Test event for past event management",
  eventType: "past",
  date: new Date("2023-12-15"),
  cluster: ObjectId("cluster_id"),
  createdBy: ObjectId("master_id"),
  isActive: true
})
```

---

## Test Cases

### TEST SUITE 1: Admin Management

#### Test 1.1: Create Admin - Success

**Test ID**: `MASTER-ADMIN-001`

```bash
curl -X POST http://localhost:5000/api/master/create-admin \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "New Admin",
    "username": "newadmin",
    "email": "newadmin@example.com",
    "password": "SecurePass123!",
    "cluster": "cluster_id_here"
  }'
```

**Expected Response**: 
- Status: 201 Created
- Contains admin ID, name, username, email, cluster
- Password NOT included in response
- `createdBy` points to master

**Assertion**:
```javascript
assert.equal(response.status, 201);
assert.equal(response.data.data.fullName, "New Admin");
assert.equal(response.data.data.role, "admin");
assert.isUndefined(response.data.data.password);
```

---

#### Test 1.2: Create Admin - Duplicate Username

**Test ID**: `MASTER-ADMIN-002`

```bash
# Create first admin
curl -X POST http://localhost:5000/api/master/create-admin \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Admin 1",
    "username": "duplicateuser",
    "email": "admin1@example.com",
    "password": "SecurePass123!",
    "cluster": "cluster_id"
  }'

# Attempt to create second admin with same username
curl -X POST http://localhost:5000/api/master/create-admin \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Admin 2",
    "username": "duplicateuser",
    "email": "admin2@example.com",
    "password": "SecurePass123!",
    "cluster": "cluster_id"
  }'
```

**Expected Response**:
- Status: 409 Conflict
- Message: "Username already exists"

**Assertion**:
```javascript
assert.equal(response.status, 409);
assert.include(response.data.message, "Username already exists");
```

---

#### Test 1.3: Create Admin - Weak Password

**Test ID**: `MASTER-ADMIN-003`

```bash
curl -X POST http://localhost:5000/api/master/create-admin \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Admin Weak",
    "username": "weakpass",
    "email": "weakpass@example.com",
    "password": "short",
    "cluster": "cluster_id"
  }'
```

**Expected Response**:
- Status: 400 Bad Request
- Message about password minimum length

**Assertion**:
```javascript
assert.equal(response.status, 400);
assert.include(response.data.message, "8 characters");
```

---

#### Test 1.4: Create Admin - Cluster Not Found

**Test ID**: `MASTER-ADMIN-004`

```bash
curl -X POST http://localhost:5000/api/master/create-admin \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Admin NoCluster",
    "username": "nocluster",
    "email": "nocluster@example.com",
    "password": "SecurePass123!",
    "cluster": "invalid_cluster_id"
  }'
```

**Expected Response**:
- Status: 404 Not Found
- Message: "Cluster not found"

---

#### Test 1.5: Remove Admin - Success

**Test ID**: `MASTER-ADMIN-005`

```bash
# First, create an admin to remove
ADMIN_ID=$(curl -X POST http://localhost:5000/api/master/create-admin \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Admin To Remove",
    "username": "removetest",
    "email": "remove@example.com",
    "password": "SecurePass123!",
    "cluster": "cluster_id"
  }' | jq -r '.data._id')

# Now remove it
curl -X DELETE http://localhost:5000/api/master/remove-admin/$ADMIN_ID \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response**:
- Status: 200 OK
- Admin has `isActive: false`
- Contains `deactivatedAt` and `deactivatedBy`

**Assertion**:
```javascript
assert.equal(response.status, 200);
assert.equal(response.data.data.isActive, false);
assert.exists(response.data.data.deactivatedAt);
assert.exists(response.data.data.deactivatedBy);
```

---

#### Test 1.6: Remove Admin - Cannot Remove Master

**Test ID**: `MASTER-ADMIN-006`

```bash
# Get master account ID and try to remove it
curl -X DELETE http://localhost:5000/api/master/remove-admin/master_id \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response**:
- Status: 403 Forbidden
- Message: "Cannot remove master/superadmin accounts"

---

#### Test 1.7: Reactivate Admin

**Test ID**: `MASTER-ADMIN-007`

```bash
# Reactivate a deactivated admin
curl -X PUT http://localhost:5000/api/master/reactivate-admin/$ADMIN_ID \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response**:
- Status: 200 OK
- Admin has `isActive: true`
- `deactivatedAt` and `deactivatedBy` are null

**Assertion**:
```javascript
assert.equal(response.status, 200);
assert.equal(response.data.data.isActive, true);
assert.isNull(response.data.data.deactivatedAt);
```

---

### TEST SUITE 2: User Management

#### Test 2.1: Get All Users - Success

**Test ID**: `MASTER-USER-001`

```bash
curl -X GET "http://localhost:5000/api/master/users?limit=10&page=1" \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response**:
- Status: 200 OK
- Returns array of users (max 10)
- No passwords in response
- Contains pagination metadata

**Assertion**:
```javascript
assert.equal(response.status, 200);
assert.isArray(response.data.data.users);
assert.isAtMost(response.data.data.users.length, 10);
assert.exists(response.data.data.pagination);
response.data.data.users.forEach(u => {
  assert.isUndefined(u.password);
});
```

---

#### Test 2.2: Get All Users - With Class Filter

**Test ID**: `MASTER-USER-002`

```bash
curl -X GET "http://localhost:5000/api/master/users?class=3rd+Year&limit=20" \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response**:
- Status: 200 OK
- All returned users have `class: "3rd Year"`

**Assertion**:
```javascript
response.data.data.users.forEach(u => {
  assert.equal(u.class, "3rd Year");
});
```

---

#### Test 2.3: Get All Users - With Search

**Test ID**: `MASTER-USER-003`

```bash
curl -X GET "http://localhost:5000/api/master/users?search=john&limit=20" \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response**:
- Status: 200 OK
- Users with "john" in name, email, or SRN

**Assertion**:
```javascript
response.data.data.users.forEach(u => {
  const lowerSearch = "john".toLowerCase();
  const matches = 
    u.fullName.toLowerCase().includes(lowerSearch) ||
    u.email.toLowerCase().includes(lowerSearch) ||
    u.srn.toLowerCase().includes(lowerSearch);
  assert.isTrue(matches);
});
```

---

#### Test 2.4: Remove User - Step 1 (Generate Token)

**Test ID**: `MASTER-USER-004`

```bash
# Get a user ID to remove
USER_ID="user_id_here"

curl -X DELETE http://localhost:5000/api/master/remove-user/$USER_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"step": "1"}'
```

**Expected Response**:
- Status: 200 OK
- Contains `confirmationToken`
- Contains user info (name, email)
- Contains `removalInitiatedBy` and `removalInitiatedAt`

**Assertion**:
```javascript
assert.equal(response.status, 200);
assert.exists(response.data.data.confirmationToken);
assert.exists(response.data.data.removalInitiatedBy);
assert.include(response.data.message, "Step 1 complete");
```

**Save for next steps**:
```bash
TOKEN_STEP1=$(echo $response | jq -r '.data.confirmationToken')
USER_ID_TO_REMOVE=$USER_ID
```

---

#### Test 2.5: Remove User - Step 2 (Verify Password)

**Test ID**: `MASTER-USER-005`

```bash
# Using token from Step 1
curl -X DELETE http://localhost:5000/api/master/remove-user/$USER_ID_TO_REMOVE \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"step\": \"2\",
    \"password\": \"TestPassword123!\",
    \"confirmationToken\": \"$TOKEN_STEP1\"
  }"
```

**Expected Response**:
- Status: 200 OK
- Contains `verified: true`
- Message indicates Step 2 complete

**Assertion**:
```javascript
assert.equal(response.status, 200);
assert.equal(response.data.data.verified, true);
assert.include(response.data.message, "Step 2 complete");
```

---

#### Test 2.6: Remove User - Step 3 (Final Deletion)

**Test ID**: `MASTER-USER-006`

```bash
# Final deletion step
curl -X DELETE http://localhost:5000/api/master/remove-user/$USER_ID_TO_REMOVE \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"step\": \"3\",
    \"password\": \"TestPassword123!\"
  }"
```

**Expected Response**:
- Status: 200 OK
- Contains `deletedAt` and `deletedBy`
- Message indicates permanent deletion

**Assertion**:
```javascript
assert.equal(response.status, 200);
assert.exists(response.data.data.deletedAt);
assert.exists(response.data.data.deletedBy);
assert.include(response.data.message, "permanently deleted");
```

**Verify Deletion**:
```bash
# User should not be found
curl -X GET http://localhost:5000/api/master/users?search=$USER_ID \
  -H "Authorization: Bearer $TOKEN"
# Should return no results
```

---

#### Test 2.7: Remove User - Invalid Password Step 2

**Test ID**: `MASTER-USER-007`

```bash
# Step 2 with wrong password
curl -X DELETE http://localhost:5000/api/master/remove-user/$USER_ID_TO_REMOVE \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"step\": \"2\",
    \"password\": \"WrongPassword123!\",
    \"confirmationToken\": \"$TOKEN_STEP1\"
  }"
```

**Expected Response**:
- Status: 401 Unauthorized
- Message: "Invalid master password"

---

### TEST SUITE 3: Past Event Management

#### Test 3.1: Add Past Event - Success

**Test ID**: `MASTER-EVENT-001`

```bash
curl -X POST http://localhost:5000/api/master/event/past/add \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Programming Workshop - 2023",
    "description": "Historical workshop from 2023",
    "cluster": "cluster_id_here",
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
        "userId": "user_id_1",
        "rank": 1,
        "prize": "Gift Voucher - ₹1000",
        "pointsAwarded": 100
      },
      {
        "userId": "user_id_2",
        "rank": 2,
        "prize": "Gift Voucher - ₹500",
        "pointsAwarded": 50
      }
    ],
    "tags": ["2023", "workshop", "programming"]
  }'
```

**Expected Response**:
- Status: 201 Created
- Event has `eventType: "past"`
- Winners populated with user details
- Contains `createdBy` field

**Assertion**:
```javascript
assert.equal(response.status, 201);
assert.equal(response.data.data.eventType, "past");
assert.isArray(response.data.data.winners);
assert.equal(response.data.data.winners.length, 2);
assert.exists(response.data.data.createdBy);
```

**Save Event ID**:
```bash
EVENT_ID=$(echo $response | jq -r '.data._id')
```

---

#### Test 3.2: Add Past Event - Future Date (Invalid)

**Test ID**: `MASTER-EVENT-002`

```bash
curl -X POST http://localhost:5000/api/master/event/past/add \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Future Event",
    "description": "This is in the future",
    "cluster": "cluster_id",
    "date": "2025-12-15",
    "winners": []
  }'
```

**Expected Response**:
- Status: 400 Bad Request
- Message about date validation

**Assertion**:
```javascript
assert.equal(response.status, 400);
assert.include(response.data.message, "past");
```

---

#### Test 3.3: Add Past Event - Too Many Winners

**Test ID**: `MASTER-EVENT-003`

```bash
# Attempt to add 11 winners (max is 10)
const winners = [];
for(let i = 1; i <= 11; i++) {
  winners.push({
    userId: `user_${i}`,
    rank: i,
    prize: `Prize ${i}`,
    pointsAwarded: 100 - i*5
  });
}

curl -X POST http://localhost:5000/api/master/event/past/add \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"title\": \"Too Many Winners\",
    \"cluster\": \"cluster_id\",
    \"date\": \"2023-12-15\",
    \"winners\": [... 11 winners ...]
  }"
```

**Expected Response**:
- Status: 400 Bad Request
- Message: "Maximum 10 winners allowed"

---

#### Test 3.4: Add Past Event - Duplicate Ranks

**Test ID**: `MASTER-EVENT-004`

```bash
curl -X POST http://localhost:5000/api/master/event/past/add \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Duplicate Ranks",
    "cluster": "cluster_id",
    "date": "2023-12-15",
    "winners": [
      {"userId": "user_1", "rank": 1, "prize": "First"},
      {"userId": "user_2", "rank": 1, "prize": "Also First"}
    ]
  }'
```

**Expected Response**:
- Status: 400 Bad Request
- Message about duplicate ranks

---

#### Test 3.5: Edit Past Event

**Test ID**: `MASTER-EVENT-005`

```bash
curl -X PUT http://localhost:5000/api/master/event/past/edit/$EVENT_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Workshop Title",
    "location": "Lab 102",
    "instructor": "John Doe"
  }'
```

**Expected Response**:
- Status: 200 OK
- Updated fields reflected

**Assertion**:
```javascript
assert.equal(response.status, 200);
assert.equal(response.data.data.title, "Updated Workshop Title");
assert.equal(response.data.data.location, "Lab 102");
```

---

#### Test 3.6: Delete Past Event - Success

**Test ID**: `MASTER-EVENT-006`

```bash
curl -X DELETE http://localhost:5000/api/master/event/past/delete/$EVENT_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"password\": \"TestPassword123!\"
  }"
```

**Expected Response**:
- Status: 200 OK
- Message: "Past event deleted successfully"

---

#### Test 3.7: Delete Past Event - Wrong Password

**Test ID**: `MASTER-EVENT-007`

```bash
curl -X DELETE http://localhost:5000/api/master/event/past/delete/$EVENT_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"password\": \"WrongPassword123!\"
  }"
```

**Expected Response**:
- Status: 401 Unauthorized
- Message: "Invalid master password"

---

### TEST SUITE 4: Statistics

#### Test 4.1: Get System Statistics

**Test ID**: `MASTER-STATS-001`

```bash
curl -X GET http://localhost:5000/api/master/stats \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response**:
- Status: 200 OK
- Contains `overall` section with counters
- Contains `engagement` metrics
- Contains `clusterWise` array
- Contains `classDistribution` array
- Contains `topEvents` array
- Contains `topBadges` array
- Contains `timestamp`

**Assertion**:
```javascript
assert.equal(response.status, 200);
assert.exists(response.data.data.overall);
assert.exists(response.data.data.engagement);
assert.exists(response.data.data.clusterWise);
assert.exists(response.data.data.timestamp);
assert.isNumber(response.data.data.overall.totalUsers);
assert.isNumber(response.data.data.overall.totalEvents);
```

---

#### Test 4.2: Export System Data - JSON

**Test ID**: `MASTER-STATS-002`

```bash
curl -X GET "http://localhost:5000/api/master/stats/export?format=json" \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response**:
- Status: 200 OK
- Contains `exportedAt` and `exportedBy`
- Contains full data dump
- Format: JSON

**Assertion**:
```javascript
assert.equal(response.status, 200);
assert.exists(response.data.data.exportedAt);
assert.exists(response.data.data.exportedBy);
assert.exists(response.data.data.data);
```

---

#### Test 4.3: Export System Data - CSV

**Test ID**: `MASTER-STATS-003`

```bash
curl -X GET "http://localhost:5000/api/master/stats/export?format=csv" \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response**:
- Status: 200 OK
- Content-Type: text/csv
- Contains comma-separated data

---

### TEST SUITE 5: Authorization & Security

#### Test 5.1: Missing Token

**Test ID**: `MASTER-AUTH-001`

```bash
# Request without token
curl -X GET http://localhost:5000/api/master/users
```

**Expected Response**:
- Status: 401 Unauthorized
- Message about missing token

---

#### Test 5.2: Invalid Token

**Test ID**: `MASTER-AUTH-002`

```bash
curl -X GET http://localhost:5000/api/master/users \
  -H "Authorization: Bearer invalid.token.here"
```

**Expected Response**:
- Status: 401 Unauthorized
- Message about invalid token

---

#### Test 5.3: Non-Master User

**Test ID**: `MASTER-AUTH-003`

Get an admin token (not master):

```bash
# Using admin token instead of master token
curl -X GET http://localhost:5000/api/master/users \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

**Expected Response**:
- Status: 403 Forbidden
- Message: "Access denied. Master role required"

---

#### Test 5.4: Password Not Exposed

**Test ID**: `MASTER-AUTH-004`

For any endpoint that returns user/admin data:

```javascript
// Verify password is never in response
response.data.data.password === undefined
response.data.data.users?.forEach(u => {
  assert.isUndefined(u.password);
});
```

---

## Integration Testing

### Full User Deletion Flow

```bash
#!/bin/bash

# 1. Get list of users
echo "Getting users..."
curl -X GET "http://localhost:5000/api/master/users?limit=1" \
  -H "Authorization: Bearer $TOKEN" > users.json
USER_ID=$(jq -r '.data.users[0]._id' users.json)
echo "User ID: $USER_ID"

# 2. Initiate removal (Step 1)
echo "Step 1: Initiating removal..."
curl -X DELETE "http://localhost:5000/api/master/remove-user/$USER_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"step": "1"}' > step1.json
TOKEN_CONFIRM=$(jq -r '.data.confirmationToken' step1.json)
echo "Confirmation Token: $TOKEN_CONFIRM"

# 3. Verify password (Step 2)
echo "Step 2: Verifying password..."
curl -X DELETE "http://localhost:5000/api/master/remove-user/$USER_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"step\": \"2\",
    \"password\": \"TestPassword123!\",
    \"confirmationToken\": \"$TOKEN_CONFIRM\"
  }" > step2.json
echo "Password verification: $(jq -r '.data.verified' step2.json)"

# 4. Final deletion (Step 3)
echo "Step 3: Deleting user..."
curl -X DELETE "http://localhost:5000/api/master/remove-user/$USER_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"step\": \"3\",
    \"password\": \"TestPassword123!\"
  }" > step3.json

echo "Deletion result:"
jq '.' step3.json

# 5. Verify user is deleted
echo "Verifying deletion..."
curl -X GET "http://localhost:5000/api/master/users?search=$USER_ID" \
  -H "Authorization: Bearer $TOKEN" > verify.json
USER_COUNT=$(jq '.data.users | length' verify.json)
if [ "$USER_COUNT" = "0" ]; then
  echo "✓ User successfully deleted"
else
  echo "✗ User still exists!"
fi
```

---

## Performance Testing

### Load Testing Admin Creation

```bash
#!/bin/bash

# Create 100 admins and measure time
echo "Creating 100 admins..."
time for i in {1..100}; do
  curl -X POST http://localhost:5000/api/master/create-admin \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "{
      \"fullName\": \"Test Admin $i\",
      \"username\": \"admin_test_$i\",
      \"email\": \"admin$i@test.com\",
      \"password\": \"SecurePass123!\",
      \"cluster\": \"$CLUSTER_ID\"
    }" > /dev/null
done
```

### User Search Performance

```bash
#!/bin/bash

# Test with different limit values
for limit in 10 50 100 500; do
  echo "Testing with limit=$limit"
  time curl -X GET "http://localhost:5000/api/master/users?limit=$limit" \
    -H "Authorization: Bearer $TOKEN" > /dev/null
done
```

### Statistics Generation Performance

```bash
# Measure stats generation time
time curl -X GET http://localhost:5000/api/master/stats \
  -H "Authorization: Bearer $TOKEN" > /dev/null
```

---

## Test Result Documentation

### Test Execution Report Template

```markdown
# Master API Test Report
Date: 2024-01-20
Environment: Development (localhost:5000)
Tester: [Name]

## Test Summary
- Total Tests: 30
- Passed: 28
- Failed: 2
- Skipped: 0
- Success Rate: 93.3%

## Test Suites

### Admin Management
- [✓] Create Admin - Success
- [✓] Create Admin - Duplicate Username
- [✓] Create Admin - Weak Password
- [✗] Create Admin - Cluster Not Found (FAILED)
- [✓] Remove Admin - Success
- [✓] Remove Admin - Cannot Remove Master
- [✓] Reactivate Admin

### User Management
- [✓] Get All Users - Success
- [✓] Get All Users - With Class Filter
- [✓] Get All Users - With Search
- [✓] Remove User - Step 1
- [✓] Remove User - Step 2
- [✓] Remove User - Step 3
- [✗] Remove User - Invalid Password (FAILED)

### Past Event Management
- [✓] Add Past Event - Success
- [✓] Add Past Event - Future Date
- [✓] Add Past Event - Too Many Winners
- [✓] Edit Past Event
- [✓] Delete Past Event

### Statistics
- [✓] Get System Statistics
- [✓] Export System Data

### Authorization & Security
- [✓] Missing Token
- [✓] Invalid Token
- [✓] Non-Master User
- [✓] Password Not Exposed

## Issues Found
1. **ISSUE-001**: Cluster not found error message unclear
2. **ISSUE-002**: Password verification error gives too much detail

## Recommendations
1. Improve error messages
2. Add rate limiting
3. Consider caching for stats endpoint

```

---

