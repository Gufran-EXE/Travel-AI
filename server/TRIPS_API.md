# Trips & Itineraries API Documentation

## Base URL
```
http://localhost:5000/api
```

All routes require authentication via Bearer token in the Authorization header.

---

## Trips API

### 1. Create Trip
**POST** `/api/trips`

Create a new trip for the authenticated user.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "destination": "Paris, France",
  "startDate": "2024-06-01",
  "endDate": "2024-06-07",
  "budget": 150000,
  "currency": "INR",
  "interests": ["museums", "food", "architecture"],
  "travelType": "couple",
  "aiPromptUsed": "Plan a romantic trip to Paris with focus on art and cuisine"
}
```

**Required Fields:**
- `destination` (string)
- `startDate` (date)
- `endDate` (date)
- `budget` (number)

**Optional Fields:**
- `currency` (string, default: "INR")
- `interests` (array of strings, default: [])
- `travelType` (enum: "solo" | "family" | "friends" | "couple" | "business" | "other", default: "solo")
- `aiPromptUsed` (string)

**Success Response (201):**
```json
{
  "success": true,
  "trip": {
    "_id": "507f1f77bcf86cd799439011",
    "userId": "507f1f77bcf86cd799439012",
    "destination": "Paris, France",
    "startDate": "2024-06-01T00:00:00.000Z",
    "endDate": "2024-06-07T00:00:00.000Z",
    "budget": 150000,
    "currency": "INR",
    "interests": ["museums", "food", "architecture"],
    "travelType": "couple",
    "aiPromptUsed": "Plan a romantic trip to Paris with focus on art and cuisine",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Responses:**
- **400** - Missing required fields or invalid dates
- **401** - Unauthorized (no token or invalid token)

---

### 2. Get All Trips
**GET** `/api/trips`

Get all trips for the authenticated user, sorted by creation date (newest first).

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "count": 2,
  "trips": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "userId": "507f1f77bcf86cd799439012",
      "destination": "Paris, France",
      "startDate": "2024-06-01T00:00:00.000Z",
      "endDate": "2024-06-07T00:00:00.000Z",
      "budget": 150000,
      "currency": "INR",
      "interests": ["museums", "food"],
      "travelType": "couple",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### 3. Get Single Trip
**GET** `/api/trips/:tripId`

Get a specific trip with its itinerary (if exists).

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "trip": {
    "_id": "507f1f77bcf86cd799439011",
    "destination": "Paris, France",
    "startDate": "2024-06-01T00:00:00.000Z",
    "endDate": "2024-06-07T00:00:00.000Z",
    "budget": 150000,
    "currency": "INR"
  },
  "itinerary": {
    "_id": "507f1f77bcf86cd799439013",
    "tripId": "507f1f77bcf86cd799439011",
    "days": [...],
    "totalEstimatedCost": 120000
  }
}
```

**Error Responses:**
- **404** - Trip not found
- **401** - Unauthorized

---

### 4. Delete Trip
**DELETE** `/api/trips/:tripId`

Delete a trip and its associated itinerary.

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Trip and related itinerary deleted successfully"
}
```

**Error Responses:**
- **404** - Trip not found
- **401** - Unauthorized

---

## Itineraries API

### 1. Create Itinerary
**POST** `/api/itineraries`

Create an itinerary for a trip.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "tripId": "507f1f77bcf86cd799439011",
  "days": [
    {
      "dayNumber": 1,
      "date": "2024-06-01",
      "summary": "Arrival and Eiffel Tower",
      "activities": [
        {
          "timeSlot": "Morning",
          "placeName": "Eiffel Tower",
          "placeType": "Landmark",
          "description": "Visit the iconic Eiffel Tower",
          "estimatedCost": 2500,
          "location": {
            "address": "Champ de Mars, Paris",
            "lat": 48.8584,
            "lng": 2.2945,
            "mapUrl": "https://maps.google.com/?q=48.8584,2.2945"
          }
        }
      ],
      "notes": "Book tickets in advance",
      "estimatedDayCost": 5000
    }
  ]
}
```

**Success Response (201):**
```json
{
  "success": true,
  "itinerary": {
    "_id": "507f1f77bcf86cd799439013",
    "tripId": "507f1f77bcf86cd799439011",
    "userId": "507f1f77bcf86cd799439012",
    "days": [...],
    "totalEstimatedCost": 35000,
    "lastUpdated": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Responses:**
- **400** - Missing required fields or itinerary already exists
- **404** - Trip not found
- **401** - Unauthorized

---

### 2. Get Itinerary
**GET** `/api/itineraries/:id`

Get a specific itinerary with populated trip details.

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "itinerary": {
    "_id": "507f1f77bcf86cd799439013",
    "tripId": {
      "_id": "507f1f77bcf86cd799439011",
      "destination": "Paris, France",
      "startDate": "2024-06-01T00:00:00.000Z"
    },
    "days": [...],
    "totalEstimatedCost": 35000
  }
}
```

---

### 3. Update Itinerary
**PUT** `/api/itineraries/:id`

Update an existing itinerary (edit activities, notes, costs, etc.).

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "days": [
    {
      "dayNumber": 1,
      "date": "2024-06-01",
      "summary": "Updated summary",
      "activities": [
        {
          "timeSlot": "Morning",
          "placeName": "Louvre Museum",
          "placeType": "Museum",
          "description": "Visit the world's largest art museum",
          "estimatedCost": 3000,
          "location": {
            "address": "Rue de Rivoli, Paris",
            "lat": 48.8606,
            "lng": 2.3376
          }
        }
      ],
      "notes": "Updated notes"
    }
  ],
  "totalEstimatedCost": 40000
}
```

**Success Response (200):**
```json
{
  "success": true,
  "itinerary": {
    "_id": "507f1f77bcf86cd799439013",
    "days": [...],
    "totalEstimatedCost": 40000,
    "lastUpdated": "2024-01-02T00:00:00.000Z"
  }
}
```

**Error Responses:**
- **400** - Invalid data
- **404** - Itinerary or trip not found
- **401** - Unauthorized

---

### 4. Delete Itinerary
**DELETE** `/api/itineraries/:id`

Delete an itinerary (trip remains).

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Itinerary deleted successfully"
}
```

---

## Data Models

### Trip Schema
```javascript
{
  userId: ObjectId (ref: User),
  destination: String,
  startDate: Date,
  endDate: Date,
  budget: Number,
  currency: String (default: "INR"),
  interests: [String],
  travelType: Enum ["solo", "family", "friends", "couple", "business", "other"],
  aiPromptUsed: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Itinerary Schema
```javascript
{
  tripId: ObjectId (ref: Trip, unique),
  userId: ObjectId (ref: User),
  days: [
    {
      dayNumber: Number,
      date: Date,
      summary: String,
      activities: [
        {
          timeSlot: Enum ["Morning", "Afternoon", "Evening", "Night"],
          placeName: String,
          placeType: String,
          description: String,
          estimatedCost: Number,
          location: {
            address: String,
            lat: Number,
            lng: Number,
            mapUrl: String
          }
        }
      ],
      notes: String,
      estimatedDayCost: Number (auto-calculated)
    }
  ],
  totalEstimatedCost: Number (auto-calculated),
  lastUpdated: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## Features

- ✅ All routes protected with JWT authentication
- ✅ User can only access their own trips and itineraries
- ✅ Automatic cost calculation (day costs and total)
- ✅ Date validation (end date >= start date)
- ✅ Cascade delete (deleting trip removes itinerary)
- ✅ One itinerary per trip (unique constraint)
- ✅ Indexed queries for performance
- ✅ Proper error handling with status codes
