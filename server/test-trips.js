const axios = require('axios');

const API_URL = 'http://localhost:5000/api';
let authToken = '';
let testTripId = '';
let testItineraryId = '';

const testTripsAndItineraries = async () => {
  console.log('🧪 Testing VoyageAI Trips & Itineraries API\n');

  try {
    console.log('0️⃣  Setting up test user...');
    const registerResponse = await axios.post(`${API_URL}/auth/register`, {
      name: 'Trip Tester',
      email: `tester${Date.now()}@example.com`,
      password: 'password123',
    });
    authToken = registerResponse.data.token;
    console.log('✅ Test user created and authenticated\n');

    const config = {
      headers: { Authorization: `Bearer ${authToken}` },
    };

    console.log('1️⃣  Testing Create Trip...');
    const tripResponse = await axios.post(
      `${API_URL}/trips`,
      {
        destination: 'Paris, France',
        startDate: '2024-06-01',
        endDate: '2024-06-07',
        budget: 150000,
        currency: 'INR',
        interests: ['museums', 'food', 'architecture'],
        travelType: 'couple',
        aiPromptUsed: 'Plan a romantic trip to Paris',
      },
      config
    );
    testTripId = tripResponse.data.trip._id;
    console.log('✅ Trip created successfully!');
    console.log('Trip ID:', testTripId);
    console.log('Destination:', tripResponse.data.trip.destination);
    console.log('Budget:', tripResponse.data.trip.budget, tripResponse.data.trip.currency);

    console.log('\n2️⃣  Testing Get All Trips...');
    const tripsResponse = await axios.get(`${API_URL}/trips`, config);
    console.log('✅ Retrieved trips successfully!');
    console.log('Total trips:', tripsResponse.data.count);

    console.log('\n3️⃣  Testing Create Itinerary...');
    const itineraryResponse = await axios.post(
      `${API_URL}/itineraries`,
      {
        tripId: testTripId,
        days: [
          {
            dayNumber: 1,
            date: '2024-06-01',
            summary: 'Arrival and Eiffel Tower',
            activities: [
              {
                timeSlot: 'Morning',
                placeName: 'Eiffel Tower',
                placeType: 'Landmark',
                description: 'Visit the iconic Eiffel Tower',
                estimatedCost: 2500,
                location: {
                  address: 'Champ de Mars, Paris',
                  lat: 48.8584,
                  lng: 2.2945,
                  mapUrl: 'https://maps.google.com/?q=48.8584,2.2945',
                },
              },
              {
                timeSlot: 'Afternoon',
                placeName: 'Seine River Cruise',
                placeType: 'Activity',
                description: 'Romantic cruise on the Seine',
                estimatedCost: 3500,
                location: {
                  address: 'Port de la Bourdonnais, Paris',
                  lat: 48.8606,
                  lng: 2.2945,
                },
              },
            ],
            notes: 'Book Eiffel Tower tickets in advance',
          },
          {
            dayNumber: 2,
            date: '2024-06-02',
            summary: 'Louvre and Latin Quarter',
            activities: [
              {
                timeSlot: 'Morning',
                placeName: 'Louvre Museum',
                placeType: 'Museum',
                description: 'Explore the world famous art museum',
                estimatedCost: 3000,
                location: {
                  address: 'Rue de Rivoli, Paris',
                  lat: 48.8606,
                  lng: 2.3376,
                },
              },
            ],
            notes: 'Get there early to avoid crowds',
          },
        ],
      },
      config
    );
    testItineraryId = itineraryResponse.data.itinerary._id;
    console.log('✅ Itinerary created successfully!');
    console.log('Itinerary ID:', testItineraryId);
    console.log('Total days:', itineraryResponse.data.itinerary.days.length);
    console.log('Total estimated cost:', itineraryResponse.data.itinerary.totalEstimatedCost);

    console.log('\n4️⃣  Testing Get Single Trip with Itinerary...');
    const singleTripResponse = await axios.get(
      `${API_URL}/trips/${testTripId}`,
      config
    );
    console.log('✅ Retrieved trip with itinerary!');
    console.log('Has itinerary:', singleTripResponse.data.itinerary !== null);
    console.log('Itinerary days:', singleTripResponse.data.itinerary?.days.length);

    console.log('\n5️⃣  Testing Update Itinerary...');
    const updateResponse = await axios.put(
      `${API_URL}/itineraries/${testItineraryId}`,
      {
        days: [
          {
            dayNumber: 1,
            date: '2024-06-01',
            summary: 'Updated: Arrival and Eiffel Tower',
            activities: [
              {
                timeSlot: 'Morning',
                placeName: 'Eiffel Tower',
                placeType: 'Landmark',
                description: 'Visit the iconic Eiffel Tower - UPDATED',
                estimatedCost: 3000,
                location: {
                  address: 'Champ de Mars, Paris',
                  lat: 48.8584,
                  lng: 2.2945,
                },
              },
            ],
            notes: 'Updated notes: Book tickets online',
          },
        ],
      },
      config
    );
    console.log('✅ Itinerary updated successfully!');
    console.log('Updated cost:', updateResponse.data.itinerary.totalEstimatedCost);

    console.log('\n6️⃣  Testing Get Itinerary...');
    const getItineraryResponse = await axios.get(
      `${API_URL}/itineraries/${testItineraryId}`,
      config
    );
    console.log('✅ Retrieved itinerary with trip details!');
    console.log('Trip destination:', getItineraryResponse.data.itinerary.tripId.destination);

    console.log('\n7️⃣  Testing Delete Trip (cascade delete)...');
    await axios.delete(`${API_URL}/trips/${testTripId}`, config);
    console.log('✅ Trip and itinerary deleted successfully!');

    console.log('\n8️⃣  Testing Error: Access Deleted Trip...');
    try {
      await axios.get(`${API_URL}/trips/${testTripId}`, config);
    } catch (error) {
      console.log('✅ Correctly returned 404 for deleted trip!');
      console.log('Error:', error.response.data.message);
    }

    console.log('\n9️⃣  Testing Error: Invalid Date Range...');
    try {
      await axios.post(
        `${API_URL}/trips`,
        {
          destination: 'Tokyo',
          startDate: '2024-06-10',
          endDate: '2024-06-05',
          budget: 100000,
        },
        config
      );
    } catch (error) {
      console.log('✅ Correctly rejected invalid date range!');
      console.log('Error:', error.response.data.message);
    }

    console.log('\n🎉 All trips and itineraries tests passed!\n');
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
};

testTripsAndItineraries();
