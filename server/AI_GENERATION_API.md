# AI Itinerary Generation API Documentation

## Overview

VoyageAI includes an intelligent itinerary generation system that can work in two modes:
1. **Mock Mode** - Generates realistic itineraries without external API calls (default)
2. **AI Mode** - Uses OpenAI GPT to generate personalized itineraries

## Configuration

### Environment Variables

Add to `server/.env`:

```env
AI_PROVIDER=mock
AI_API_KEY=your_api_key_here
```

**AI_PROVIDER Options:**
- `mock` - Use built-in mock generator (no API key needed)
- `openai` - Use OpenAI GPT-3.5-turbo (requires API key)

**AI_API_KEY:**
- For mock mode: Can be left as `your_api_key_here`
- For OpenAI: Get your API key from https://platform.openai.com/api-keys

## API Endpoints

### 1. Generate Itinerary
**POST** `/api/trips/:tripId/generate-itinerary`

Generate a new AI-powered itinerary for a trip.

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `tripId` - The ID of the trip to generate itinerary for

**Success Response (201):**
```json
{
  "success": true,
  "message": "Itinerary generated successfully",
  "aiProvider": "mock",
  "itinerary": {
    "_id": "507f1f77bcf86cd799439013",
    "tripId": "507f1f77bcf86cd799439011",
    "userId": "507f1f77bcf86cd799439012",
    "days": [
      {
        "dayNumber": 1,
        "date": "2024-06-01T00:00:00.000Z",
        "summary": "Day 1: Exploring Paris - Focus on museums",
        "activities": [
          {
            "timeSlot": "Morning",
            "placeName": "National Museum in Paris",
            "placeType": "Museum",
            "description": "Explore and enjoy National Museum in Paris. Start your day with this amazing experience.",
            "estimatedCost": 2500,
            "location": {
              "address": "National Museum in Paris, Paris",
              "lat": 40.7128,
              "lng": -74.006,
              "mapUrl": "https://maps.google.com/?q=40.7128,-74.006"
            }
          },
          {
            "timeSlot": "Afternoon",
            "placeName": "Art Gallery in Paris",
            "placeType": "Museum",
            "description": "Explore and enjoy Art Gallery in Paris. Perfect afternoon activity to discover local culture.",
            "estimatedCost": 2800,
            "location": {
              "address": "Art Gallery in Paris, Paris",
              "lat": 40.7135,
              "lng": -74.0055,
              "mapUrl": "https://maps.google.com/?q=40.7135,-74.0055"
            }
          },
          {
            "timeSlot": "Evening",
            "placeName": "Historic Cathedral in Paris",
            "placeType": "Landmark",
            "description": "Explore and enjoy Historic Cathedral in Paris. End your day with this memorable visit.",
            "estimatedCost": 1500,
            "location": {
              "address": "Historic Cathedral in Paris, Paris",
              "lat": 40.7122,
              "lng": -74.0065,
              "mapUrl": "https://maps.google.com/?q=40.7122,-74.0065"
            }
          }
        ],
        "notes": "Remember to stay hydrated and wear comfortable shoes. Romantic experiences included.",
        "estimatedDayCost": 6800
      }
    ],
    "totalEstimatedCost": 34000,
    "lastUpdated": "2024-01-01T00:00:00.000Z",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Responses:**

- **400 Bad Request** - Itinerary already exists
```json
{
  "success": false,
  "message": "Itinerary already exists for this trip. Delete it first or use the update endpoint."
}
```

- **404 Not Found** - Trip not found
```json
{
  "success": false,
  "message": "Trip not found"
}
```

- **500 Internal Server Error** - AI generation failed
```json
{
  "success": false,
  "message": "Failed to generate itinerary. Please try again or contact support."
}
```

---

### 2. Regenerate Itinerary
**POST** `/api/trips/:tripId/regenerate-itinerary`

Delete existing itinerary and generate a new one.

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `tripId` - The ID of the trip to regenerate itinerary for

**Success Response (200):**
```json
{
  "success": true,
  "message": "Itinerary regenerated successfully",
  "aiProvider": "mock",
  "itinerary": {
    "_id": "507f1f77bcf86cd799439014",
    "tripId": "507f1f77bcf86cd799439011",
    "days": [...]
  }
}
```

**Error Responses:**
- Same as generate endpoint

---

## How It Works

### Mock Mode (Default)

The mock generator creates realistic itineraries based on:

1. **Trip Duration** - Calculates days between start and end date
2. **Budget Distribution** - Divides budget across days and activities
3. **Interests** - Selects activities matching user interests:
   - Museums → Art galleries, history museums, cultural centers
   - Food → Local markets, restaurants, cooking classes
   - Architecture → Cathedrals, palaces, heritage buildings
   - Nature → Parks, gardens, scenic viewpoints
   - Shopping → Markets, bazaars, shopping districts
   - Adventure → Adventure parks, hiking, water sports
   - Culture → Cultural shows, performances, heritage walks
   - Nightlife → Rooftop bars, night markets, live music

4. **Travel Type** - Customizes notes and recommendations:
   - Solo → Opportunities to meet locals
   - Couple → Romantic experiences
   - Family → Family-friendly activities
   - Friends → Group activities
   - Business → Professional networking

5. **Time Slots** - 3 activities per day:
   - Morning (energetic start)
   - Afternoon (cultural exploration)
   - Evening (relaxing end)

### OpenAI Mode

When configured with OpenAI:

1. **Prompt Construction** - Creates detailed prompt with:
   - Destination and dates
   - Budget and currency
   - Travel type and interests
   - Required JSON structure

2. **API Call** - Sends request to GPT-3.5-turbo
3. **Response Parsing** - Extracts and validates JSON
4. **Fallback** - If AI fails, automatically uses mock mode

## Testing

### Run Test Script

```bash
cd server
npm run test-ai
```

The test script will:
1. Create test user and authenticate
2. Create a test trip
3. Generate itinerary using AI
4. Verify itinerary structure
5. Test duplicate prevention
6. Test regeneration
7. Test different trip types
8. Clean up test data

### Manual Testing with cURL

**Generate Itinerary:**
```bash
curl -X POST http://localhost:5000/api/trips/TRIP_ID/generate-itinerary \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

**Regenerate Itinerary:**
```bash
curl -X POST http://localhost:5000/api/trips/TRIP_ID/regenerate-itinerary \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

## Features

✅ **Mock Mode** - Works without any API keys
✅ **Realistic Data** - Generates believable itineraries
✅ **Budget-Aware** - Distributes costs appropriately
✅ **Interest-Based** - Matches activities to user preferences
✅ **Travel Type Aware** - Customizes for solo, couple, family, etc.
✅ **Automatic Fallback** - Uses mock if AI fails
✅ **Cost Calculation** - Auto-calculates day and total costs
✅ **Location Data** - Includes coordinates and map URLs
✅ **Error Handling** - Graceful failures with helpful messages
✅ **Duplicate Prevention** - Can't generate twice for same trip
✅ **Regeneration** - Easy to regenerate new itinerary

## OpenAI Integration

To use OpenAI instead of mock:

1. **Get API Key:**
   - Visit https://platform.openai.com/api-keys
   - Create new secret key
   - Copy the key

2. **Update .env:**
   ```env
   AI_PROVIDER=openai
   AI_API_KEY=sk-proj-xxxxxxxxxxxxx
   ```

3. **Restart Server:**
   ```bash
   npm run dev
   ```

4. **Test:**
   ```bash
   npm run test-ai
   ```

## Cost Considerations

### Mock Mode
- **Cost:** Free
- **Speed:** Instant (<100ms)
- **Quality:** Good, realistic itineraries
- **Customization:** Based on interests and trip type

### OpenAI Mode
- **Cost:** ~$0.002 per itinerary (GPT-3.5-turbo)
- **Speed:** 2-5 seconds
- **Quality:** Excellent, highly personalized
- **Customization:** Natural language understanding

## Troubleshooting

### "Failed to generate itinerary"
- Check AI_PROVIDER setting
- Verify AI_API_KEY if using OpenAI
- Check server logs for detailed error
- System will fallback to mock automatically

### "Itinerary already exists"
- Use regenerate endpoint instead
- Or delete existing itinerary first
- Or update existing itinerary via PUT endpoint

### Empty or Invalid Itinerary
- Check trip dates are valid
- Ensure budget is positive
- Verify trip exists and user owns it

## Future Enhancements

Potential improvements:
- Support for more AI providers (Anthropic Claude, Google Gemini)
- Image generation for destinations
- Real-time pricing from booking APIs
- Weather integration
- Local events and festivals
- Transportation recommendations
- Accommodation suggestions
- Restaurant reservations
- Activity booking links

## Security Notes

⚠️ **Never commit API keys to Git**
✅ API keys are in .env (already in .gitignore)
✅ Mock mode works without any keys
✅ All endpoints require authentication
✅ Users can only generate for their own trips
