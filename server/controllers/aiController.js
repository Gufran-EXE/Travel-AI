const Trip = require('../models/Trip');
const Itinerary = require('../models/Itinerary');
const asyncHandler = require('../utils/asyncHandler');
const { generateItineraryForTrip } = require('../services/aiItineraryService');

const generateItinerary = asyncHandler(async (req, res, next) => {
  const { tripId } = req.params;

  const trip = await Trip.findOne({
    _id: tripId,
    userId: req.user.id,
  });

  if (!trip) {
    res.status(404);
    return next(new Error('Trip not found'));
  }

  const existingItinerary = await Itinerary.findOne({ tripId: trip._id });

  if (existingItinerary) {
    res.status(400);
    return next(
      new Error(
        'Itinerary already exists for this trip. Delete it first or use the update endpoint.'
      )
    );
  }

  let itineraryData;
  try {
    itineraryData = await generateItineraryForTrip(trip);
  } catch (error) {
    console.error('AI Generation Error:', error);
    res.status(500);
    return next(
      new Error(
        'Failed to generate itinerary. Please try again or contact support.'
      )
    );
  }

  if (!itineraryData || !itineraryData.days || itineraryData.days.length === 0) {
    res.status(500);
    return next(new Error('Generated itinerary is empty. Please try again.'));
  }

  const itinerary = await Itinerary.create({
    tripId: trip._id,
    userId: req.user.id,
    days: itineraryData.days,
  });

  res.status(201).json({
    success: true,
    message: 'Itinerary generated successfully',
    itinerary,
    aiProvider: process.env.AI_PROVIDER || 'mock',
  });
});

const regenerateItinerary = asyncHandler(async (req, res, next) => {
  const { tripId } = req.params;

  const trip = await Trip.findOne({
    _id: tripId,
    userId: req.user.id,
  });

  if (!trip) {
    res.status(404);
    return next(new Error('Trip not found'));
  }

  await Itinerary.deleteOne({ tripId: trip._id });

  let itineraryData;
  try {
    itineraryData = await generateItineraryForTrip(trip);
  } catch (error) {
    console.error('AI Generation Error:', error);
    res.status(500);
    return next(
      new Error(
        'Failed to regenerate itinerary. Please try again or contact support.'
      )
    );
  }

  if (!itineraryData || !itineraryData.days || itineraryData.days.length === 0) {
    res.status(500);
    return next(new Error('Generated itinerary is empty. Please try again.'));
  }

  const itinerary = await Itinerary.create({
    tripId: trip._id,
    userId: req.user.id,
    days: itineraryData.days,
  });

  res.status(200).json({
    success: true,
    message: 'Itinerary regenerated successfully',
    itinerary,
    aiProvider: process.env.AI_PROVIDER || 'mock',
  });
});

module.exports = {
  generateItinerary,
  regenerateItinerary,
};
