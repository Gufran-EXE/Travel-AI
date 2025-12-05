import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

const TripDetail = () => {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [generating, setGenerating] = useState(false);
  const [activeDay, setActiveDay] = useState(0);
  const [editingActivity, setEditingActivity] = useState(null);
  const [editForm, setEditForm] = useState({
    placeName: '',
    description: '',
    estimatedCost: '',
    notes: '',
  });
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    fetchTripData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tripId]);

  const fetchTripData = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get(`/api/trips/${tripId}`);
      setTrip(response.data.trip);
      setItinerary(response.data.itinerary);
    } catch (err) {
      setError('Failed to load trip details. Please try again.');
      console.error('Error fetching trip:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateItinerary = async () => {
    if (!window.confirm('Generate AI itinerary for this trip?')) {
      return;
    }

    try {
      setGenerating(true);
      setError('');
      const response = await api.post(
        `/api/trips/${tripId}/generate-itinerary`
      );
      setItinerary(response.data.itinerary);
      setActiveDay(0);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Failed to generate itinerary. Please try again.'
      );
      console.error('Error generating itinerary:', err);
    } finally {
      setGenerating(false);
    }
  };

  const handleRegenerateItinerary = async () => {
    if (
      !window.confirm(
        'This will overwrite your existing itinerary. Are you sure?'
      )
    ) {
      return;
    }

    try {
      setGenerating(true);
      setError('');
      const response = await api.post(
        `/api/trips/${tripId}/regenerate-itinerary`
      );
      setItinerary(response.data.itinerary);
      setActiveDay(0);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Failed to regenerate itinerary. Please try again.'
      );
      console.error('Error regenerating itinerary:', err);
    } finally {
      setGenerating(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getTravelTypeEmoji = (type) => {
    const emojis = {
      solo: '🧳',
      couple: '💑',
      family: '👨‍👩‍👧‍👦',
      friends: '👥',
      business: '💼',
      other: '✈️',
    };
    return emojis[type] || '✈️';
  };

  const getTimeSlotEmoji = (slot) => {
    const emojis = {
      Morning: '🌅',
      Afternoon: '☀️',
      Evening: '🌆',
      Night: '🌙',
    };
    return emojis[slot] || '⏰';
  };

  const handleEditActivity = (dayIndex, activityIndex) => {
    const activity = itinerary.days[dayIndex].activities[activityIndex];
    setEditingActivity({ dayIndex, activityIndex });
    setEditForm({
      placeName: activity.placeName || '',
      description: activity.description || '',
      estimatedCost: activity.estimatedCost || '',
      notes: itinerary.days[dayIndex].notes || '',
    });
    setSaveSuccess(false);
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveActivity = async () => {
    if (!editForm.placeName.trim()) {
      alert('Place name is required');
      return;
    }

    if (!editForm.estimatedCost || editForm.estimatedCost < 0) {
      alert('Please enter a valid cost');
      return;
    }

    setSaving(true);
    setSaveSuccess(false);

    try {
      const updatedDays = [...itinerary.days];
      updatedDays[editingActivity.dayIndex].activities[
        editingActivity.activityIndex
      ] = {
        ...updatedDays[editingActivity.dayIndex].activities[
          editingActivity.activityIndex
        ],
        placeName: editForm.placeName.trim(),
        description: editForm.description.trim(),
        estimatedCost: Number(editForm.estimatedCost),
      };
      updatedDays[editingActivity.dayIndex].notes = editForm.notes.trim();

      const response = await api.put(`/api/itineraries/${itinerary._id}`, {
        days: updatedDays,
      });

      setItinerary(response.data.itinerary);
      setSaveSuccess(true);
      setTimeout(() => {
        setEditingActivity(null);
        setSaveSuccess(false);
      }, 1500);
    } catch (err) {
      alert(
        err.response?.data?.message ||
          'Failed to save changes. Please try again.'
      );
      console.error('Error saving activity:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingActivity(null);
    setSaveSuccess(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-slate-700 border-t-cyan-500 mx-auto"></div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 blur-2xl"></div>
          </div>
          <p className="text-slate-300 text-lg mt-6 animate-pulse">Loading trip details...</p>
        </div>
      </div>
    );
  }

  if (error && !trip) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-3xl shadow-2xl p-12 text-center">
              <div className="text-7xl mb-6">⚠️</div>
              <h2 className="text-3xl font-bold text-white mb-4">
                Error Loading Trip
              </h2>
              <p className="text-red-400 text-lg mb-8">{error}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={fetchTripData}
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-cyan-500/30 font-bold"
                >
                  Retry
                </button>
                <Link
                  to="/dashboard"
                  className="bg-slate-800/50 border-2 border-slate-700/50 hover:bg-slate-800 text-slate-300 px-8 py-4 rounded-xl transition-all duration-300 font-semibold"
                >
                  Back to Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!trip) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-8 transition-colors duration-300 group"
          >
            <span className="group-hover:-translate-x-1 transition-transform duration-300">←</span>
            <span className="font-semibold">Back to Dashboard</span>
          </Link>

          {/* Trip Summary Card */}
          <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-800/50 p-8 md:p-10 mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
              <div className="flex-1">
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-cyan-100 to-blue-200 bg-clip-text text-transparent mb-3">
                  {trip.destination}
                </h1>
                <p className="text-slate-400 text-lg flex items-center gap-2">
                  <span className="text-xl">📅</span>
                  {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                </p>
              </div>
              <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 backdrop-blur-sm border border-cyan-500/30 rounded-2xl p-6 text-center shadow-lg shadow-cyan-500/10">
                <div className="text-3xl md:text-4xl font-bold text-cyan-300 mb-1">
                  {trip.budget.toLocaleString()} {trip.currency}
                </div>
                <div className="text-sm text-slate-400 font-semibold">Total Budget</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-800/30 rounded-2xl p-5 border border-slate-700/50">
                <h3 className="text-sm font-bold text-slate-400 mb-3">
                  Travel Type
                </h3>
                <div className="flex items-center gap-3">
                  <span className="text-3xl">
                    {getTravelTypeEmoji(trip.travelType)}
                  </span>
                  <span className="text-xl text-white font-semibold capitalize">{trip.travelType}</span>
                </div>
              </div>

              {trip.interests && trip.interests.length > 0 && (
                <div className="bg-slate-800/30 rounded-2xl p-5 border border-slate-700/50">
                  <h3 className="text-sm font-bold text-slate-400 mb-3">
                    Interests
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {trip.interests.map((interest, idx) => (
                      <span
                        key={idx}
                        className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 px-4 py-2 rounded-lg text-sm font-bold border border-cyan-500/30"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-300 px-6 py-4 rounded-2xl mb-8 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <span className="text-2xl">⚠️</span>
                <span>{error}</span>
              </div>
            </div>
          )}

          {generating && (
            <div className="bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-purple-500/10 backdrop-blur-xl border border-cyan-500/30 rounded-3xl p-12 mb-8 text-center shadow-2xl shadow-cyan-500/10">
              <div className="relative inline-block mb-6">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-700 border-t-cyan-500"></div>
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500/30 to-blue-500/30 blur-2xl animate-pulse"></div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                🤖 AI is planning your perfect trip...
              </h3>
              <p className="text-slate-400 text-lg">
                This may take a few moments. Hang tight!
              </p>
            </div>
          )}

          {!itinerary && !generating && (
            <div className="bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-purple-500/10 backdrop-blur-xl border border-cyan-500/20 rounded-3xl p-16 text-center shadow-2xl">
              <div className="text-7xl mb-6 animate-bounce">🤖✨</div>
              <h2 className="text-4xl font-bold text-white mb-5">
                No itinerary generated yet
              </h2>
              <p className="text-slate-300 text-lg mb-10 max-w-2xl mx-auto">
                Let our AI create a personalized day-by-day itinerary for your
                trip based on your preferences, budget, and interests.
              </p>
              <button
                onClick={handleGenerateItinerary}
                className="inline-flex items-center gap-3 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 hover:from-cyan-600 hover:via-blue-600 hover:to-purple-700 text-white px-10 py-5 rounded-2xl text-xl font-bold shadow-2xl shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all duration-300 transform hover:scale-105"
              >
                <span className="text-2xl">✨</span>
                Generate AI Itinerary
                <span className="text-2xl">→</span>
              </button>
            </div>
          )}

          {itinerary && !generating && (
            <div className="space-y-8">
              <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-800/50 p-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                      <span className="text-2xl">🗺️</span>
                      Your Itinerary
                    </h2>
                    <p className="text-slate-400 text-lg">
                      {itinerary.days.length} days • {itinerary.totalEstimatedCost.toLocaleString()}{' '}
                      {trip.currency} estimated
                    </p>
                  </div>
                  <button
                    onClick={handleRegenerateItinerary}
                    className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-purple-500/30 font-bold flex items-center gap-2"
                  >
                    <span>🔄</span>
                    Regenerate
                  </button>
                </div>

                {/* Day Tabs - Horizontal Slider */}
                <div className="flex gap-3 mb-8 overflow-x-auto pb-3 scrollbar-hide">
                  {itinerary.days.map((day, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveDay(idx)}
                      className={`px-6 py-3 rounded-xl font-bold whitespace-nowrap transition-all duration-300 transform hover:scale-105 ${
                        activeDay === idx
                          ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30'
                          : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-slate-300 border border-slate-700/50'
                      }`}
                    >
                      Day {day.dayNumber}
                    </button>
                  ))}
                </div>

                {itinerary.days[activeDay] && (
                  <div className="space-y-6">
                    {/* Day Summary */}
                    <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-l-4 border-cyan-500 rounded-r-2xl pl-6 pr-6 py-5 backdrop-blur-sm">
                      <h3 className="text-2xl font-bold text-white mb-2">
                        {itinerary.days[activeDay].summary}
                      </h3>
                      <p className="text-slate-300 mb-3 flex items-center gap-2">
                        <span>📅</span>
                        {formatDate(itinerary.days[activeDay].date)}
                      </p>
                      <p className="text-cyan-400 font-bold text-lg flex items-center gap-2">
                        <span>💰</span>
                        Estimated Cost: {itinerary.days[activeDay].estimatedDayCost.toLocaleString()}{' '}
                        {trip.currency}
                      </p>
                    </div>

                    {itinerary.days[activeDay].notes && (
                      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-5 backdrop-blur-sm">
                        <p className="text-yellow-300 flex items-start gap-3">
                          <span className="text-xl">💡</span>
                          <span><strong>Note:</strong> {itinerary.days[activeDay].notes}</span>
                        </p>
                      </div>
                    )}

                    {/* Activities */}
                    <div className="space-y-5">
                      {itinerary.days[activeDay].activities.map(
                        (activity, actIdx) => (
                          <div
                            key={actIdx}
                            className="group bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 hover:shadow-xl hover:shadow-cyan-500/10 transition-all duration-300 transform hover:scale-[1.02]"
                          >
                            <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
                              <div className="flex items-start gap-4 flex-1">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center text-2xl border border-cyan-500/30">
                                  {getTimeSlotEmoji(activity.timeSlot)}
                                </div>
                                <div className="flex-1">
                                  <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1">
                                    {activity.timeSlot}
                                  </div>
                                  <h4 className="text-xl font-bold text-white mb-1 group-hover:text-cyan-300 transition-colors">
                                    {activity.placeName}
                                  </h4>
                                  {activity.placeType && (
                                    <span className="text-sm text-slate-400 bg-slate-700/50 px-3 py-1 rounded-lg inline-block">
                                      {activity.placeType}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                <button
                                  onClick={() =>
                                    handleEditActivity(activeDay, actIdx)
                                  }
                                  className="text-cyan-400 hover:text-cyan-300 transition-all duration-300 hover:scale-110 text-xl"
                                  title="Edit activity"
                                >
                                  ✏️
                                </button>
                                <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-xl px-5 py-3 text-center">
                                  <div className="text-xl font-bold text-cyan-300">
                                    {activity.estimatedCost.toLocaleString()}{' '}
                                    {trip.currency}
                                  </div>
                                  <div className="text-xs text-slate-400">
                                    Estimated
                                  </div>
                                </div>
                              </div>
                            </div>

                            {activity.description && (
                              <p className="text-slate-300 mb-4 pl-16 leading-relaxed">
                                {activity.description}
                              </p>
                            )}

                            {activity.location && (
                              <div className="flex flex-wrap items-center gap-4 text-sm pl-16">
                                {activity.location.address && (
                                  <span className="text-slate-400 flex items-center gap-2">
                                    <span>📍</span>
                                    {activity.location.address}
                                  </span>
                                )}
                                {activity.location.mapUrl && (
                                  <a
                                    href={activity.location.mapUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors flex items-center gap-1"
                                  >
                                    View on Map →
                                  </a>
                                )}
                              </div>
                            )}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {editingActivity !== null && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-3xl font-bold text-white flex items-center gap-3">
                  <span>✏️</span>
                  Edit Activity
                </h3>
                <button
                  onClick={handleCancelEdit}
                  className="text-slate-400 hover:text-white text-3xl transition-colors duration-300 hover:rotate-90 transform"
                  disabled={saving}
                >
                  ×
                </button>
              </div>

              {saveSuccess && (
                <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 text-green-300 rounded-xl backdrop-blur-sm flex items-center gap-3">
                  <span className="text-xl">✓</span>
                  <span className="font-semibold">Changes saved successfully!</span>
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-3">
                    Place Name *
                  </label>
                  <input
                    type="text"
                    name="placeName"
                    value={editForm.placeName}
                    onChange={handleEditFormChange}
                    disabled={saving}
                    className="w-full px-5 py-4 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-300 disabled:opacity-50"
                    placeholder="e.g., Eiffel Tower"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-3">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={editForm.description}
                    onChange={handleEditFormChange}
                    disabled={saving}
                    rows={4}
                    className="w-full px-5 py-4 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-300 disabled:opacity-50"
                    placeholder="Describe the activity..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-3">
                    Estimated Cost * ({trip?.currency})
                  </label>
                  <input
                    type="number"
                    name="estimatedCost"
                    value={editForm.estimatedCost}
                    onChange={handleEditFormChange}
                    disabled={saving}
                    min="0"
                    className="w-full px-5 py-4 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-300 disabled:opacity-50"
                    placeholder="e.g., 2500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-3">
                    Day Notes
                  </label>
                  <textarea
                    name="notes"
                    value={editForm.notes}
                    onChange={handleEditFormChange}
                    disabled={saving}
                    rows={3}
                    className="w-full px-5 py-4 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-300 disabled:opacity-50"
                    placeholder="Add notes for this day..."
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <button
                  onClick={handleSaveActivity}
                  disabled={saving}
                  className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white py-4 px-8 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg shadow-cyan-500/30"
                >
                  {saving ? (
                    <span className="flex items-center justify-center gap-3">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      Saving...
                    </span>
                  ) : (
                    'Save Changes'
                  )}
                </button>
                <button
                  onClick={handleCancelEdit}
                  disabled={saving}
                  className="px-8 py-4 border-2 border-slate-700/50 bg-slate-800/30 text-slate-300 rounded-xl hover:bg-slate-800/50 hover:border-slate-600 transition-all duration-300 font-semibold disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TripDetail;
