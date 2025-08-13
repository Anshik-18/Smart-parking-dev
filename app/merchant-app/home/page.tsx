import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import { db } from "@/lib/db";
import Link from "next/link";

async function getParkinglots() {
    const session = await getServerSession(authOptions);
    const merchantid = session?.user?.merchantId;
    const userId = session?.user?.id;
    console.log("User ID:", userId);
    console.log("Merchant ID:", merchantid);

    const parkinglots = await db.parkinglot.findMany({
      where: {
        merchantid: Number(merchantid),
      },
    });

  return parkinglots;
}

async function getParkingsForDate(parkinglotid: number) {
  const parkings = await db.parkings.findMany({
    where: {
      parkingslotid: parkinglotid,
    },
  });

  return parkings;
}

export default async function Home() {
  const session = await getServerSession(authOptions);
  const merchantid = session?.user?.merchantId;
  console.log("Merchant ID:", merchantid);

  if (!merchantid) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-red-800 mb-2">Authentication Required</h2>
          <p className="text-red-600">Please log in as a merchant to access this dashboard.</p>
        </div>
      </div>
    );
  }

  const parkinglots = await getParkinglots();

  if (!parkinglots || parkinglots.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 max-w-md w-full" style={{textAlign: 'center'}}>
              <h2 className="text-2xl font-bold text-gray-800 mb-3" style={{textAlign: 'center'}}>No Parking Lots Found</h2>
              <p className="text-gray-600 mb-6" style={{textAlign: 'center'}}>You haven't created any parking lots yet. Get started by creating one now.</p>
              <div style={{textAlign: 'center'}}>
                <Link href="/merchant-app/CreateLot">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200">
                    Create Parking Lot
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Get parkings for all parking lots
  const allParkings = await Promise.all(
    parkinglots.map(async (lot) => {
      const parkings = await getParkingsForDate(Number(lot.id));
      return { lot, parkings };
    })
  );

  // Calculate totals across all parking lots
  const totalSlots = parkinglots.reduce((sum, lot) => sum + (lot.totalslots || 0), 0);
  const totalOccupied = parkinglots.reduce((sum, lot) => sum + (lot.occupiedslots || 0), 0);
  const totalVacant = parkinglots.reduce((sum, lot) => sum + (lot.vacantslots || 0), 0);
  const overallOccupancyRate = totalSlots > 0 ? Math.round((totalOccupied / totalSlots) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center mb-10">
          

          <h1 className="text-4xl font-bold text-gray-900 mb-3 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Parking Management Dashboard
          </h1>
          <p className="text-gray-600 text-lg">Monitor and manage your parking facilities</p>
          <p className="text-sm text-gray-500 mt-2">Managing {parkinglots.length} parking {parkinglots.length === 1 ? 'facility' : 'facilities'}</p>
        </div>

        {/* Overall Statistics */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
            <div className="flex items-center justify-center space-x-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white">Overall Statistics</h2>
            </div>
          </div>
          
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Total Slots Card */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-blue-800">Total Slots</h3>
                </div>
                <p className="text-3xl font-bold text-blue-900">{totalSlots}</p>
              </div>

              {/* Occupied Slots Card */}
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 border border-orange-200">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-orange-800">Occupied</h3>
                </div>
                <p className="text-3xl font-bold text-orange-900">{totalOccupied}</p>
              </div>

              {/* Vacant Slots Card */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-green-800">Available</h3>
                </div>
                <p className="text-3xl font-bold text-green-900">{totalVacant}</p>
              </div>

              {/* Overall Occupancy Rate Card */}
              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl p-6 border border-indigo-200">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-indigo-800">Overall Rate</h3>
                </div>
                <p className="text-3xl font-bold text-indigo-900">{overallOccupancyRate}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Individual Parking Lots */}
        <div className="space-y-6">
                  <div className="space-y-6">
          <div className="flex items-center justify-between">
            {/* Left side - Heading */}
            <h2 className="text-2xl font-bold text-gray-900">Your Parking Facilities</h2>

            {/* Right side - Buttons */}
            <div className="flex items-center gap-4">
              <Link href="/merchant-app/CreateLot">
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200">
                  Create New Lot
                </button>
              </Link>

              <Link href="/merchant-app/Settings">
                <button className="bg-gray-600 hover:bg-gray-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200">
                  ⚙️
                </button>
              </Link>
            </div>
          </div>
        </div>

          {parkinglots.map((parkinglot) => (
            <div key={parkinglot.id} className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">{parkinglot?.Name || "Unnamed Facility"}</h3>
                      <p className="text-purple-100">{parkinglot?.Adress || "No address provided"}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-purple-100">Lot ID</div>
                    <div className="text-xl font-bold text-white">#{parkinglot.id}</div>
                  </div>
                </div>
              </div>
              
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                  
                  {/* Total Slots Card */}
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                      </div>
                      <h4 className="font-semibold text-blue-800">Total Slots</h4>
                    </div>
                    <p className="text-3xl font-bold text-blue-900">{parkinglot?.totalslots ?? "—"}</p>
                  </div>

                  {/* Occupied Slots Card */}
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 border border-orange-200">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h4 className="font-semibold text-orange-800">Occupied</h4>
                    </div>
                    <p className="text-3xl font-bold text-orange-900">{parkinglot?.occupiedslots ?? "—"}</p>
                  </div>

                  {/* Vacant Slots Card */}
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <h4 className="font-semibold text-green-800">Available</h4>
                    </div>
                    <p className="text-3xl font-bold text-green-900">{parkinglot?.vacantslots ?? "—"}</p>
                  </div>

                  {/* Occupancy Rate Card */}
                  <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl p-6 border border-indigo-200">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <h4 className="font-semibold text-indigo-800">Occupancy Rate</h4>
                    </div>
                    <p className="text-3xl font-bold text-indigo-900">
                      {parkinglot?.totalslots && parkinglot?.occupiedslots 
                        ? `${Math.round((parkinglot.occupiedslots / parkinglot.totalslots) * 100)}%`
                        : "—"
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Parkings Section */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
          <div className="bg-gradient-to-r from-slate-700 to-slate-800 p-6">
            <div className="flex items-center justify-center space-x-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white">Recent Parking Activity</h2>
            </div>
          </div>

          <div className="p-8">
            {allParkings.every(({ parkings }) => parkings.length === 0) ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Recent Activity</h3>
                <p className="text-gray-500">No parking records found for any of your facilities.</p>
              </div>
            ) : (
              <div className="space-y-8">
                {allParkings.map(({ lot, parkings }) => (
                  parkings.length > 0 && (
                    <div key={lot.id} className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                        {lot.Name} - Recent Activity
                      </h3>
                      <div className="grid gap-4">
                        {parkings.slice(0, 3).map((parking) => (
                          <div
                            key={parking.id}
                            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                          >
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                  </svg>
                                </div>
                                <div>
                                  <h4 className="text-xl font-bold text-gray-800">#{parking.id}</h4>
                                  <p className="text-sm text-gray-500">Parking Session</p>
                                </div>
                              </div>
                              <div className={`px-4 py-2 rounded-full text-sm font-medium ${
                                parking.status === "Completed"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}>
                                {parking.status}
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                              <div className="bg-gray-50 rounded-xl p-4">
                                <div className="flex items-center space-x-2 mb-2">
                                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                  </svg>
                                  <span className="text-sm font-medium text-gray-600">Vehicle</span>
                                </div>
                                <p className="text-lg font-bold text-gray-800">{parking.carnumber}</p>
                              </div>

                              <div className="bg-gray-50 rounded-xl p-4">
                                <div className="flex items-center space-x-2 mb-2">
                                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  <span className="text-sm font-medium text-gray-600">Start Time</span>
                                </div>
                                <p className="text-lg font-bold text-gray-800">
                                  {new Date(parking.starttime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </p>
                              </div>

                              <div className="bg-gray-50 rounded-xl p-4">
                                <div className="flex items-center space-x-2 mb-2">
                                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  <span className="text-sm font-medium text-gray-600">End Time</span>
                                </div>
                                <p className="text-lg font-bold text-gray-800">
                                  {new Date(parking.endtime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </p>
                              </div>

                              <div className="bg-gray-50 rounded-xl p-4">
                                <div className="flex items-center space-x-2 mb-2">
                                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  <span className="text-sm font-medium text-gray-600">Duration</span>
                                </div>
                                <p className="text-lg font-bold text-gray-800">
                                  {(() => {
                                    const start = new Date(parking.starttime);
                                    const end = new Date(parking.endtime);
                                    const diffMs = end.getTime() - start.getTime();
                                    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
                                    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
                                    return `${diffHrs}h ${diffMins}m`;
                                  })()}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}