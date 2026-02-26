const axios = require('axios');

const generateMockItinerary = (trip) => {
  const startDate = new Date(trip.startDate);
  const endDate = new Date(trip.endDate);
  const daysDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

  const destination = trip.destination;
  const interests = trip.interests || [];
  const budgetPerDay = Math.floor(trip.budget / daysDiff);

  const timeSlots = ['Morning', 'Afternoon', 'Evening'];
  
  const placesByInterest = {
    museums: ['National Museum', 'Art Gallery', 'History Museum', 'Cultural Center'],
    food: ['Local Market', 'Famous Restaurant', 'Street Food Tour', 'Cooking Class'],
    architecture: ['Historic Cathedral', 'Old Town Square', 'Palace Tour', 'Heritage Building'],
    nature: ['Botanical Garden', 'City Park', 'Nature Reserve', 'Scenic Viewpoint'],
    shopping: ['Shopping District', 'Local Bazaar', 'Artisan Market', 'Mall'],
    adventure: ['Adventure Park', 'Hiking Trail', 'Water Sports', 'Zip Lining'],
    culture: ['Cultural Show', 'Traditional Performance', 'Local Festival', 'Heritage Walk'],
    nightlife: ['Rooftop Bar', 'Night Market', 'Live Music Venue', 'Sunset Cruise'],
  };

  const defaultPlaces = [
    'City Center',
    'Main Square',
    'Popular Landmark',
    'Scenic Spot',
    'Local Attraction',
    'Famous Monument',
    'Waterfront',
    'Historic District',
  ];

  const getRandomPlace = (dayNum) => {
    if (interests.length > 0) {
      const interest = interests[dayNum % interests.length];
      const places = placesByInterest[interest.toLowerCase()] || defaultPlaces;
      return places[Math.floor(Math.random() * places.length)];
    }
    return defaultPlaces[dayNum % defaultPlaces.length];
  };

  const getPlaceType = (placeName) => {
    if (placeName.includes('Museum') || placeName.includes('Gallery')) return 'Museum';
    if (placeName.includes('Restaurant') || placeName.includes('Market') || placeName.includes('Food')) return 'Restaurant';
    if (placeName.includes('Park') || placeName.includes('Garden')) return 'Park';
    if (placeName.includes('Cathedral') || placeName.includes('Palace') || placeName.includes('Monument')) return 'Landmark';
    if (placeName.includes('Show') || placeName.includes('Performance')) return 'Entertainment';
    return 'Attraction';
  };

  const days = [];

  for (let i = 0; i < daysDiff; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);

    const activities = timeSlots.map((slot, idx) => {
      const placeName = `${getRandomPlace(i * 3 + idx)} in ${destination}`;
      const placeType = getPlaceType(placeName);
      const cost = Math.floor(budgetPerDay / 4) + Math.floor(Math.random() * 500);

      const lat = 40.7128 + (Math.random() - 0.5) * 0.1;
      const lng = -74.006 + (Math.random() - 0.5) * 0.1;

      return {
        timeSlot: slot,
        placeName,
        placeType,
        description: `Explore and enjoy ${placeName}. ${
          slot === 'Morning'
            ? 'Start your day with this amazing experience.'
            : slot === 'Afternoon'
            ? 'Perfect afternoon activity to discover local culture.'
            : 'End your day with this memorable visit.'
        }`,
        estimatedCost: cost,
        location: {
          address: `${placeName}, ${destination}`,
          lat,
          lng,
          mapUrl: `https://maps.google.com/?q=${lat},${lng}`,
        },
      };
    });

    days.push({
      dayNumber: i + 1,
      date: currentDate,
      summary: `Day ${i + 1}: Exploring ${destination}${
        interests.length > 0 ? ` - Focus on ${interests[i % interests.length]}` : ''
      }`,
      activities,
      notes: `Remember to stay hydrated and wear comfortable shoes. ${
        trip.travelType === 'family'
          ? 'Family-friendly activities planned.'
          : trip.travelType === 'couple'
          ? 'Romantic experiences included.'
          : trip.travelType === 'solo'
          ? 'Great opportunities to meet locals.'
          : 'Enjoy with your travel companions!'
      }`,
    });
  }

  return { days };
};

const generateOpenAIItinerary = async (trip) => {
  const startDate = new Date(trip.startDate);
  const endDate = new Date(trip.endDate);
  const daysDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

  const prompt = `Generate a detailed ${daysDiff}-day travel itinerary for ${trip.destination}.

Trip Details:
- Destination: ${trip.destination}
- Travel Type: ${trip.travelType}
- Budget: ${trip.budget} ${trip.currency}
- Interests: ${trip.interests.join(', ') || 'general sightseeing'}
- Start Date: ${trip.startDate}
- End Date: ${trip.endDate}

Please provide a JSON response with the following structure:
{
  "days": [
    {
      "dayNumber": 1,
      "date": "YYYY-MM-DD",
      "summary": "Brief summary of the day",
      "activities": [
        {
          "timeSlot": "Morning" | "Afternoon" | "Evening",
          "placeName": "Name of the place",
          "placeType": "Museum" | "Restaurant" | "Park" | "Landmark" | etc,
          "description": "Detailed description",
          "estimatedCost": number,
          "location": {
            "address": "Full address",
            "lat": number,
            "lng": number,
            "mapUrl": "Google Maps URL"
          }
        }
      ],
      "notes": "Additional notes for the day"
    }
  ]
}

Make it realistic, engaging, and within the budget. Include 3 activities per day (Morning, Afternoon, Evening).`;

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a professional travel planner. Always respond with valid JSON only.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 3000,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.AI_API_KEY}`,
        },
      }
    );

    const content = response.data.choices[0].message.content;
    
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in AI response');
    }

    const itineraryData = JSON.parse(jsonMatch[0]);
    
    if (!itineraryData.days || !Array.isArray(itineraryData.days)) {
      throw new Error('Invalid itinerary structure from AI');
    }

    return itineraryData;
  } catch (error) {
    console.error('OpenAI API Error:', error.message);
    throw new Error('Failed to generate itinerary using AI. Please try again.');
  }
};

const generateGeminiItinerary = async (trip) => {
  const startDate = new Date(trip.startDate);
  const endDate = new Date(trip.endDate);
  const daysDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

  const prompt = `Generate a ${daysDiff}-day travel itinerary for ${trip.destination}.

Trip: ${trip.destination}, ${trip.travelType}, Budget: ${trip.budget} ${trip.currency}, Interests: ${trip.interests.join(', ') || 'general'}

Return ONLY valid JSON (no markdown):
{
  "days": [
    {
      "dayNumber": 1,
      "date": "YYYY-MM-DD",
      "summary": "Brief day summary",
      "activities": [
        {
          "timeSlot": "Morning|Afternoon|Evening",
          "placeName": "Place name",
          "placeType": "Museum|Restaurant|Park|Landmark",
          "description": "Short description (max 100 chars)",
          "estimatedCost": number,
          "location": {
            "address": "Address",
            "lat": number,
            "lng": number,
            "mapUrl": "Google Maps URL"
          }
        }
      ],
      "notes": "Brief notes (max 100 chars)"
    }
  ]
}

Keep descriptions SHORT. 3 activities per day (Morning, Afternoon, Evening). Stay within budget.`;

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/${process.env.GEMINI_MODEL}:generateContent?key=${process.env.AI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 8192,
        },
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const content = response.data.candidates[0].content.parts[0].text;
    const finishReason = response.data.candidates[0].finishReason;
    
    console.log('Response length:', content.length);
    console.log('Finish reason:', finishReason);
    console.log('Raw Gemini response (first 300 chars):', content.substring(0, 300));
    console.log('Raw Gemini response (last 300 chars):', content.substring(content.length - 300));
    
    // Remove markdown code blocks if present
    let cleanContent = content.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
    
    console.log('Cleaned content length:', cleanContent.length);
    
    // Try to parse the entire cleaned content as JSON
    try {
      const itineraryData = JSON.parse(cleanContent);
      
      if (!itineraryData.days || !Array.isArray(itineraryData.days)) {
        throw new Error('Invalid itinerary structure from AI');
      }
      
      console.log('Successfully parsed itinerary with', itineraryData.days.length, 'days');
      return itineraryData;
    } catch (parseError) {
      console.error('JSON parse error:', parseError.message);
      console.error('Cleaned content (first 500 chars):', cleanContent.substring(0, 500));
      console.error('Cleaned content (last 500 chars):', cleanContent.substring(cleanContent.length - 500));
      throw new Error('Failed to parse AI response as JSON');
    }
  } catch (error) {
    console.error('Gemini API Error:', error.response?.data || error.message);
    throw new Error('Failed to generate itinerary using AI. Please try again.');
  }
};

const generateItineraryForTrip = async (trip) => {
  const provider = process.env.AI_PROVIDER || 'mock';
  const apiKey = process.env.AI_API_KEY;

  if (provider === 'mock' || !apiKey || apiKey === 'your_api_key_here') {
    console.log('Using mock AI itinerary generation');
    return generateMockItinerary(trip);
  }

  if (provider === 'gemini') {
    console.log('Using Google Gemini for itinerary generation');
    try {
      return await generateGeminiItinerary(trip);
    } catch (error) {
      console.error('AI generation failed, falling back to mock:', error.message);
      return generateMockItinerary(trip);
    }
  }

  if (provider === 'openai') {
    console.log('Using OpenAI for itinerary generation');
    try {
      return await generateOpenAIItinerary(trip);
    } catch (error) {
      console.error('AI generation failed, falling back to mock:', error.message);
      return generateMockItinerary(trip);
    }
  }

  console.log('Unknown AI provider, using mock');
  return generateMockItinerary(trip);
};

module.exports = {
  generateItineraryForTrip,
};
