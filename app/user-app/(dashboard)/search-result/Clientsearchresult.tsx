"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from "@react-google-maps/api";
import { useRouter, useSearchParams } from "next/navigation";
import SearchBox from "@/components/search_box";

const containerStyle = {
  width: "100%",
  height: "400px",
};

// Enhanced map styles for better visibility
const mapStyles = [
  { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
  { featureType: "transit", elementType: "labels", stylers: [{ visibility: "off" }] },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#e9e9e9" }, { lightness: 17 }],
  },
  {
    featureType: "landscape", 
    elementType: "geometry",
    stylers: [{ color: "#f5f5f5" }, { lightness: 20 }],
  },
];

type SearchBoxProps = {
  place?: string;
};

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

export default function SearchResult({ place }: SearchBoxProps) {
  const [lat, setLat] = useState(28.6139);
  const [lng, setLng] = useState(77.2090);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [activeMarker, setActiveMarker] = useState<number | null>(null);
  const [parkingLots, setParkingLots] = useState<ParkingLot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries: ["places"],
  });

  // Update coordinates when URL params change
  useEffect(() => {
    const latParam = searchParams.get("lat");
    const lngParam = searchParams.get("lng");

    if (latParam && lngParam) {
      setLat(parseFloat(latParam));
      setLng(parseFloat(lngParam));
    }
  }, [searchParams]);

  // Fetch nearby parking with better error handling and loading states
  const fetchNearbyParking = useCallback(async (latitude: number, longitude: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch(`/api/nearbyparking?lat=${latitude}&lng=${longitude}`);
      
      if (!res.ok) {
        throw new Error('Failed to fetch parking data');
      }
      
      const data = await res.json();
      setParkingLots(data || []);
    } catch (err) {
      setError('Failed to load parking lots. Please try again.');
      console.error('Error fetching parking lots:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (lat && lng) {
      fetchNearbyParking(lat, lng);
    }
  }, [lat, lng, fetchNearbyParking]);

  // Memoize available and full parking lots for better performance
  const { availableLots, fullLots } = useMemo(() => {
    const available = parkingLots.filter(lot => lot.isempty);
    const full = parkingLots.filter(lot => !lot.isempty);
    return { availableLots: available, fullLots: full };
  }, [parkingLots]);

  const handleMarkerClick = useCallback((index: number, lot: ParkingLot) => {
    setActiveMarker(index);
    if (map) {
      map.panTo({ lat: lot.lat, lng: lot.lng });
      map.setZoom(16);
    }
  }, [map]);

  const handleBooking = useCallback((lotId: string) => {
    router.push(`/user-app/bookparking?lotid=${lotId}`);
  }, [router]);

  if (loadError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-2">⚠️</div>
          <p className="text-gray-600">Failed to load Google Maps</p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
          <SearchBox />
          
          {place && (
            <div className="mt-6 text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Parking near {place}
              </h1>
              <div className="flex justify-center items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span>{availableLots.length} Available</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                  <span>{fullLots.length} Full</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-gray-400 rounded-full mr-2"></div>
                  <span>{parkingLots.length} Total</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        {/* Map Section */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8 border">
          <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <h2 className="text-lg font-semibold">Interactive Map</h2>
            <p className="text-sm opacity-90">Click on markers to view parking details</p>
          </div>
          
          <div className="relative">
            {loading && (
              <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                  <p className="text-sm text-gray-600">Loading parking spots...</p>
                </div>
              </div>
            )}
            
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={{ lat, lng }}
              zoom={14}
              onLoad={setMap}
              options={{
                disableDefaultUI: true,
                zoomControl: true,
                mapTypeControl: true,
                scaleControl: true,
                streetViewControl: false,
                rotateControl: false,
                fullscreenControl: true,
                styles: mapStyles,
              }}
            >
              {/* User Location Marker */}
              <Marker
                position={{ lat, lng }}
                icon={{
                  url: "/icon/user-location.png",
                  scaledSize: new google.maps.Size(45, 45),
                }}
                title="Your Location"
              />

              {/* Parking Lot Markers */}
              {parkingLots.map((lot, i) => (
                <Marker
                  key={`${lot.id}-${i}`}
                  position={{ lat: lot.lat, lng: lot.lng }}
                  icon={{
                    url: lot.isempty ? "/icon/parking-marker.png" : "/icon/parking-full.png",
                    scaledSize: new google.maps.Size(35, 35),
                  }}
                  onClick={() => handleMarkerClick(i, lot)}
                  title={lot.Name}
                >
                  {activeMarker === i && (
                    <InfoWindow onCloseClick={() => setActiveMarker(null)}>
                      <div className="max-w-xs">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-gray-900 text-sm">{lot.Name}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            lot.isempty 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {lot.isempty ? 'Available' : 'Full'}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mb-2">{lot.Adress}</p>
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span>Price:</span>
                            <span className="font-medium">₹{lot.price}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Available:</span>
                            <span className="font-medium">{lot.vacantslots} slots</span>
                          </div>
                          {lot.distance && (
                            <div className="flex justify-between">
                              <span>Distance:</span>
                              <span className="font-medium">{lot.distance}</span>
                            </div>
                          )}
                        </div>
                        {lot.isempty && (
                          <button
                            onClick={() => handleBooking(lot.id)}
                            className="w-full mt-3 bg-blue-600 text-white text-xs py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            Book Now
                          </button>
                        )}
                      </div>
                    </InfoWindow>
                  )}
                </Marker>
              ))}
            </GoogleMap>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
              <div className="text-red-500 text-xl mb-2">⚠️</div>
              <p className="text-red-700 font-medium">{error}</p>
              <button
                onClick={() => fetchNearbyParking(lat, lng)}
                className="mt-3 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
              >
                Try Again
              </button>
            </div>
          )}

          {!loading && !error && parkingLots.length === 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <div className="mb-6">
                <img
                  src="/icon/empty-location.png"
                  alt="No results"
                  className="mx-auto h-32 opacity-60"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                No parking lots found nearby
              </h3>
              <p className="text-gray-600 mb-6">
                Try searching a different location or expand your search radius.
              </p>
              <button
                onClick={() => fetchNearbyParking(lat, lng)}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-medium"
              >
                Search Again
              </button>
            </div>
          )}

          {parkingLots.length > 0 && (
            <>
              {/* Available Parking Lots */}
              {availableLots.length > 0 && (
                <div>
                  <div className="flex items-center mb-4">
                    <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Available Parking ({availableLots.length})
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {availableLots.map((lot, i) => (
                      <ParkingCard
                        key={`available-${lot.id}-${i}`}
                        lot={lot}
                        onBook={handleBooking}
                        available={true}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Full Parking Lots */}
              {fullLots.length > 0 && (
                <div>
                  <div className="flex items-center mb-4">
                    <div className="w-4 h-4 bg-red-500 rounded-full mr-3"></div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Currently Full ({fullLots.length})
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {fullLots.map((lot, i) => (
                      <ParkingCard
                        key={`full-${lot.id}-${i}`}
                        lot={lot}
                        onBook={handleBooking}
                        available={false}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Separate component for parking cards to improve performance
interface ParkingCardProps {
  lot: ParkingLot;
  onBook: (lotId: string) => void;
  available: boolean;
}

function ParkingCard({ lot, onBook, available }: ParkingCardProps) {
  return (
    <div className={`bg-white border-2 rounded-2xl p-6 shadow-lg transition-all duration-200 hover:scale-[1.02] hover:shadow-xl ${
      available 
        ? 'border-green-200 hover:border-green-300' 
        : 'border-red-200 hover:border-red-300 opacity-75'
    }`}>
      {/* Header with status */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-1">{lot.Name}</h3>
          <p className="text-sm text-gray-600 line-clamp-2">{lot.Adress}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-bold flex-shrink-0 ${
          available 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {available ? 'Available' : 'Full'}
        </span>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-xs text-gray-500 mb-1">Price per hour</div>
          <div className="text-lg font-bold text-gray-900">₹{lot.price}</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-xs text-gray-500 mb-1">Available slots</div>
          <div className="text-lg font-bold text-gray-900">{lot.vacantslots}</div>
        </div>
        {lot.distance && (
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-xs text-gray-500 mb-1">Distance</div>
            <div className="text-sm font-medium text-gray-900">{lot.distance}</div>
          </div>
        )}
        {lot.duration && (
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-xs text-gray-500 mb-1">Travel time</div>
            <div className="text-sm font-medium text-gray-900">{lot.duration}</div>
          </div>
        )}
      </div>

      {/* Action Button */}
      <button
        onClick={() => onBook(lot.id)}
        disabled={!available}
        className={`w-full py-3 px-4 rounded-xl font-semibold transition-colors ${
          available
            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transform hover:scale-105'
            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
        }`}
      >
        {available ? 'Book Now' : 'Currently Full'}
      </button>
    </div>
  );
}