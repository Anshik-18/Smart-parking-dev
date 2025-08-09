"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Autocomplete, useLoadScript } from "@react-google-maps/api";

const libraries = ["places"];

export default function SearchBox() {
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const [input, setInput] = useState("");
  const router = useRouter();

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries: libraries as any,
  });

  if (!isLoaded) return <div>Loading...</div>;
  if (loadError) return <div>Error loading Google Maps</div>;

  const onLoad = (auto: google.maps.places.Autocomplete) => {
    setAutocomplete(auto);
  };

  const onPlaceChanged = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      const lat = place.geometry?.location?.lat();
      const lng = place.geometry?.location?.lng();
      const name = place.formatted_address;

      if (lat && lng) {
        router.push(`/user-app/search-result?lat=${lat}&lng=${lng}&place=${encodeURIComponent(name || "")}`);
      }
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Search for a location..."
          className="w-full p-4 rounded-xl border border-gray-300 shadow-md text-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </Autocomplete>
    </div>
  );
}
