const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

router.get('/', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  
  res.status(200).json({
    success: true,
    message: 'VoyageAI API is running',
    timestamp: new Date().toISOString(),
    database: dbStatus,
    environment: process.env.NODE_ENV || 'development',
  });
});

module.exports = router;
