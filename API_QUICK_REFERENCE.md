# VoyageAI API Quick Reference

## Base URL
```
http://localhost:5000/api
```

## Authentication

### Register
```bash
POST /api/auth/register
Body: { "name": "John", "email": "john@example.com", "password": "pass123" }
Returns: { token, user }
```

### Login
```bash
POST /api/auth/login
Body: { "email": "john@example.com", "password": "pass123" }
Returns: { token, user }
```

### Get Current User
```bash
GET /api/auth/me
Headers: Authorization: Bearer <token>
Returns: { user }
```

---

## Trips (All Protected)

### Create Trip
```bash
POST /api/trips
Headers: Authorization: Bearer <token>
Body: {
  "destination": "Paris, France",
  "startDate": "2024-06-01",
  "endDate": "2024-06-07",
  "budget": 150000,
  "currency": "INR",
  "interests": ["museums", "food"],
  "travelType": "couple"
}
Returns: { trip }
```

### Get All Trips
```bash
GET /api/trips
Headers: Authorization: Bearer <token>
Returns: { count, trips[] }
```

### Get Single Trip
```bash
GET /api/trips/:tripId
Headers: Authorization: Bearer <token>
Returns: { trip, itinerary }
```

### Delete Trip
```bash
DELETE /api/trips/:tripId
Headers: Authorization: Bearer <token>
Returns: { message }
```

### Generate AI Itinerary ⭐ NEW
```bash
POST /api/trips/:tripId/generate-itinerary
Headers: Authorization: Bearer <token>
Returns: { itinerary, aiProvider }
```

### Regenerate AI Itinerary ⭐ NEW
```bash
POST /api/trips/:tripId/regenerate-itinerary
Headers: Authorization: Bearer <token>
Returns: { itinerary, aiProvider }
```

---

## Itineraries (All Protected)

### Create Itinerary
```bash
POST /api/itineraries
Headers: Authorization: Bearer <token>
Body: {
  "tripId": "...",
  "days": [
    {
      "dayNumber": 1,
      "date": "2024-06-01",
      "summary": "Day 1 activities",
      "activities": [
        {
          "timeSlot": "Morning",
          "placeName": "Eiffel Tower",
          "placeType": "Landmark",
          "description": "Visit the tower",
          "estimatedCost": 2500,
          "location": {
            "address": "Champ de Mars, Paris",
            "lat": 48.8584,
            "lng": 2.2945
          }
        }
      ],
      "notes": "Book in advance"
    }
  ]
}
Returns: { itinerary }
```

### Get Itinerary
```bash
GET /api/itineraries/:id
Headers: Authorization: Bearer <token>
Returns: { itinerary (with populated trip) }
```

### Update Itinerary
```bash
PUT /api/itineraries/:id
Headers: Authorization: Bearer <token>
Body: { "days": [...] }
Returns: { itinerary }
```

### Delete Itinerary
```bash
DELETE /api/itineraries/:id
Headers: Authorization: Bearer <token>
Returns: { message }
```

---

## Testing

```bash
# Start server
npm run dev

# Test authentication
cd server && npm run test-auth

# Test trips & itineraries
cd server && npm run test-trips

# Test AI generation ⭐ NEW
cd server && npm run test-ai
```

---

## Status Codes

- **200** - Success
- **201** - Created
- **400** - Bad Request (validation error)
- **401** - Unauthorized (no/invalid token)
- **404** - Not Found
- **500** - Server Error

---

## Key Features

✅ JWT Authentication
✅ Protected Routes
✅ User Isolation
✅ Auto Cost Calculation
✅ Cascade Delete
✅ Date Validation
✅ AI Itinerary Generation ⭐ NEW
✅ Mock & OpenAI Support ⭐ NEW
✅ Comprehensive Error Handling
