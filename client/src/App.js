import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import NewTrip from './pages/NewTrip';
import TripDetail from './pages/TripDetail';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/trips/new"
              element={
                <ProtectedRoute>
                  <NewTrip />
                </ProtectedRoute>
              }
            />
            <Route
              path="/trips/:tripId"
              element={
                <ProtectedRoute>
                  <TripDetail />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Layout>
      </AuthProvider>
    </Router>
  );
}

export default App;
