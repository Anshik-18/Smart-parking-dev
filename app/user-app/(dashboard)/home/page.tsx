import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import SearchBox from "../../../../components/searchboxwrapper";

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  const userid = session?.user?.id || "";
  let booking
try{
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
    <div className="min-h-screen p-4 flex flex-col items-center justify-center text-center space-y-4">
      <span className="text-6xl text-red-500">⚠️</span>
      <h2 className="text-2xl font-semibold text-red-600">Oops! Something went wrong.</h2>
      <p className="text-gray-700 max-w-md">
        We were unable to fetch your booking information. Please try refreshing the page or come back later.
      </p>
      </div>
)
}

  return (
    <div className="min-h-screen bg-gray-100 p-4 space-y-6">
      
      <SearchBox />

      {/* Booking Info */}
      <div className="max-w-xl mx-auto bg-white p-4 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-2 text-black">Booked Slot</h2>
        {booking ? (
          <div className="text-black">
            <div>📍 {booking?.parkingslot.Adress}</div>
            <div className="text-sm text-gray-600">
              {new Date(booking?.starttime).toLocaleString()}
            </div>
          </div>
        ) : (
          <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-md flex flex-col items-center justify-center text-center space-y-4">
            <span className="text-5xl">🚗</span>
            <h2 className="text-xl font-semibold text-black">No booking found</h2>
            <p className="text-gray-500">You haven’t booked any slot yet. Try searching a location to begin.</p>
          </div>

        )}
      </div>
    </div>
  );
}
