const Itinerary = require('../models/Itinerary');
const Trip = require('../models/Trip');
const asyncHandler = require('../utils/asyncHandler');

const updateItinerary = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { days, totalEstimatedCost } = req.body;

  if (!days || !Array.isArray(days)) {
    res.status(400);
    return next(new Error('Please provide days array'));
  }

  let itinerary = await Itinerary.findOne({
    _id: id,
    userId: req.user.id,
  });

  if (!itinerary) {
    res.status(404);
    return next(new Error('Itinerary not found'));
  }

  const trip = await Trip.findOne({
    _id: itinerary.tripId,
    userId: req.user.id,
  });

  if (!trip) {
    res.status(404);
    return next(new Error('Associated trip not found'));
  }

  itinerary.days = days;
  if (totalEstimatedCost !== undefined) {
    itinerary.totalEstimatedCost = totalEstimatedCost;
  }

  await itinerary.save();

  res.status(200).json({
    success: true,
    itinerary,
  });
});

const createItinerary = asyncHandler(async (req, res, next) => {
  const { tripId, days } = req.body;

  if (!tripId || !days || !Array.isArray(days)) {
    res.status(400);
    return next(new Error('Please provide tripId and days array'));
  }

  const trip = await Trip.findOne({
    _id: tripId,
    userId: req.user.id,
  });

  if (!trip) {
    res.status(404);
    return next(new Error('Trip not found'));
  }

  const existingItinerary = await Itinerary.findOne({ tripId });

  if (existingItinerary) {
    res.status(400);
    return next(new Error('Itinerary already exists for this trip'));
  }

  const itinerary = await Itinerary.create({
    tripId,
    userId: req.user.id,
    days,
  });

  res.status(201).json({
    success: true,
    itinerary,
  });
});

const getItinerary = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const itinerary = await Itinerary.findOne({
    _id: id,
    userId: req.user.id,
  }).populate('tripId');

  if (!itinerary) {
    res.status(404);
    return next(new Error('Itinerary not found'));
  }

  res.status(200).json({
    success: true,
    itinerary,
  });
});

const deleteItinerary = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const itinerary = await Itinerary.findOne({
    _id: id,
    userId: req.user.id,
  });

  if (!itinerary) {
    res.status(404);
    return next(new Error('Itinerary not found'));
  }

  await Itinerary.deleteOne({ _id: id });

  res.status(200).json({
    success: true,
    message: 'Itinerary deleted successfully',
  });
});

module.exports = {
  updateItinerary,
  createItinerary,
  getItinerary,
  deleteItinerary,
};
