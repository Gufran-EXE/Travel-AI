// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const path = require('path');

const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Connect to DB
connectDB();

const app = express();

// --- Middleware ---
app.use(helmet()); // security headers
app.use(compression()); // gzip responses

// Logging in dev only
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration
// FRONTEND_URL can be a single origin or comma-separated list
const frontendEnv = process.env.FRONTEND_URL || '';
const allowedOrigins = frontendEnv
  ? frontendEnv.split(',').map((s) => s.trim())
  : [];

const corsOptions = {
  origin: function (origin, callback) {
    // allow requests with no origin (like curl, Postman, server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.length === 0) {
      // no FRONTEND_URL provided -> allow all origins (dev convenience)
      return callback(null, true);
    }
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }
    return callback(new Error('CORS policy: This origin is not allowed'), false);
  },
  credentials: true,
};
app.use(cors(corsOptions));

// --- Routes ---
app.use('/api/health', require('./routes/health'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/trips', require('./routes/trips'));
app.use('/api/itineraries', require('./routes/itineraries'));

// Serve client build in production (optional, safe)
if (process.env.NODE_ENV === 'production') {
  const clientBuildPath = path.join(__dirname, '..', 'client', 'build');
  app.use(express.static(clientBuildPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
}

// Error handler (should be after routes)
app.use(errorHandler);

// Start server
const PORT = parseInt(process.env.PORT, 10) || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Graceful shutdown helpers
const shutdown = (signal) => {
  console.log(`\nReceived ${signal}. Closing server gracefully...`);
  server.close(() => {
    console.log('HTTP server closed.');
    // close DB connection if you exported/made available in connectDB implementation
    // e.g., mongoose.connection.close(false) if using mongoose
    process.exit(0);
  });

  // force exit after 10s
  setTimeout(() => {
    console.error('Forcing shutdown.');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// Uncaught exceptions / rejections — log and exit (Render will restart)
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
  process.exit(1);
});
