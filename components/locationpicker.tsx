"use client";

import { useLoadScript, GoogleMap, Marker } from "@react-google-maps/api";
import { useState, useRef } from "react";
const containerStyle = {
  width: '100%',
  height: '400px',
};

const defaultCenter = {
  lat: 28.6139,
  lng: 77.2090,
};
const libraries: ("places")[] = ["places"];

export default function LocationPicker({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
 
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: libraries,
  });

  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [markerPosition, setMarkerPosition] = useState(defaultCenter);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handlePlaceSelect() {
    const input = inputRef.current;
    if (!input) return;

    const autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (!place.geometry || !place.geometry.location) return;

      const location = place.geometry.location;
      const lat = location.lat();
      const lng = location.lng();


      setMapCenter({ lat, lng });
      setMarkerPosition({ lat, lng });
      onLocationSelect(lat, lng);
    });
  }

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className="mt-10">
      <input
        ref={inputRef}
        type="text"
        placeholder="Search location"
        onFocus={handlePlaceSelect}
        className="p-2 border rounded w-full mb-2"
      />

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mapCenter}
        zoom={14}
        onClick={(e) => {
          if (e.latLng) {
            const lat = e.latLng.lat();
            const lng = e.latLng.lng();
            setMarkerPosition({ lat, lng });
            onLocationSelect(lat, lng);
          }
        }}
        >
          <Marker
          position={markerPosition}
          draggable={true}
          onDragEnd={(e) => {
     
            if (e.latLng) {
              const lat = e.latLng.lat();
              const lng = e.latLng.lng();
  
              setMarkerPosition({ lat, lng });
              onLocationSelect(lat, lng);
            
            }
          }}
        />
      </GoogleMap>
    </div>
  );
}





