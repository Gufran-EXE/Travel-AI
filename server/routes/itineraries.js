const express = require('express');
const router = express.Router();
const {
  updateItinerary,
  createItinerary,
  getItinerary,
  deleteItinerary,
} = require('../controllers/itineraryController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/', createItinerary);

router
  .route('/:id')
  .get(getItinerary)
  .put(updateItinerary)
  .delete(deleteItinerary);

module.exports = router;
