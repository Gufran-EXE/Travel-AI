# VoyageAI - Quick Start Guide

## 🚀 Get Started in 3 Steps

### Step 1: Install Dependencies
```bash
npm run install-all
```

This will install dependencies for root, server, and client.

### Step 2: Configure Environment Variables

The `.env` files are already created with default values. Update them if needed:

**Server** (`server/.env`):
- `MONGODB_URI`: Update if using MongoDB Atlas or different local setup
- `JWT_SECRET`: Change to a secure random string for production

**Client** (`client/.env`):
- `REACT_APP_API_URL`: Update if backend runs on different port

### Step 3: Start the Application

Make sure MongoDB is running locally, then:

```bash
npm run dev
```

This starts both the backend (port 5000) and frontend (port 3000).

## 🎯 What's Included

### Backend (server/)
- ✅ Express server with CORS
- ✅ MongoDB connection with Mongoose
- ✅ JWT authentication middleware
- ✅ User model with password hashing
- ✅ Centralized error handler
- ✅ Health check endpoint
- ✅ Async handler utility

### Frontend (client/)
- ✅ React 18 with React Router v6
- ✅ Tailwind CSS configured
- ✅ Axios with interceptors
- ✅ API service layer
- ✅ Home page with API status check
- ✅ Responsive design

## 📝 Available Scripts

From root directory:
- `npm run dev` - Run both server and client
- `npm run server` - Run backend only
- `npm run client` - Run frontend only

## 🔗 URLs

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Health Check: http://localhost:5000/api/health

## 📦 Tech Stack

**Backend:**
- Node.js & Express
- MongoDB & Mongoose
- JWT & bcryptjs
- Express Validator

**Frontend:**
- React 18
- React Router v6
- Axios
- Tailwind CSS

## 🛠️ Next Steps

1. Add authentication routes (login/register)
2. Create protected routes
3. Build travel planning features
4. Add AI integration
5. Deploy to production

Enjoy building with VoyageAI! 🌍✈️
