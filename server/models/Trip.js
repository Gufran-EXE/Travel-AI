const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    destination: {
      type: String,
      required: [true, 'Destination is required'],
      trim: true,
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
      validate: {
        validator: function (value) {
          return value >= this.startDate;
        },
        message: 'End date must be after or equal to start date',
      },
    },
    budget: {
      type: Number,
      required: [true, 'Budget is required'],
      min: [0, 'Budget must be a positive number'],
    },
    currency: {
      type: String,
      default: 'INR',
      uppercase: true,
      trim: true,
    },
    interests: {
      type: [String],
      default: [],
    },
    travelType: {
      type: String,
      enum: ['solo', 'family', 'friends', 'couple', 'business', 'other'],
      default: 'solo',
    },
    aiPromptUsed: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

tripSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Trip', tripSchema);
