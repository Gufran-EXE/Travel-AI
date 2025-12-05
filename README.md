# VoyageAI - AI Travel Planner

A production-ready MERN stack application for AI-powered travel planning.

## Tech Stack

### Backend
- Node.js & Express
- MongoDB & Mongoose
- JWT Authentication
- Express Validator

### Frontend
- React 18
- React Router v6
- Axios
- Tailwind CSS

## Project Structure

```
voyageai/
├── server/          # Backend API (Node.js/Express)
├── client/          # Frontend (React)
├── package.json     # Root package with scripts
└── README.md        # This file
```

## Prerequisites

- Node.js 18+ and npm
- MongoDB (local or Atlas)

## Installation

### Option 1: Install Everything at Once
```bash
npm run install-all
```

### Option 2: Manual Installation
```bash
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

## Configuration

### Backend Configuration
1. Navigate to the `server` directory
2. Copy `.env.example` to `.env`
3. Update the environment variables:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: A secure random string for JWT signing
   - `PORT`: Server port (default: 5000)

### Frontend Configuration
1. Navigate to the `client` directory
2. Copy `.env.example` to `.env`
3. Update `REACT_APP_API_URL` to match your backend URL

## Running the Application

### Development Mode (Both Server & Client)
```bash
npm run dev
```

### Run Server Only
```bash
npm run server
```

### Run Client Only
```bash
npm run client
```

## API Endpoints

### Health Check
- `GET /api/health` - Check if the API is running

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Trips (Protected)
- `POST /api/trips` - Create a new trip
- `GET /api/trips` - Get all user trips
- `GET /api/trips/:tripId` - Get single trip with itinerary
- `DELETE /api/trips/:tripId` - Delete trip and itinerary
- `POST /api/trips/:tripId/generate-itinerary` - AI generate itinerary
- `POST /api/trips/:tripId/regenerate-itinerary` - Regenerate itinerary

### Itineraries (Protected)
- `POST /api/itineraries` - Create itinerary for a trip
- `GET /api/itineraries/:id` - Get itinerary
- `PUT /api/itineraries/:id` - Update itinerary
- `DELETE /api/itineraries/:id` - Delete itinerary

See [AUTH_API.md](server/AUTH_API.md), [TRIPS_API.md](server/TRIPS_API.md), and [AI_GENERATION_API.md](server/AI_GENERATION_API.md) for detailed API documentation.

## Default Ports

- Backend: http://localhost:5000
- Frontend: http://localhost:3000

## Features

- JWT-based authentication
- MongoDB database integration
- Centralized error handling
- CORS enabled
- Environment-based configuration
- Tailwind CSS styling
- React Router navigation

## License

MIT
