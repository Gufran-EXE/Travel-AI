import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);

  const handleStartPlanning = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/register');
    }
  };

  // Auto-scroll effect for feature cards
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationFrameId;
    const scrollSpeed = 0.5; // pixels per frame (slower for smoother effect)

    const autoScroll = () => {
      if (!isHovering && scrollContainer) {
        const currentScroll = scrollContainer.scrollLeft;
        const cardWidth = 320 + 24; // card width (320px) + gap (24px)
        const totalCards = 6; // number of unique cards
        const resetPoint = cardWidth * totalCards; // scroll position to reset

        // If we've scrolled past the first set of cards, reset to beginning
        if (currentScroll >= resetPoint) {
          scrollContainer.scrollLeft = 0;
        } else {
          // Scroll smoothly to the right
          scrollContainer.scrollLeft += scrollSpeed;
        }
      }
      
      // Continue the animation
      animationFrameId = requestAnimationFrame(autoScroll);
    };

    // Start the animation
    animationFrameId = requestAnimationFrame(autoScroll);

    // Cleanup on unmount
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isHovering]);

  const features = [
    {
      title: 'Beach Getaways in Goa',
      description: 'Sun, sand, and sea with perfect beach vibes',
      tag: 'Popular',
      icon: '🏖️',
      gradient: 'from-orange-500 to-pink-500',
    },
    {
      title: 'Food Trails in Delhi',
      description: 'Explore the culinary capital of India',
      tag: 'Foodie',
      icon: '🍜',
      gradient: 'from-yellow-500 to-red-500',
    },
    {
      title: 'Nightlife in Bangkok',
      description: 'Experience the city that never sleeps',
      tag: 'Adventure',
      icon: '🌃',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      title: 'Mountains in Manali',
      description: 'Breathtaking views and serene landscapes',
      tag: 'Nature',
      icon: '🏔️',
      gradient: 'from-green-500 to-teal-500',
    },
    {
      title: 'Heritage in Rajasthan',
      description: 'Royal palaces and rich cultural history',
      tag: 'Culture',
      icon: '🏰',
      gradient: 'from-amber-500 to-orange-500',
    },
    {
      title: 'Backpacking in Europe',
      description: 'Budget-friendly adventures across cities',
      tag: 'Budget Friendly',
      icon: '🎒',
      gradient: 'from-blue-500 to-cyan-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-purple-500/10"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-900/20 via-transparent to-transparent"></div>
        
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Content */}
            <div className="text-left">
              <div className="inline-block mb-4 px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full">
                <span className="text-cyan-400 text-sm font-medium">✨ AI-Powered Travel Planning</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight">
                AI-Powered Travel Planning,
                <span className="block bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                  Reimagined
                </span>
              </h1>
              
              <p className="text-lg sm:text-xl text-slate-300 mb-10 leading-relaxed">
                Tell VoyageAI your destination, budget, and vibes. Get a smart, day-wise itinerary instantly. No more endless research.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleStartPlanning}
                  className="group relative bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-lg font-bold px-8 py-4 rounded-xl shadow-lg shadow-cyan-500/25 transition-all duration-300 transform hover:scale-105"
                >
                  <span className="relative z-10">Start Planning</span>
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 blur transition-opacity duration-300"></div>
                </button>
                <button
                  onClick={() => navigate('/trips/demo')}
                  className="bg-slate-800/50 hover:bg-slate-800 text-slate-200 border border-slate-700 text-lg font-semibold px-8 py-4 rounded-xl transition-all duration-200 backdrop-blur-sm"
                >
                  View Demo Trip
                </button>
              </div>

              <p className="mt-6 text-slate-400 text-sm">
                {isAuthenticated ? '✨ Go to your dashboard' : '✨ No credit card required • Free to start'}
              </p>
            </div>

            {/* Right: Mock Itinerary Card */}
            <div className="hidden lg:block">
              <div className="relative animate-float">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl blur-2xl opacity-20 animate-pulse"></div>
                <div className="relative bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-2xl transform rotate-2 hover:rotate-0 transition-all duration-500 hover:shadow-cyan-500/20">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-bold text-lg">Paris, France</h3>
                    <span className="text-cyan-400 text-sm">7 Days</span>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/30">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">🌅</span>
                        <span className="text-slate-300 text-sm font-medium">Morning</span>
                      </div>
                      <p className="text-slate-400 text-xs">Visit Eiffel Tower</p>
                    </div>
                    <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/30">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">☀️</span>
                        <span className="text-slate-300 text-sm font-medium">Afternoon</span>
                      </div>
                      <p className="text-slate-400 text-xs">Louvre Museum Tour</p>
                    </div>
                    <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/30">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">🌆</span>
                        <span className="text-slate-300 text-sm font-medium">Evening</span>
                      </div>
                      <p className="text-slate-400 text-xs">Seine River Cruise</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-700/50">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Estimated Cost</span>
                      <span className="text-cyan-400 font-semibold">₹12,500</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Slider Section */}
      <div className="py-16 sm:py-24 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Popular Destinations & Experiences
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Discover trending travel experiences curated by our AI
            </p>
          </div>

          <div 
            ref={scrollRef}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {/* Render features twice for seamless loop */}
            {[...features, ...features].map((feature, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-80 group cursor-pointer"
                onClick={handleStartPlanning}
              >
                <div className="relative h-full bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/10 hover:-translate-y-1 hover:scale-105">
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}></div>
                  
                  <div className="relative">
                    <div className="flex items-start justify-between mb-4">
                      <span className="text-4xl">{feature.icon}</span>
                      <span className={`px-3 py-1 bg-gradient-to-r ${feature.gradient} bg-opacity-10 text-xs font-semibold rounded-full text-white border border-white/10`}>
                        {feature.tag}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                    
                    <div className="mt-4 pt-4 border-t border-slate-700/50">
                      <div className="text-cyan-400 text-sm font-medium group-hover:text-cyan-300 transition-colors flex items-center gap-1 group-hover:gap-2 transition-all">
                        Explore 
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-center text-white mb-4">
              How It Works
            </h2>
            <p className="text-center text-slate-400 mb-16 max-w-2xl mx-auto">
              Three simple steps to your perfect itinerary
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="relative bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 p-8 rounded-2xl hover:border-cyan-500/50 transition-all duration-300 group">
                <div className="absolute top-4 right-4 text-6xl font-bold text-slate-800">01</div>
                <div className="relative">
                  <div className="text-5xl mb-4">📝</div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
                    Tell Us Your Plans
                  </h3>
                  <p className="text-slate-400 leading-relaxed">
                    Share your destination, travel dates, budget, and interests. The more details, the better!
                  </p>
                </div>
              </div>

              <div className="relative bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 p-8 rounded-2xl hover:border-cyan-500/50 transition-all duration-300 group">
                <div className="absolute top-4 right-4 text-6xl font-bold text-slate-800">02</div>
                <div className="relative">
                  <div className="text-5xl mb-4">🤖</div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
                    AI Creates Your Itinerary
                  </h3>
                  <p className="text-slate-400 leading-relaxed">
                    Our AI analyzes your preferences and generates a personalized day-by-day travel plan instantly.
                  </p>
                </div>
              </div>

              <div className="relative bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 p-8 rounded-2xl hover:border-cyan-500/50 transition-all duration-300 group">
                <div className="absolute top-4 right-4 text-6xl font-bold text-slate-800">03</div>
                <div className="relative">
                  <div className="text-5xl mb-4">🎉</div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
                    Customize & Go
                  </h3>
                  <p className="text-slate-400 leading-relaxed">
                    Review, edit, and perfect your itinerary. Then pack your bags and enjoy your amazing trip!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative py-20 sm:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10"></div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-5xl font-bold text-white mb-6">
            Ready to plan your dream vacation?
          </h2>
          <p className="text-lg sm:text-xl mb-10 text-slate-300 max-w-2xl mx-auto">
            Join thousands of travelers using AI to plan better trips
          </p>
          <button
            onClick={handleStartPlanning}
            className="group relative bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-lg sm:text-xl font-bold px-12 py-5 rounded-xl shadow-2xl shadow-cyan-500/25 transition-all duration-300 transform hover:scale-105"
          >
            <span className="relative z-10">Get Started Free</span>
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 blur transition-opacity duration-300"></div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
