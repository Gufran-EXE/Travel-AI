const express = require('express');
const router = express.Router();
const {
  createTrip,
  getTrips,
  getTrip,
  deleteTrip,
} = require('../controllers/tripController');
const {
  generateItinerary,
  regenerateItinerary,
} = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/').post(createTrip).get(getTrips);

router.route('/:tripId').get(getTrip).delete(deleteTrip);

router.post('/:tripId/generate-itinerary', generateItinerary);
router.post('/:tripId/regenerate-itinerary', regenerateItinerary);

module.exports = router;
