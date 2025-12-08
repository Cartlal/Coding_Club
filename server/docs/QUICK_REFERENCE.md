# User APIs - Quick Reference

## All 8 Endpoints at a Glance

| # | Method | Endpoint | Purpose | Protected |
|---|--------|----------|---------|-----------|
| 1 | GET | `/user/profile` | User profile + QR code + stats + progress | ✅ Yes |
| 2 | GET | `/user/stats` | Stats: wins, participation, clusterPoints | ✅ Yes |
| 3 | GET | `/user/badges` | All 25 badges with earned status + auto-assign | ✅ Yes |
| 4 | GET | `/user/leaderboard` | Global ranking sorted by points | ✅ Yes |
| 5 | GET | `/user/class-leaderboard` | Class-wise ranking | ✅ Yes |
| 6 | POST | `/user/event/:eventId/register` | Register for event | ✅ Yes |
| 7 | GET | `/user/events` | List registered events | ✅ Yes |
| 8 | DELETE | `/user/event/:eventId/register` | Unregister from event | ✅ Yes |

---

## Badge Assignment Rules (Quick Table)

| Badge | Emoji | Condition | Points |
|-------|-------|-----------|--------|
| Achiever | 🏅 | participation >= 5 | Tier 1 |
| Bullseye | 🎯 | participation >= 5 | Tier 1 |
| Team Player | 🤝 | participation >= 10 | Tier 2 |
| Scholar | 🎓 | participation >= 12 | Tier 2 |
| Rising Star | 🌟 | participation >= 15 && wins >= 1 | Tier 2 |
| Security Expert | 🔐 | participation >= 8 | Tier 1 |
| Event Master | 🎪 | participation >= 25 | Tier 3 |
| Brain Power | 🧠 | clusterPoints >= 50 | Tier 1 |
| Data Analyst | 📊 | clusterPoints >= 75 | Tier 1 |
| Code Master | 💻 | clusterPoints >= 100 | Tier 2 |
| Researcher | 🔬 | clusterPoints >= 120 | Tier 2 |
| Rocket Launcher | 🚀 | clusterPoints >= 250 | Tier 3 |
| Lightning Fast | ⚡ | wins >= 1 | Tier 1 |
| Innovator | 💡 | wins >= 2 | Tier 2 |
| Third Place | 🥉 | wins >= 1 | Tier 1 |
| Second Place | 🥈 | wins >= 2 | Tier 2 |
| First Place | 🥇 | wins >= 3 | Tier 2 |
| Champion | 🏆 | wins >= 5 | Tier 3 |
| On Fire | 🔥 | participation >= 10 && wins >= 2 | Tier 2 |
| Star Performer | ⭐ | wins >= 3 && clusterPoints >= 150 | Tier 2 |
| Creative Designer | 🎨 | badges.length >= 5 | Tier 2 |
| Growth Mindset | 📈 | participation >= 8 && wins >= 1 | Tier 1 |
| Brilliant | ✨ | wins >= 4 && participation >= 10 | Tier 3 |
| Crowned | 👑 | wins >= 5 && clusterPoints >= 200 | Tier 3 |
| Multi-talented | 🎭 | badges.length >= 8 | Tier 3 |

---

## cURL Quick Commands

### Login First
```bash
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}' | jq -r '.data.token')
```

### Profile
```bash
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:5000/api/users/profile | jq
```

### Stats
```bash
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:5000/api/users/stats | jq
```

### Badges
```bash
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:5000/api/users/badges | jq
```

### Global Leaderboard (Top 10)
```bash
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:5000/api/users/leaderboard?limit=10" | jq
```

### Class Leaderboard
```bash
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:5000/api/users/class-leaderboard | jq
```

### User Events (Upcoming)
```bash
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:5000/api/users/events?status=upcoming" | jq
```

### Register for Event
```bash
curl -X POST -H "Authorization: Bearer $TOKEN" \
  http://localhost:5000/api/users/event/EVENT_ID/register | jq
```

### Unregister
```bash
curl -X DELETE -H "Authorization: Bearer $TOKEN" \
  http://localhost:5000/api/users/event/EVENT_ID/register | jq
```

---

## Query Parameters

### Leaderboard
- `limit=100` - Items per page (default 100)
- `page=1` - Page number (default 1)
- `sortBy=clusterPoints` - Sort field (clusterPoints|wins|participation|name)

### Class Leaderboard
- `limit=50` - Items per page (default 50)
- `page=1` - Page number (default 1)

### User Events
- `status=all` - Filter (all|upcoming|past, default all)

---

## Response Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | OK - Success | GET /profile |
| 201 | Created - Resource created | POST /register |
| 400 | Bad Request | Event capacity full |
| 401 | Unauthorized | Missing/invalid token |
| 403 | Forbidden | Wrong role (not user) |
| 404 | Not Found | Event/user doesn't exist |
| 409 | Conflict | Already registered |
| 500 | Server Error | DB connection error |

---

## Authentication

**Header Format:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

**Get Token:**
```javascript
POST /auth/login
{
  "email": "user@example.com",
  "password": "password123"
}
// Returns: { data: { token: "jwt..." } }
```

---

## Error Response Format

```json
{
  "success": false,
  "error": "User is already registered for this event",
  "statusCode": 409
}
```

---

## Success Response Format

```json
{
  "success": true,
  "data": { /* endpoint-specific data */ },
  "message": "User profile retrieved successfully"
}
```

---

## File Locations

- **Controller:** `/server/controllers/userController.js`
- **Routes:** `/server/routes/userRoutes.js`
- **Full Docs:** `/server/docs/USER_APIS.md`
- **Testing Guide:** `/server/docs/USER_APIS_TESTING.md`
- **Summary:** `/server/docs/USER_APIS_SUMMARY.md`

---

## Implementation Highlights

✅ **8 User Endpoints** - Profile, stats, badges, leaderboards, events
✅ **25-Badge System** - Auto-assigned achievement badges
✅ **QR Code Generation** - On-the-fly from user info
✅ **Global Leaderboard** - Sortable, paginated, user-highlighted
✅ **Class Leaderboard** - Filtered by class
✅ **Event Management** - Registration with validation
✅ **Full Security** - JWT + role-based access control
✅ **Comprehensive Docs** - 3 documentation files + inline comments

---

## Common Workflows

### 1. View My Profile
```bash
GET /user/profile → See QR, stats, badges, progress
```

### 2. Check My Stats
```bash
GET /user/stats → See wins, participation, points
```

### 3. See My Badges
```bash
GET /user/badges → All 25 badges, earned status, auto-assign
```

### 4. Check Global Ranking
```bash
GET /user/leaderboard → See where I rank globally
```

### 5. Check Class Ranking
```bash
GET /user/class-leaderboard → See where I rank in my class
```

### 6. Register for Event
```bash
POST /user/event/{id}/register → Register
GET /user/events?status=upcoming → See my upcoming events
```

### 7. Unregister from Event
```bash
DELETE /user/event/{id}/register → Unregister
```

---

## Key Numbers

- **25 Badges Total** - All unlockable with progression
- **8 API Endpoints** - For complete user features
- **3 Documentation Files** - Complete reference
- **1,200+ Lines** - Controller implementation
- **100 Results Default** - Leaderboard pagination
- **50 Results Default** - Class leaderboard pagination

---

## Integration Checklist

- [ ] Test all 8 endpoints with token
- [ ] Verify role-based access (non-users get 403)
- [ ] Test badge auto-assignment
- [ ] Verify QR code generation
- [ ] Test event registration validation
- [ ] Test leaderboard sorting
- [ ] Check class leaderboard filtering
- [ ] Verify stats calculations
- [ ] Test pagination
- [ ] Frontend integration

---

## Notes

- All timestamps in ISO 8601 format
- Pagination is 1-based (page 1 = first page)
- QR code contains: id, name, email, SRN, class, points, badges
- Badges auto-assigned on each GET /badges request
- Leaderboard real-time (not cached)
- Event registration updates user stats automatically
