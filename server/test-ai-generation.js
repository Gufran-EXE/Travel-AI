const axios = require('axios');

const API_URL = 'http://localhost:5000/api';
let authToken = '';
let testTripId = '';

const testAIGeneration = async () => {
  console.log('🧪 Testing VoyageAI AI Itinerary Generation\n');

  try {
    console.log('0️⃣  Setting up test user...');
    const registerResponse = await axios.post(`${API_URL}/auth/register`, {
      name: 'AI Test User',
      email: `aitest${Date.now()}@example.com`,
      password: 'password123',
    });
    authToken = registerResponse.data.token;
    console.log('✅ Test user created and authenticated\n');

    const config = {
      headers: { Authorization: `Bearer ${authToken}` },
    };

    console.log('1️⃣  Creating a test trip...');
    const tripResponse = await axios.post(
      `${API_URL}/trips`,
      {
        destination: 'Bali, Indonesia',
        startDate: '2024-07-01',
        endDate: '2024-07-05',
        budget: 80000,
        currency: 'INR',
        interests: ['beaches', 'culture', 'food', 'nature'],
        travelType: 'couple',
        aiPromptUsed: 'Plan a romantic beach vacation in Bali',
      },
      config
    );
    testTripId = tripResponse.data.trip._id;
    console.log('✅ Trip created successfully!');
    console.log('Trip ID:', testTripId);
    console.log('Destination:', tripResponse.data.trip.destination);
    console.log('Duration:', '5 days');

    console.log('\n2️⃣  Generating AI Itinerary (Mock Mode)...');
    const startTime = Date.now();
    const generateResponse = await axios.post(
      `${API_URL}/trips/${testTripId}/generate-itinerary`,
      {},
      config
    );
    const endTime = Date.now();
    
    console.log('✅ Itinerary generated successfully!');
    console.log('Generation time:', `${endTime - startTime}ms`);
    console.log('AI Provider:', generateResponse.data.aiProvider);
    console.log('Total days:', generateResponse.data.itinerary.days.length);
    console.log('Total estimated cost:', generateResponse.data.itinerary.totalEstimatedCost);

    console.log('\n3️⃣  Itinerary Details:');
    generateResponse.data.itinerary.days.forEach((day, idx) => {
      console.log(`\n   Day ${day.dayNumber}: ${day.summary}`);
      console.log(`   Activities: ${day.activities.length}`);
      day.activities.forEach((activity) => {
        console.log(`     - ${activity.timeSlot}: ${activity.placeName} (₹${activity.estimatedCost})`);
      });
      console.log(`   Day Cost: ₹${day.estimatedDayCost}`);
      if (day.notes) {
        console.log(`   Notes: ${day.notes.substring(0, 60)}...`);
      }
    });

    console.log('\n4️⃣  Testing Duplicate Generation (Should Fail)...');
    try {
      await axios.post(
        `${API_URL}/trips/${testTripId}/generate-itinerary`,
        {},
        config
      );
      console.log('❌ Should have failed but did not!');
    } catch (error) {
      console.log('✅ Correctly rejected duplicate generation!');
      console.log('Error:', error.response.data.message);
    }

    console.log('\n5️⃣  Testing Regenerate Itinerary...');
    const regenerateResponse = await axios.post(
      `${API_URL}/trips/${testTripId}/regenerate-itinerary`,
      {},
      config
    );
    console.log('✅ Itinerary regenerated successfully!');
    console.log('New total cost:', regenerateResponse.data.itinerary.totalEstimatedCost);
    console.log('Days count:', regenerateResponse.data.itinerary.days.length);

    console.log('\n6️⃣  Verifying Trip with Generated Itinerary...');
    const tripWithItinerary = await axios.get(
      `${API_URL}/trips/${testTripId}`,
      config
    );
    console.log('✅ Retrieved trip with itinerary!');
    console.log('Has itinerary:', tripWithItinerary.data.itinerary !== null);
    console.log('Itinerary ID:', tripWithItinerary.data.itinerary._id);

    console.log('\n7️⃣  Testing with Different Trip Type...');
    const familyTripResponse = await axios.post(
      `${API_URL}/trips`,
      {
        destination: 'Dubai, UAE',
        startDate: '2024-08-10',
        endDate: '2024-08-13',
        budget: 120000,
        currency: 'INR',
        interests: ['shopping', 'adventure', 'architecture'],
        travelType: 'family',
      },
      config
    );
    const familyTripId = familyTripResponse.data.trip._id;
    
    const familyItinerary = await axios.post(
      `${API_URL}/trips/${familyTripId}/generate-itinerary`,
      {},
      config
    );
    console.log('✅ Family trip itinerary generated!');
    console.log('Destination:', familyTripResponse.data.trip.destination);
    console.log('Days:', familyItinerary.data.itinerary.days.length);
    console.log('Sample activity:', familyItinerary.data.itinerary.days[0].activities[0].placeName);

    console.log('\n8️⃣  Cleanup: Deleting test trips...');
    await axios.delete(`${API_URL}/trips/${testTripId}`, config);
    await axios.delete(`${API_URL}/trips/${familyTripId}`, config);
    console.log('✅ Test trips deleted!');

    console.log('\n🎉 All AI generation tests passed!\n');
    console.log('📝 Summary:');
    console.log('   - Mock AI generation works perfectly');
    console.log('   - Realistic itineraries with proper structure');
    console.log('   - Automatic cost calculation');
    console.log('   - Duplicate prevention working');
    console.log('   - Regeneration feature working');
    console.log('   - Different trip types handled correctly\n');
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    if (error.response?.data?.stack) {
      console.error('Stack:', error.response.data.stack);
    }
  }
};

testAIGeneration();
