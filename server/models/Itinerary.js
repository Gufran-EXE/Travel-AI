const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema(
  {
    timeSlot: {
      type: String,
      enum: ['Morning', 'Afternoon', 'Evening', 'Night'],
      required: true,
    },
    placeName: {
      type: String,
      required: [true, 'Place name is required'],
      trim: true,
    },
    placeType: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    estimatedCost: {
      type: Number,
      default: 0,
      min: 0,
    },
    location: {
      address: {
        type: String,
        trim: true,
      },
      lat: {
        type: Number,
      },
      lng: {
        type: Number,
      },
      mapUrl: {
        type: String,
        trim: true,
      },
    },
  },
  { _id: true }
);

const daySchema = new mongoose.Schema(
  {
    dayNumber: {
      type: Number,
      required: true,
      min: 1,
    },
    date: {
      type: Date,
      required: true,
    },
    summary: {
      type: String,
      trim: true,
    },
    activities: [activitySchema],
    notes: {
      type: String,
      trim: true,
    },
    estimatedDayCost: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { _id: true }
);

const itinerarySchema = new mongoose.Schema(
  {
    tripId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trip',
      required: [true, 'Trip ID is required'],
      unique: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    days: [daySchema],
    totalEstimatedCost: {
      type: Number,
      default: 0,
      min: 0,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

itinerarySchema.index({ tripId: 1 });
itinerarySchema.index({ userId: 1 });

itinerarySchema.pre('save', function (next) {
  this.lastUpdated = new Date();
  
  let totalCost = 0;
  this.days.forEach((day) => {
    let dayCost = 0;
    day.activities.forEach((activity) => {
      dayCost += activity.estimatedCost || 0;
    });
    day.estimatedDayCost = dayCost;
    totalCost += dayCost;
  });
  this.totalEstimatedCost = totalCost;
  
  next();
});

module.exports = mongoose.model('Itinerary', itinerarySchema);
