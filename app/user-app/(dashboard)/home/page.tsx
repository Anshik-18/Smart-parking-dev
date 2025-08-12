import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import SearchBox from "../../../../components/searchboxwrapper";
import EnhancedBookingCard from "../../../../components/enhancedbookingcard";
import FloatingBackground from "../../../../components/Floatingbackground";
import StatsCards from "../../../../components/statecard";
import QuickActions from "../../../../components/quickactions";

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  const userid = session?.user?.id || "";
  let booking;
  let stats = null;

  try {
    // Fetch booking data (your original logic)
    booking = await db.parkings.findFirst({
      where: {
        userid: Number(userid),
        status: { in: ["Pre_booked", "Parked"] },
      },
      include: {
        parkingslot: true,
      },
    });

    
    

  } catch (error) {
    console.error("Error fetching booking:", error);
    return (
      <div className="min-h-screen relative overflow-hidden">
        <FloatingBackground />
        <div className="relative z-10 p-4 flex flex-col items-center justify-center text-center space-y-6 min-h-screen">
          <div className="bg-white/90 backdrop-blur-lg p-8 rounded-3xl shadow-2xl max-w-md mx-auto">
            <div className="animate-bounce text-8xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-red-600 mb-3">Oops! Something went wrong</h2>
            <p className="text-gray-700 leading-relaxed">
              We were unable to fetch your booking information. Please try refreshing the page or come back later.
            </p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
      <FloatingBackground />
      
      {/* Main Content */}
      <div className="relative z-10 p-4 space-y-6 max-w-4xl mx-auto">
        
        {/* Header Section with 3D Elements */}
        <div className="text-center py-8 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-3xl blur-3xl"></div>
          <div className="relative">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Smart Parking Hub
            </h1>
            <p className="text-gray-600 font-medium">Find, book, and manage your perfect parking spot</p>
          </div>
        </div>

        {/* Enhanced Search Box */}
        <div className="transform transition-all duration-500 hover:scale-[1.02]">
          <SearchBox />
        </div>

       

        {/* Enhanced Booking Card - this replaces your original booking section */}
        <EnhancedBookingCard booking={booking} />

        {/* Quick Actions */}
        <QuickActions />

        {/* Welcome Message for New Users - only show if no booking and user is logged in */}
        {!booking && userid && (
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 p-6 rounded-2xl shadow-lg">
            <div className="flex items-center space-x-4">
              <div className="text-4xl animate-pulse">🎉</div>
              <div>
                <h3 className="font-bold text-emerald-800 text-lg">Welcome to Smart Parking!</h3>
                <p className="text-emerald-700">Start by searching for parking spots in your area.</p>
              </div>
            </div>
          </div>
        )}

        {/* Guest Message - show if user is not logged in */}
        {!userid && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 p-6 rounded-2xl shadow-lg">
            <div className="flex items-center space-x-4">
              <div className="text-4xl">👋</div>
              <div>
                <h3 className="font-bold text-amber-800 text-lg">Welcome to Smart Parking!</h3>
                <p className="text-amber-700">Please sign in to access your bookings and personalized features.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}