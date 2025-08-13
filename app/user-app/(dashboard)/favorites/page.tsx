"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Heart, HeartOff, MapPin, Clock, IndianRupee, Car, RefreshCw } from "lucide-react";

interface ParkingLot {
  id: string;
  Name: string;
  Adress: string;
  price: number;
  vacantslots: number;
  isempty: boolean;
  lat: number;
  lng: number;
  distance?: string;
  duration?: string;
}

export default function FavoritesPage() {
  const [favoriteLots, setFavoriteLots] = useState<ParkingLot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favoriteLoading, setFavoriteLoading] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const router = useRouter();

  // Fetch favorite parking lots
  const fetchFavorites = useCallback(async () => {
    try {
      setError(null);
      const response = await fetch('/api/favorites/getlots');
      
      if (!response.ok) {
        if (response.status === 401) {
          router.push('/auth/signin');
          return;
        }
        throw new Error('Failed to fetch favorites');
      }
      
      const data = await response.json();
      console.log('Fetched favorites:', data);
      setFavoriteLots(data || []);
    } catch (err) {
      setError('Failed to load your favorite parking lots. Please try again.');
      console.error('Error fetching favorites:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [router]);

  // Initial load
  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  // Handle removing from favorites
  const toggleFavorite = useCallback(async (lotId: string) => {
    setFavoriteLoading(lotId);
    
    try {
      const response = await fetch('/api/favorites', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ lotId }),
      });

      if (response.ok) {
        // Remove from local state
        setFavoriteLots(prev => prev.filter(lot => lot.id !== lotId));
      } else {
        throw new Error('Failed to remove from favorites');
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
      // You could add a toast notification here
    } finally {
      setFavoriteLoading(null);
    }
  }, []);

  // Handle booking
  const handleBooking = useCallback((lotId: string) => {
    router.push(`/user-app/bookparking?lotid=${lotId}`);
  }, [router]);

  // Handle refresh
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchFavorites();
  }, [fetchFavorites]);

  // Separate available and full lots

      const availableLots = favoriteLots.filter(lot => lot.isempty);
      const fullLots = favoriteLots.filter(lot => !lot.isempty);
  

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your favorite parking lots...</p>
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                My Favorite Parking Lots
              </h1>
              <p className="text-gray-600">
                Quick access to your saved parking locations
              </p>
            </div>
            
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
          
          {favoriteLots.length > 0 && (
            <div className="mt-6 flex justify-center items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span>{availableLots.length} Available</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                <span>{fullLots.length} Full</span>
              </div>
              <div className="flex items-center">
                <Heart className="w-3 h-3 text-red-500 fill-current mr-2" />
                <span>{favoriteLots.length} Favorites</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center mb-8">
            <div className="text-red-500 text-xl mb-2">⚠️</div>
            <p className="text-red-700 font-medium">{error}</p>
            <button
              onClick={fetchFavorites}
              className="mt-3 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && favoriteLots.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="mb-6">
              <Heart className="mx-auto h-24 w-24 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              No favorite parking lots yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start adding parking lots to your favorites for quick access later.
            </p>
            <button
              onClick={() => router.push('/user-app/search')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-colors font-medium"
            >
              Find Parking Lots
            </button>
          </div>
        )}

        {/* Results Section */}
        {favoriteLots.length > 0 && (
          <div className="space-y-8">
            {/* Available Parking Lots */}
            {availableLots.length > 0 && (
              <div>
                <div className="flex items-center mb-6">
                  <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Available Now ({availableLots.length})
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {availableLots.map((lot, i) => (
                    <ParkingCard
                      key={`available-${lot.id}-${i}`}
                      lot={lot}
                      onBook={handleBooking}
                      onToggleFavorite={toggleFavorite}
                      isFavorite={true}
                      favoriteLoading={favoriteLoading === lot.id}
                      available={true}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Full Parking Lots */}
            {fullLots.length > 0 && (
              <div>
                <div className="flex items-center mb-6">
                  <div className="w-4 h-4 bg-red-500 rounded-full mr-3"></div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Currently Full ({fullLots.length})
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {fullLots.map((lot, i) => (
                    <ParkingCard
                      key={`full-${lot.id}-${i}`}
                      lot={lot}
                      onBook={handleBooking}
                      onToggleFavorite={toggleFavorite}
                      isFavorite={true}
                      favoriteLoading={favoriteLoading === lot.id}
                      available={false}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Enhanced parking card component
interface ParkingCardProps {
  lot: ParkingLot;
  onBook: (lotId: string) => void;
  onToggleFavorite: (lotId: string) => void;
  isFavorite: boolean;
  favoriteLoading: boolean;
  available: boolean;
}

function ParkingCard({ lot, onBook, onToggleFavorite, isFavorite, favoriteLoading, available }: ParkingCardProps) {
  return (
    <div className={`bg-white border-2 rounded-2xl p-6 shadow-lg transition-all duration-200 hover:scale-[1.02] hover:shadow-xl ${
      available 
        ? 'border-green-200 hover:border-green-300' 
        : 'border-red-200 hover:border-red-300 opacity-75'
    }`}>
      {/* Header with status and favorite button */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1 pr-2">
          <h3 className="text-xl font-bold text-gray-900 mb-1">{lot.Name}</h3>
          <div className="flex items-start space-x-1 text-sm text-gray-600">
            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <p className="line-clamp-2">{lot.Adress}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 flex-shrink-0">
          <button
            onClick={() => onToggleFavorite(lot.id)}
            disabled={favoriteLoading}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            title="Remove from favorites"
          >
            {favoriteLoading ? (
              <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Heart className="w-5 h-5 text-red-500 fill-current hover:text-red-600" />
            )}
          </button>
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
            available 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {available ? 'Available' : 'Full'}
          </span>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 border border-blue-200">
          <div className="flex items-center space-x-2 mb-1">
            <IndianRupee className="w-3 h-3 text-blue-600" />
            <div className="text-xs text-blue-600 font-medium">Price per hour</div>
          </div>
          <div className="text-lg font-bold text-blue-800">₹{lot.price}</div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3 border border-green-200">
          <div className="flex items-center space-x-2 mb-1">
            <Car className="w-3 h-3 text-green-600" />
            <div className="text-xs text-green-600 font-medium">Available slots</div>
          </div>
          <div className="text-lg font-bold text-green-800">{lot.vacantslots}</div>
        </div>
        {lot.distance && (
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-3 border border-purple-200">
            <div className="flex items-center space-x-2 mb-1">
              <MapPin className="w-3 h-3 text-purple-600" />
              <div className="text-xs text-purple-600 font-medium">Distance</div>
            </div>
            <div className="text-sm font-bold text-purple-800">{lot.distance}</div>
          </div>
        )}
        {lot.duration && (
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-3 border border-orange-200">
            <div className="flex items-center space-x-2 mb-1">
              <Clock className="w-3 h-3 text-orange-600" />
              <div className="text-xs text-orange-600 font-medium">Travel time</div>
            </div>
            <div className="text-sm font-bold text-orange-800">{lot.duration}</div>
          </div>
        )}
      </div>

      {/* Action Button */}
      <button
        onClick={() => onBook(lot.id)}
        disabled={!available}
        className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200 ${
          available
            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 shadow-lg hover:shadow-xl'
            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
        }`}
      >
        {available ? 'Book Now' : 'Currently Full'}
      </button>
    </div>
  );
}