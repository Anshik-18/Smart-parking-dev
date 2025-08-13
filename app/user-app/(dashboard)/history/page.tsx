"use client";

import { useState, useEffect } from "react";
import { Calendar, Clock, MapPin, IndianRupee, Car, Filter, Search, Download, RefreshCw } from "lucide-react";

interface ParkingSlot {
  id: number;
  Name: string;
  Adress: string;
  price: string;
}

interface BookingHistory {
  id: number;
  date: string;
  starttime: string;
  endtime: string;
  totaltime: string;
  carnumber: string;
  status: 'Pre_booked' | 'Completed' | 'Cancelled' | 'Parked';
  parkingslot: ParkingSlot;
}

export default function HistoryPage() {
  const [history, setHistory] = useState<BookingHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortOrder, setSortOrder] = useState("desc");

  // Fetch booking history from API
  const fetchHistory = async () => {
    try {
      setError(null);
      const response = await fetch('/api/history');
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Please log in to view your booking history');
        }
        throw new Error('Failed to fetch booking history');
      }
      
      const data = await response.json();
      setHistory(data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load booking history. Please try again.');
      console.error('Error fetching history:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchHistory();
  }, []);

  // Handle refresh
  const handleRefresh = () => {
    setRefreshing(true);
    fetchHistory();
  };

  // Handle booking actions
  const handleCancelBooking = async (bookingId: number) => {
    try {
      const response = await fetch("/api/booking/cancel", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ bookingId })
                        });

      
      if (response.ok) {
        // Update local state
        setHistory(prev => prev.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status: 'Cancelled' as const }
            : booking
        ));
      } else {
        throw new Error('Failed to cancel booking');
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      // You could add a toast notification here
    }
  };



  // Filter and sort history
  const filteredHistory = history
    .filter(item => {
      const matchesSearch = item.parkingslot.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.parkingslot.Adress.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.carnumber.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterStatus === "all" || item.status === filterStatus;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      const dateA = new Date(a.starttime);
      const dateB = new Date(b.starttime);
      return sortOrder === "desc" ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime();
    });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateTotalCost = (starttime: string, endtime: string, pricePerHour: string) => {
    const start = new Date(starttime);
    const end = new Date(endtime);
    const hours = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60));
    return hours * parseFloat(pricePerHour);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Parked':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Pre_booked':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'Pre_booked':
        return 'Pre-booked';
      case 'Completed':
        return 'Completed';
      case 'Cancelled':
        return 'Cancelled';
      case 'Parked':
        return 'Currently Parked';
      default:
        return status;
    }
  };

  // Calculate stats
  const totalSpent = history
    .filter(item => item.status === 'Completed')
    .reduce((sum, item) => {
      if (item.endtime) {
        return sum + calculateTotalCost(item.starttime, item.endtime, item.parkingslot.price);
      }
      return sum;
    }, 0);

  const totalBookings = history.length;
  const activeBookings = history.filter(item => item.status === 'Parked' || item.status === 'Pre_booked').length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your booking history...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Booking History
              </h1>
              <p className="text-gray-600">
                Track all your parking reservations and activities
              </p>
            </div>
            
            <div className="flex space-x-3">
              <button 
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-xl hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
              <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <Car className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-blue-600 font-medium">Total Bookings</p>
                  <p className="text-2xl font-bold text-blue-800">{totalBookings}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
              <div className="flex items-center space-x-3">
                <div className="bg-green-600 p-2 rounded-lg">
                  <IndianRupee className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-green-600 font-medium">Total Spent</p>
                  <p className="text-2xl font-bold text-green-800">₹{totalSpent.toFixed(0)}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
              <div className="flex items-center space-x-3">
                <div className="bg-purple-600 p-2 rounded-lg">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-purple-600 font-medium">Active Bookings</p>
                  <p className="text-2xl font-bold text-purple-800">{activeBookings}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by parking lot, address, or car number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="Completed">Completed</option>
              <option value="Parked">Currently Parked</option>
              <option value="Pre_booked">Pre-booked</option>
              <option value="Cancelled">Cancelled</option>
            </select>

            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center mb-8">
            <div className="text-red-500 text-xl mb-2">⚠️</div>
            <p className="text-red-700 font-medium">{error}</p>
            <button
              onClick={fetchHistory}
              className="mt-3 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Results */}
        {!loading && !error && filteredHistory.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="mb-6">
              <Calendar className="mx-auto h-24 w-24 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {searchTerm || filterStatus !== "all" ? "No matching bookings found" : "No booking history yet"}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filterStatus !== "all" 
                ? "Try adjusting your search or filters" 
                : "Start booking parking slots to see your history here"
              }
            </p>
            {(!searchTerm && filterStatus === "all") && (
              <button 
                onClick={() => window.location.href = '/user-app/search'}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-colors font-medium"
              >
                Find Parking
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredHistory.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                          {booking.parkingslot.Name}
                        </h3>
                        <div className="flex items-center text-gray-600 mb-2">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span className="text-sm">{booking.parkingslot.Adress}</span>
                        </div>
                        <div className="flex items-center text-gray-600 mb-2">
                          <Car className="w-4 h-4 mr-1" />
                          <span className="text-sm font-medium">{booking.carnumber}</span>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(booking.status)}`}>
                        {getStatusLabel(booking.status)}
                      </span>
                    </div>
                
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center space-x-2 mb-1">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span className="text-xs text-gray-500 font-medium">Start Time</span>
                        </div>
                        <p className="text-sm font-semibold text-gray-900">
                          {formatDate(booking.starttime)}
                        </p>
                      </div>

                      {booking.endtime && booking.status === 'Completed' && (
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="flex items-center space-x-2 mb-1">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <span className="text-xs text-gray-500 font-medium">End Time</span>
                          </div>
                          <p className="text-sm font-semibold text-gray-900">
                            {formatDate(booking.endtime)}
                          </p>
                        </div>
                      )}

                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center space-x-2 mb-1">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span className="text-xs text-gray-500 font-medium">Duration</span>
                        </div>
                        <p className="text-sm font-semibold text-gray-900">
                          {booking.totaltime || 'Ongoing'}
                        </p>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center space-x-2 mb-1">
                          <IndianRupee className="w-4 h-4 text-gray-500" />
                          <span className="text-xs text-gray-500 font-medium">
                            {booking.status === 'Completed' ? 'Total Cost' : 'Rate/Hour'}
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-gray-900">
                          ₹{booking.status === 'Completed' && booking.endtime 
                            ? calculateTotalCost(booking.starttime, booking.endtime, booking.parkingslot.price).toFixed(0)
                            : booking.parkingslot.price
                          }
                        </p>
                      </div>
                    </div>
                  </div>

                  {(booking.status === 'Parked' || booking.status === 'Pre_booked') && (
                    <div className="mt-4 lg:mt-0 lg:ml-6 flex flex-col sm:flex-row gap-2">
                      <button 
                        onClick={() => handleCancelBooking(booking.id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                      >
                        Cancel Booking
                      </button>

                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}