const axios = require('axios');

const API_URL = 'http://localhost:5000/api/auth';

const testAuth = async () => {
  console.log('🧪 Testing VoyageAI Authentication API\n');

  try {
    console.log('1️⃣  Testing User Registration...');
    const registerResponse = await axios.post(`${API_URL}/register`, {
      name: 'Test User',
      email: `test${Date.now()}@example.com`,
      password: 'password123',
    });
    console.log('✅ Registration successful!');
    console.log('Token:', registerResponse.data.token.substring(0, 20) + '...');
    console.log('User:', registerResponse.data.user);
    
    const token = registerResponse.data.token;
    const email = registerResponse.data.user.email;

    console.log('\n2️⃣  Testing Get Current User (Protected Route)...');
    const meResponse = await axios.get(`${API_URL}/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('✅ Protected route access successful!');
    console.log('User:', meResponse.data.user);

    console.log('\n3️⃣  Testing Login...');
    const loginResponse = await axios.post(`${API_URL}/login`, {
      email: email,
      password: 'password123',
    });
    console.log('✅ Login successful!');
    console.log('Token:', loginResponse.data.token.substring(0, 20) + '...');
    console.log('User:', loginResponse.data.user);

    console.log('\n4️⃣  Testing Invalid Login...');
    try {
      await axios.post(`${API_URL}/login`, {
        email: email,
        password: 'wrongpassword',
      });
    } catch (error) {
      console.log('✅ Invalid login correctly rejected!');
      console.log('Error:', error.response.data.message);
    }

    console.log('\n5️⃣  Testing Protected Route Without Token...');
    try {
      await axios.get(`${API_URL}/me`);
    } catch (error) {
      console.log('✅ Unauthorized access correctly blocked!');
      console.log('Error:', error.response.data.message);
    }

    console.log('\n🎉 All authentication tests passed!\n');
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
};

testAuth();
