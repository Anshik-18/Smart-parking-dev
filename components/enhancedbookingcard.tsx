"use client";
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function EnhancedBookingCard({ booking }: { booking: any }) {
  const [isAnimating, setIsAnimating] = useState(false);

  // Success states for animations
  const [isCheckInSuccess, setIsCheckInSuccess] = useState(false);
  const [isCheckoutSuccess, setIsCheckoutSuccess] = useState(false);
  const [isCancelSuccess, setIsCancelSuccess] = useState(false);

  // Local status to prevent flicker
  const [localStatus, setLocalStatus] = useState(booking?.status);

  const router = useRouter();

  // Cancel booking
  const handleCancelBooking = async (bookingId: number) => {
    try {
      const response = await fetch("/api/booking/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId })
      });
      const message = await response.json();

      if (message.message?.toLowerCase().includes("cancelled")) {
        setIsCancelSuccess(true);
        setLocalStatus("Cancelled"); // update immediately in UI

        setTimeout(() => {
          router.refresh();
        }, 1200);
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
    }
  };

  // Check in
  const handleCheckIn = async (bookingId: number) => {
    try {
      const response = await fetch("/api/booking/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId })
      });
      const message = await response.json();

      if (message.message === "Booking checked in successfully") {
        setIsCheckInSuccess(true);
        setLocalStatus("Parked"); // update immediately in UI

        setTimeout(() => {
          router.refresh();
        }, 1200);
      }
    } catch (error) {
      console.error('Error checking in:', error);
    }
  };

  // Check out
  const handleCheckout = async (bookingId: number) => {
    try {
      const response = await fetch("/api/booking/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId })
      });
      const message = await response.json();

      if (message.message?.toLowerCase().includes("checked out")) {
        setIsCheckoutSuccess(true);
        setLocalStatus("Completed"); // update immediately in UI

        setTimeout(() => {
          router.refresh();
        }, 1200);
      }
    } catch (error) {
      console.error('Error checking out:', error);
    }
  };

  // Animation on booking change
  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 1000);
    return () => clearTimeout(timer);
  }, [booking]);

  if (!booking) {
    return (
      <div className="max-w-2xl mx-auto bg-white/80 backdrop-blur-lg p-8 rounded-3xl shadow-2xl border border-white/20 relative overflow-hidden group hover:shadow-3xl transition-all duration-500">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-3xl transform group-hover:scale-105 transition-transform duration-700"></div>
        <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-6">
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
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-3xl"></div>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <span className="mr-3 text-3xl"></span>
            Active Booking
          </h2>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-emerald-600 font-semibold text-sm uppercase tracking-wide">
              {localStatus.replace('_', ' ')}
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
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex space-x-3 mt-6">
          {/* Navigate */}
          <button
            className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]"
            onClick={() => {
              router.push(`https://www.google.com/maps/dir/?api=1&destination=${booking.parkingslot.latitude},${booking.parkingslot.longitude}`);
            }}
          >
            🗺️ Navigate
          </button>

          {localStatus !== "Parked" ? (
            <>
              {/* Cancel */}
              <button
                className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] ${
                  isCancelSuccess
                    ? "bg-red-500 text-white scale-105"
                    : "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700"
                }`}
                onClick={() => handleCancelBooking(booking.id)}
                disabled={isCancelSuccess}
              >
                {isCancelSuccess ? "❌ Cancelled" : "❌ Cancel"}
              </button>

              {/* Check In */}
              <button
                className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] ${
                  isCheckInSuccess
                    ? "bg-green-500 text-white scale-105"
                    : "bg-gradient-to-r from-green-300 to-green-600 text-white"
                }`}
                onClick={() => handleCheckIn(booking.id)}
                disabled={isCheckInSuccess}
              >
                {isCheckInSuccess ? "✅ Checked In!" : "✅️ Check In"}
              </button>
            </>
          ) : (
            <>
              {/* Check Out */}
              <button
                className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] ${
                  isCheckoutSuccess
                    ? "bg-green-500 text-white scale-105"
                    : "bg-gradient-to-r from-green-300 to-green-600 text-white"
                }`}
                onClick={() => handleCheckout(booking.id)}
                disabled={isCheckoutSuccess}
              >
                {isCheckoutSuccess ? "✅ Checked Out!" : "✅️ Check Out"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
