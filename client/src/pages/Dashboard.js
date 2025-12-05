import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [tripToDelete, setTripToDelete] = useState(null);

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/api/trips');
      setTrips(response.data.trips);
    } catch (err) {
      setError('Failed to load trips. Please try again.');
      console.error('Error fetching trips:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (trip) => {
    setTripToDelete(trip);
    setShowDeleteModal(true);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setTripToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!tripToDelete) return;

    try {
      setDeletingId(tripToDelete._id);
      setShowDeleteModal(false);
      await api.delete(`/api/trips/${tripToDelete._id}`);
      setTrips(trips.filter((trip) => trip._id !== tripToDelete._id));
      setTripToDelete(null);
    } catch (err) {
      setError('Failed to delete trip. Please try again.');
      console.error('Error deleting trip:', err);
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Header */}
          <div className="mb-10 text-center md:text-left">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-2xl shadow-lg shadow-cyan-500/20">
                👋
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-cyan-100 to-blue-200 bg-clip-text text-transparent">
                Welcome back, {user?.name}!
              </h1>
            </div>
            <p className="text-slate-400 text-lg">
              Ready to plan your next adventure? Let's make it unforgettable.
            </p>
          </div>

          {/* Create New Trip Button */}
          <div className="mb-12 flex justify-center md:justify-start">
            <Link
              to="/trips/new"
              className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 text-white px-8 py-4 rounded-2xl shadow-2xl shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
            >
              <span className="text-2xl group-hover:rotate-12 transition-transform duration-300">✨</span>
              <span className="text-lg font-bold">Create New Trip</span>
              <span className="text-xl group-hover:translate-x-1 transition-transform duration-300">→</span>
            </Link>
          </div>

          {/* Trips Section */}
          <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-800/50 p-8 mb-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-xl shadow-lg shadow-cyan-500/20">
                🗺️
              </div>
              <h2 className="text-3xl font-bold text-white">My Trips</h2>
            </div>

            {loading ? (
              <div className="flex flex-col justify-center items-center py-16">
                <div className="relative">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-700 border-t-cyan-500"></div>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 blur-xl"></div>
                </div>
                <p className="mt-6 text-slate-400 text-lg animate-pulse">Loading your trips...</p>
              </div>
            ) : error ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">⚠️</div>
                <p className="text-red-400 text-lg mb-6">{error}</p>
                <button
                  onClick={fetchTrips}
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-cyan-500/30"
                >
                  Retry
                </button>
              </div>
            ) : trips.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-7xl mb-6 animate-bounce">🗺️</div>
                <p className="text-2xl text-white font-bold mb-3">No trips yet</p>
                <p className="text-slate-400 text-lg mb-8">
                  Create your first trip and let AI plan your perfect adventure!
                </p>
                <Link
                  to="/trips/new"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-cyan-500/30 font-semibold"
                >
                  <span className="text-xl">✨</span>
                  Create Your First Trip
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trips.map((trip) => (
                  <div
                    key={trip._id}
                    className="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-cyan-500/10 transition-all duration-300 overflow-hidden transform hover:scale-105 hover:-translate-y-2"
                  >
                    {/* Gradient Border Effect on Hover */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500/0 via-blue-500/0 to-purple-500/0 group-hover:from-cyan-500/20 group-hover:via-blue-500/20 group-hover:to-purple-500/20 transition-all duration-300"></div>
                    
                    <div className="relative p-6">
                      {/* Header with Delete Button */}
                      <div className="flex justify-between items-start mb-5">
                        <h3 className="text-2xl font-bold text-white flex-1 group-hover:text-cyan-300 transition-colors duration-300">
                          {trip.destination}
                        </h3>
                        <button
                          onClick={() => handleDeleteClick(trip)}
                          disabled={deletingId === trip._id}
                          className="text-red-400 hover:text-red-300 hover:scale-110 transition-all duration-200 disabled:opacity-50 ml-2"
                          title="Delete trip"
                        >
                          {deletingId === trip._id ? (
                            <span className="animate-spin text-xl">⏳</span>
                          ) : (
                            <span className="text-xl">🗑️</span>
                          )}
                        </button>
                      </div>

                      {/* Trip Details */}
                      <div className="space-y-3 mb-5">
                        {/* Dates */}
                        <div className="flex items-center text-slate-300 bg-slate-800/50 rounded-lg px-3 py-2">
                          <span className="mr-3 text-lg">📅</span>
                          <span className="text-sm">
                            {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                          </span>
                        </div>

                        {/* Budget */}
                        <div className="flex items-center text-slate-300 bg-slate-800/50 rounded-lg px-3 py-2">
                          <span className="mr-3 text-lg">💰</span>
                          <span className="text-sm font-semibold">
                            {trip.budget.toLocaleString()} {trip.currency}
                          </span>
                        </div>

                        {/* Travel Type Badge */}
                        <div className="flex items-center">
                          <span className="inline-flex items-center px-4 py-2 rounded-full text-xs font-bold bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/30">
                            <span className="mr-2 text-base">
                              {getTravelTypeEmoji(trip.travelType)}
                            </span>
                            {trip.travelType.charAt(0).toUpperCase() + trip.travelType.slice(1)}
                          </span>
                        </div>

                        {/* Interests Tags */}
                        {trip.interests && trip.interests.length > 0 && (
                          <div className="flex flex-wrap gap-2 pt-2">
                            {trip.interests.slice(0, 3).map((interest, idx) => (
                              <span
                                key={idx}
                                className="inline-block bg-slate-700/50 text-slate-300 px-3 py-1 rounded-lg text-xs border border-slate-600/50"
                              >
                                {interest}
                              </span>
                            ))}
                            {trip.interests.length > 3 && (
                              <span className="inline-block bg-slate-700/50 text-slate-300 px-3 py-1 rounded-lg text-xs border border-slate-600/50">
                                +{trip.interests.length - 3} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* View Details Button */}
                      <Link
                        to={`/trips/${trip._id}`}
                        className="block w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white text-center py-3 rounded-xl transition-all duration-300 font-bold shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 group-hover:scale-105"
                      >
                        View Details →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {trips.length > 0 && (
            <div className="bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 backdrop-blur-sm border border-cyan-500/20 rounded-2xl p-8 text-center">
              <p className="text-white text-lg mb-2">
                You have <span className="font-bold text-cyan-400 text-2xl">{trips.length}</span>{' '}
                {trips.length === 1 ? 'trip' : 'trips'} planned
              </p>
              <p className="text-slate-400">
                Keep exploring and planning your adventures! 🌍✨
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && tripToDelete && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-slate-900 border-2 border-red-500/30 rounded-3xl shadow-2xl max-w-md w-full transform transition-all duration-300 animate-scaleIn">
            {/* Modal Header */}
            <div className="p-8 text-center">
              <div className="w-20 h-20 rounded-full bg-red-500/10 border-2 border-red-500/30 flex items-center justify-center mx-auto mb-6 animate-pulse">
                <span className="text-5xl">🗑️</span>
              </div>
              
              <h3 className="text-3xl font-bold text-white mb-3">
                Delete Trip?
              </h3>
              
              <p className="text-slate-300 text-lg mb-2">
                Are you sure you want to delete
              </p>
              <p className="text-cyan-400 font-bold text-xl mb-6">
                "{tripToDelete.destination}"?
              </p>
              
              <p className="text-slate-400 text-sm">
                This action cannot be undone. All trip details and itinerary will be permanently deleted.
              </p>
            </div>

            {/* Modal Actions */}
            <div className="flex gap-4 p-6 bg-slate-950/50 rounded-b-3xl">
              <button
                onClick={handleCancelDelete}
                className="flex-1 bg-slate-800/50 hover:bg-slate-800 text-slate-300 border-2 border-slate-700/50 hover:border-slate-600 px-6 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="group relative flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-red-500/30 hover:shadow-red-500/50 overflow-hidden"
              >
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
                <span className="relative flex items-center justify-center gap-2">
                  Yes, Delete
                  <span className="text-xl">✓</span>
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
