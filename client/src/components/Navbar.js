import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/70 backdrop-blur-lg border-b border-slate-800/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link 
            to="/" 
            className="group flex items-center space-x-2 transition-all duration-300"
          >
            <span className="text-2xl group-hover:scale-110 transition-transform duration-300">✈️</span>
            <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent group-hover:from-cyan-300 group-hover:via-blue-400 group-hover:to-purple-500 transition-all duration-300">
              VoyageAI
            </span>
          </Link>

          <div className="flex items-center space-x-3 sm:space-x-6">
            <Link
              to="/"
              className="hidden sm:block text-slate-300 hover:text-cyan-400 transition-all duration-200 font-medium relative group"
            >
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 group-hover:w-full transition-all duration-300"></span>
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-slate-300 hover:text-cyan-400 transition-all duration-200 font-medium relative group"
                >
                  Dashboard
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 group-hover:w-full transition-all duration-300"></span>
                </Link>
                <div className="flex items-center space-x-2 sm:space-x-4">
                  <span className="hidden sm:inline text-slate-400 text-sm">
                    Hi, {user?.name?.split(' ')[0]}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="group relative bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 px-3 sm:px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 text-sm font-bold overflow-hidden"
                  >
                    <span className="relative z-10">Logout</span>
                    <div className="absolute inset-0 bg-red-500/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-slate-300 hover:text-cyan-400 transition-all duration-200 font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="group relative bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-3 sm:px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 text-sm font-bold overflow-hidden"
                >
                  <span className="relative z-10">Register</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
