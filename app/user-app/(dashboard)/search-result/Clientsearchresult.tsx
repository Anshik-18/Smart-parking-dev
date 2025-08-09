"use client";

import {  useEffect, useState } from "react";
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from "@react-google-maps/api";
import { useRouter, useSearchParams } from "next/navigation";


const containerStyle = {
  width: "100%",
  height: "350px",
};

type SearchBoxProps = {
  place?: string; // <-- Accept a prop called 'place'
};
export default function SearchResult({place}:SearchBoxProps) {
  const [lat, setLat] = useState(28.6139);  
  const [lng, setLng] = useState(77.2090);

  const router = useRouter();
  const searchParams = useSearchParams();
  useEffect(() => {
    const latParam = searchParams.get("lat");
    const lngParam = searchParams.get("lng");

    if (latParam) setLat(parseFloat(latParam));
    if (lngParam) setLng(parseFloat(lngParam));
  }, [searchParams]);

  const searchText = searchParams.get("search") || "";

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [activeMarker, setActiveMarker] = useState<number | null>(null);
  const [parkingLots, setParkingLots] = useState<any[]>([]);
  const [searchInput, setSearchInput] = useState(searchText);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries: ["places"],
  });

  useEffect(() => {
    async function fetchNearbyParking() {
      const res = await fetch(`/api/nearbyparking?lat=${lat}&lng=${lng}`);
      const data = await res.json();
      console.log(data)
      setParkingLots(data);
    }

    fetchNearbyParking();
  }, [lat, lng]);

  const handleSearch = () => {
    if (!searchInput) return;
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: searchInput }, (results, status) => {
      if (status === "OK" && results && results[0]) {
        const location = results[0].geometry.location;
        router.push(
          `/searchresult?lat=${location.lat()}&lng=${location.lng()}&search=${encodeURIComponent(
            searchInput
          )}`
        );
      } else {
        alert("Location not found!");
      }
    });
  };

  if (!isLoaded) return <p className="text-center py-10 text-gray-600">Loading map...</p>;

  return (
    <div className="space-y-6 px-4 md:px-10 py-6">
      {/* 🔍 Search Box */}
      <div className="max-w-2xl mx-auto flex gap-2">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search for location..."
          className="flex-grow p-3 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
        />
        <button onClick={handleSearch}>Search</button>
      </div>

    <h1 className="text-2xl font-bold text-center text-black">
        Showing results near: {place}
      </h1>
      {/* 🌍 Map Section */}
      <div className="max-w-6xl mx-auto rounded-2xl overflow-hidden shadow border border-gray-200">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={{ lat, lng }}
          zoom={14}
          onLoad={setMap}
          options={{
            disableDefaultUI: true,
            zoomControl: true,
            styles: [
              { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
              { featureType: "transit", elementType: "labels", stylers: [{ visibility: "off" }] },
            ],
          }}
        >
          <Marker
            position={{ lat, lng }}
            icon={{
              url: "/icon/user-location.png",
              scaledSize: new google.maps.Size(40, 40),
            }}
          />

          {parkingLots.map((lot, i) => (
            <Marker
              key={i}
              position={{ lat: lot.lat, lng: lot.lng }}
              icon={{
                url: "/icon/parking-marker.png",
                scaledSize: new google.maps.Size(35, 35),
              }}
              onClick={() => {
                setActiveMarker(i);
                map?.panTo({ lat: lot.lat, lng: lot.lng });
              }}
            >
              {activeMarker === i && (
                <InfoWindow onCloseClick={() => setActiveMarker(null)}>
                  <div className="text-sm">
                    <h3 className="font-bold">{lot.Name}</h3>
                    <p className="text-xs">{lot.Adress}</p>
                    <p>₹{lot.price} · {lot.vacantslots} slots</p>
                  </div>
                </InfoWindow>
              )}
            </Marker>
          ))}
        </GoogleMap>
      </div>

      {/* 🧾 Booking Cards */}
      <div className="max-w-6xl mx-auto">
        {parkingLots.length === 0 ? (
          <div className="text-center py-12 text-gray-600">
            <img
              src="/icon/empty-location.png"
              alt="No results"
              className="mx-auto h-28 mb-4 opacity-80"
            />
            <p className="text-lg font-semibold">No parking lots found nearby.</p>
            <p className="text-sm mt-1">Try searching a different location.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {parkingLots.map((lot, i) => (
              <div
                key={i}
                className={`border rounded-2xl p-5 shadow-sm transition transform hover:scale-[1.02] hover:shadow-lg cursor-pointer ${
                  lot.isempty ? "bg-white border-green-200" : "bg-red-100 border-red-400"
                }`}
              >
                <div className="flex justify-end">
                  <span
                    className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                      lot.isempty
                        ? "bg-green-100 text-green-700"
                        : "bg-red-200 text-red-700"
                    }`}
                  >
                    {lot.isempty ? "Available" : "Full"}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-gray-800 mt-2">{lot.Name}</h2>
                <h4 className="text-md font-medium text-gray-600 mb-2">{lot.Adress}</h4>
                <div className="space-y-1 text-sm text-gray-700">
                  <p><span className="font-medium">Price:</span> ₹{lot.price}</p>
                  <p><span className="font-medium">Vacant Slots:</span> {lot.vacantslots}</p>
                  <p><span className="font-medium">Distance:</span> {lot.distance}</p>
                  <p><span className="font-medium">Time:</span> {lot.duration}</p>
                </div>
                <div className="pt-4">
                  <button onClick={() => router.push(`/user-app/bookparking?lotid=${lot.id}`)}>Book now</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
