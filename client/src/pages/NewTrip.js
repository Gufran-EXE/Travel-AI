import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const NewTrip = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    destination: '',
    startDate: '',
    endDate: '',
    budget: '',
    currency: 'INR',
    interests: [],
    travelType: 'solo',
  });

  const currencies = ['INR', 'USD', 'EUR', 'GBP', 'AUD', 'CAD', 'JPY'];

  const interestOptions = [
    { value: 'beaches', label: 'Beaches', emoji: '🏖️' },
    { value: 'nature', label: 'Nature', emoji: '🌲' },
    { value: 'history', label: 'History', emoji: '🏛️' },
    { value: 'food', label: 'Food', emoji: '🍜' },
    { value: 'nightlife', label: 'Nightlife', emoji: '🎉' },
    { value: 'shopping', label: 'Shopping', emoji: '🛍️' },
    { value: 'adventure', label: 'Adventure', emoji: '🏔️' },
    { value: 'religious', label: 'Religious', emoji: '🕌' },
    { value: 'culture', label: 'Culture', emoji: '🎭' },
    { value: 'museums', label: 'Museums', emoji: '🖼️' },
    { value: 'architecture', label: 'Architecture', emoji: '🏰' },
    { value: 'wildlife', label: 'Wildlife', emoji: '🦁' },
  ];

  const travelTypes = [
    { value: 'solo', label: 'Solo', emoji: '🧳' },
    { value: 'couple', label: 'Couple', emoji: '💑' },
    { value: 'family', label: 'Family', emoji: '👨‍👩‍👧‍👦' },
    { value: 'friends', label: 'Friends', emoji: '👥' },
    { value: 'business', label: 'Business', emoji: '💼' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleInterestToggle = (interest) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const validateForm = () => {
    if (!formData.destination.trim()) {
      setError('Please enter a destination');
      return false;
    }

    if (!formData.startDate) {
      setError('Please select a start date');
      return false;
    }

    if (!formData.endDate) {
      setError('Please select an end date');
      return false;
    }

    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);

    if (end < start) {
      setError('End date must be after or equal to start date');
      return false;
    }

    if (!formData.budget || formData.budget <= 0) {
      setError('Please enter a valid budget greater than 0');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/api/trips', {
        destination: formData.destination.trim(),
        startDate: formData.startDate,
        endDate: formData.endDate,
        budget: Number(formData.budget),
        currency: formData.currency,
        interests: formData.interests,
        travelType: formData.travelType,
      });

      navigate(`/trips/${response.data.trip._id}`);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Failed to create trip. Please try again.'
      );
      console.error('Error creating trip:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-800/50 p-8 md:p-12">
            <div className="mb-10 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 mb-4 shadow-lg shadow-cyan-500/30">
                <span className="text-3xl">✈️</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-cyan-100 to-blue-200 bg-clip-text text-transparent mb-3">
                Create New Trip
              </h1>
              <p className="text-slate-400 text-lg">
                Tell us about your travel plans and we'll help you create an amazing itinerary
              </p>
            </div>

            {error && (
              <div className="mb-8 p-4 bg-red-500/10 border border-red-500/30 text-red-300 rounded-xl backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <span className="text-xl">⚠️</span>
                  <span>{error}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-3">
                  Destination *
                </label>
                <input
                  type="text"
                  name="destination"
                  value={formData.destination}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Paris, France"
                  className="w-full px-5 py-4 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-300"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-3">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-5 py-4 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-3">
                    End Date *
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    required
                    min={formData.startDate || new Date().toISOString().split('T')[0]}
                    className="w-full px-5 py-4 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-3">
                    Budget *
                  </label>
                  <input
                    type="number"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    required
                    min="1"
                    placeholder="e.g., 50000"
                    className="w-full px-5 py-4 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-3">
                    Currency *
                  </label>
                  <select
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                    className="w-full px-5 py-4 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-300"
                  >
                    {currencies.map((curr) => (
                      <option key={curr} value={curr} className="bg-slate-800">
                        {curr}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-300 mb-4">
                  Travel Type *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {travelTypes.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          travelType: type.value,
                        }))
                      }
                      className={`p-5 border-2 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                        formData.travelType === type.value
                          ? 'border-cyan-500 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 text-cyan-300 shadow-lg shadow-cyan-500/20'
                          : 'border-slate-700/50 bg-slate-800/30 text-slate-400 hover:border-slate-600 hover:bg-slate-800/50'
                      }`}
                    >
                      <div className="text-3xl mb-2">{type.emoji}</div>
                      <div className="text-sm font-bold">{type.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-300 mb-4">
                  Interests (Select all that apply)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {interestOptions.map((interest) => (
                    <button
                      key={interest.value}
                      type="button"
                      onClick={() => handleInterestToggle(interest.value)}
                      className={`p-4 border-2 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                        formData.interests.includes(interest.value)
                          ? 'border-cyan-500 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 text-cyan-300 shadow-lg shadow-cyan-500/20'
                          : 'border-slate-700/50 bg-slate-800/30 text-slate-400 hover:border-slate-600 hover:bg-slate-800/50'
                      }`}
                    >
                      <div className="text-2xl mb-2">{interest.emoji}</div>
                      <div className="text-xs font-bold">
                        {interest.label}
                      </div>
                    </button>
                  ))}
                </div>
                <p className="mt-4 text-sm text-slate-400 bg-slate-800/30 rounded-lg px-4 py-2 inline-block">
                  Selected: <span className="font-bold text-cyan-400">{formData.interests.length}</span> interest
                  {formData.interests.length !== 1 ? 's' : ''}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 hover:from-cyan-600 hover:via-blue-600 hover:to-purple-700 text-white py-4 px-8 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-2xl shadow-cyan-500/30 hover:shadow-cyan-500/50"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-3">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      Creating Trip...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <span>Create Trip</span>
                      <span className="text-xl">✨</span>
                    </span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="px-8 py-4 border-2 border-slate-700/50 bg-slate-800/30 text-slate-300 rounded-xl hover:bg-slate-800/50 hover:border-slate-600 transition-all duration-300 font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewTrip;
