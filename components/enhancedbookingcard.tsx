"use client";
import { useState, useEffect } from 'react';

export default function EnhancedBookingCard({ booking }: { booking: any }) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 1000);
    return () => clearTimeout(timer);
  }, [booking]);

  if (!booking) {
    return (
      <div className="max-w-2xl mx-auto bg-white/80 backdrop-blur-lg p-8 rounded-3xl shadow-2xl border border-white/20 relative overflow-hidden group hover:shadow-3xl transition-all duration-500">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-3xl transform group-hover:scale-105 transition-transform duration-700"></div>
        
        <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-6">
          {/* Animated car icon */}
          <div className="relative">
            <div className="text-7xl animate-bounce">🚗</div>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-2 bg-gray-200 rounded-full opacity-30 animate-pulse"></div>
          </div>
          
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-gray-800">No booking found</h2>
            <p className="text-gray-600 max-w-md leading-relaxed">
              You haven't booked any slot yet. Try searching a location to begin your smart parking journey.
            </p>
          </div>
          
        
        </div>
        

      </div>
    );
  }

  return (
    <div className={`max-w-2xl mx-auto bg-white/90 backdrop-blur-lg p-8 rounded-3xl shadow-2xl border border-white/20 relative overflow-hidden transition-all duration-500 ${isAnimating ? 'animate-pulse' : ''}`}>
      {/* Success gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-3xl"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <span className="mr-3 text-3xl">🎯</span>
            Active Booking
          </h2>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-emerald-600 font-semibold text-sm uppercase tracking-wide">
              {booking.status.replace('_', ' ')}
            </span>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-2xl border border-gray-200/50">
          <div className="flex items-start space-x-4">
            <div className="text-4xl">📍</div>
            <div className="flex-1">
              <h3 className="font-bold text-lg text-gray-800 mb-2">
                {booking.parkingslot.Adress}
              </h3>
              <div className="space-y-2 text-gray-600">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">🕐</span>
                  <span className="font-medium">
                    {new Date(booking.starttime).toLocaleString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg">🆔</span>
                  <span>Slot #{booking.parkingslot.id}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex space-x-3 mt-6">
          <button className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]">
            🗺️ Navigate
          </button>
          <button className="flex-1 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 py-3 px-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]">
            📞 Contact
          </button>
          <button className="bg-gradient-to-r from-red-100 to-red-200 text-red-700 py-3 px-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]">
            ❌
          </button>
        </div>
      </div>
    </div>
  );
}
