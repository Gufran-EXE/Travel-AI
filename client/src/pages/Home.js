import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Home = () => {
  const [apiStatus, setApiStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkApiHealth = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/health`);
        setApiStatus(response.data);
      } catch (error) {
        setApiStatus({ success: false, message: 'API connection failed' });
      } finally {
        setLoading(false);
      }
    };

    checkApiHealth();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-6xl font-bold text-gray-900 mb-4">
              VoyageAI
            </h1>
            <p className="text-2xl text-gray-600 mb-2">
              AI Travel Planner
            </p>
            <p className="text-lg text-gray-500">
              Plan your perfect journey with artificial intelligence
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-xl p-8 mb-8">
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <h2 className="text-xl font-semibold text-gray-800">
                System Status
              </h2>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="font-medium text-gray-700">API Status:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    apiStatus?.success 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {apiStatus?.success ? 'Connected' : 'Disconnected'}
                  </span>
                </div>
                {apiStatus?.database && (
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="font-medium text-gray-700">Database:</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      apiStatus.database === 'connected'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {apiStatus.database}
                    </span>
                  </div>
                )}
                {apiStatus?.environment && (
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="font-medium text-gray-700">Environment:</span>
                    <span className="text-gray-600">{apiStatus.environment}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-indigo-600 text-4xl mb-3">🗺️</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Smart Planning
              </h3>
              <p className="text-gray-600 text-sm">
                AI-powered itinerary generation tailored to your preferences
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-indigo-600 text-4xl mb-3">✈️</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Travel Insights
              </h3>
              <p className="text-gray-600 text-sm">
                Get recommendations for destinations, activities, and more
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-indigo-600 text-4xl mb-3">💼</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Easy Management
              </h3>
              <p className="text-gray-600 text-sm">
                Organize and manage all your travel plans in one place
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
