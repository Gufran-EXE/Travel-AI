const Trip = require('../models/Trip');
const Itinerary = require('../models/Itinerary');
const asyncHandler = require('../utils/asyncHandler');

const createTrip = asyncHandler(async (req, res, next) => {
  const {
    destination,
    startDate,
    endDate,
    budget,
    currency,
    interests,
    travelType,
    aiPromptUsed,
  } = req.body;

  if (!destination || !startDate || !endDate || budget === undefined) {
    res.status(400);
    return next(
      new Error('Please provide destination, startDate, endDate, and budget')
    );
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    res.status(400);
    return next(new Error('Invalid date format'));
  }

  if (end < start) {
    res.status(400);
    return next(new Error('End date must be after or equal to start date'));
  }

  const trip = await Trip.create({
    userId: req.user.id,
    destination,
    startDate: start,
    endDate: end,
    budget,
    currency: currency || 'INR',
    interests: interests || [],
    travelType: travelType || 'solo',
    aiPromptUsed,
  });

  res.status(201).json({
    success: true,
    trip,
  });
});

const getTrips = asyncHandler(async (req, res, next) => {
  const trips = await Trip.find({ userId: req.user.id }).sort({
    createdAt: -1,
  });

  res.status(200).json({
    success: true,
    count: trips.length,
    trips,
  });
});

const getTrip = asyncHandler(async (req, res, next) => {
  const trip = await Trip.findOne({
    _id: req.params.tripId,
    userId: req.user.id,
  });

  if (!trip) {
    res.status(404);
    return next(new Error('Trip not found'));
  }

  const itinerary = await Itinerary.findOne({ tripId: trip._id });

  res.status(200).json({
    success: true,
    trip,
    itinerary: itinerary || null,
  });
});

const deleteTrip = asyncHandler(async (req, res, next) => {
  const trip = await Trip.findOne({
    _id: req.params.tripId,
    userId: req.user.id,
  });

  if (!trip) {
    res.status(404);
    return next(new Error('Trip not found'));
  }

  await Itinerary.deleteOne({ tripId: trip._id });
  await Trip.deleteOne({ _id: trip._id });

  res.status(200).json({
    success: true,
    message: 'Trip and related itinerary deleted successfully',
  });
});

module.exports = {
  createTrip,
  getTrips,
  getTrip,
  deleteTrip,
};
