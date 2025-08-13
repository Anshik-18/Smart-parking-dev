
"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Autocomplete, useLoadScript } from "@react-google-maps/api";
import SimpleSearchBox from "./Simplesearchbox";
import { useGoogleMaps } from "@/hooks/useGoogleMaps";
const libraries: ("places")[] = ["places"];

interface SearchBoxProps {
  onSearch?: (place: string, lat: number, lng: number) => void;
  className?: string;
  placeholder?: string;
  initialValue?: string;
}

export default function SearchBox({ 
  onSearch, 
  className = "", 
  placeholder = "Search for parking near...",
  initialValue = ""
}: SearchBoxProps) {
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const [input, setInput] = useState(initialValue);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const router = useRouter();
  const searchParams = useSearchParams();

  // Load Google Maps script with error handling
const { isLoaded, loadError } = useGoogleMaps();

  // Initialize input value from URL params
  useEffect(() => {
    const searchQuery = searchParams.get("search") || searchParams.get("place") || "";
    if (searchQuery && !initialValue) {
      setInput(decodeURIComponent(searchQuery));
    }
  }, [searchParams, initialValue]);

  const onLoad = useCallback((auto: google.maps.places.Autocomplete) => {
    try {
      auto.setOptions({
        types: ['establishment', 'geocode'],
        componentRestrictions: { country: 'in' },
        fields: ['formatted_address', 'geometry', 'name', 'place_id', 'types']
      });
      setAutocomplete(auto);
    } catch (error) {
      console.error("Error configuring autocomplete:", error);
    }
  }, []);

  const handlePlaceSelect = useCallback(async () => {
    if (!autocomplete) return;

    setIsSearching(true);
    
    try {
      const place = autocomplete.getPlace();
      
      if (!place.geometry?.location) {
        alert("Please select a valid location from the suggestions");
        return;
      }

      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      const name = place.formatted_address || place.name || input;

      setInput(name);

      if (onSearch) {
        onSearch(name, lat, lng);
      } else {
        router.push(`/user-app/search-result?lat=${lat}&lng=${lng}&search=${encodeURIComponent(name)}&place=${encodeURIComponent(name)}`);
      }
    } catch (error) {
      console.error("Error selecting place:", error);
      handleManualSearch();
    } finally {
      setIsSearching(false);
    }
  }, [autocomplete, input, onSearch, router]);

  const handleManualSearch = useCallback(() => {
    if (!input.trim()) return;

    setIsSearching(true);
    
    // If Google Maps is not loaded, do simple navigation
    if (!isLoaded || loadError) {
      const searchQuery = encodeURIComponent(input.trim());
      router.push(`/user-app/search-result?search=${searchQuery}&q=${searchQuery}`);
      setIsSearching(false);
      return;
    }

    // Try geocoding if Google Maps is available
    if (window.google && window.google.maps) {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ 
        address: input,
        componentRestrictions: { country: 'IN' }
      }, (results, status) => {
        setIsSearching(false);
        
        if (status === "OK" && results && results[0]) {
          const location = results[0].geometry.location;
          const name = results[0].formatted_address;
          
          if (onSearch) {
            onSearch(name, location.lat(), location.lng());
          } else {
            router.push(`/user-app/search-result?lat=${location.lat()}&lng=${location.lng()}&search=${encodeURIComponent(input)}&place=${encodeURIComponent(name)}`);
          }
        } else {
          // Fallback to simple search
          const searchQuery = encodeURIComponent(input.trim());
          router.push(`/user-app/search-result?search=${searchQuery}&q=${searchQuery}`);
        }
      });
    } else {
      // Fallback if geocoder is not available
      const searchQuery = encodeURIComponent(input.trim());
      router.push(`/user-app/search-result?search=${searchQuery}&q=${searchQuery}`);
      setIsSearching(false);
    }
  }, [input, onSearch, router, isLoaded, loadError]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (isLoaded && !loadError && autocomplete) {
        setTimeout(handlePlaceSelect, 100);
      } else {
        handleManualSearch();
      }
    }
  }, [autocomplete, handlePlaceSelect, handleManualSearch, isLoaded, loadError]);

  const clearSearch = useCallback(() => {
    setInput("");
    inputRef.current?.focus();
  }, []);

  // Show error state
  if (loadError) {
    console.error("Google Maps failed to load:", loadError);
    // Fallback to simple search box
    return (
      <SimpleSearchBox 
        onSearch={onSearch ? (query) => onSearch(query, 0, 0) : undefined}
        className={className}
        placeholder={placeholder}
      />
    );
  }

  // Show loading state
  if (!isLoaded) {
    return (
      <div className={`relative max-w-2xl mx-auto ${className}`}>
        <div className="relative">
          <input
            type="text"
            placeholder="Loading search..."
            disabled
            className="w-full pl-12 pr-24 py-4 rounded-2xl border-2 border-gray-200 shadow-lg text-lg text-gray-400 bg-gray-100"
          />
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative max-w-2xl mx-auto ${className}`}>
      <div className="relative">
        <Autocomplete
          onLoad={onLoad}
          onPlaceChanged={handlePlaceSelect}
          options={{
            types: ['establishment', 'geocode'],
            componentRestrictions: { country: 'in' }
          }}
        >
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={placeholder}
              disabled={isSearching}
              className={`w-full pl-12 pr-24 py-4 rounded-2xl border-2 border-gray-200 shadow-lg text-lg text-gray-800 
                         placeholder-gray-500 transition-all duration-200 ease-in-out
                         focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500
                         hover:border-gray-300 hover:shadow-xl
                         disabled:bg-gray-100 disabled:cursor-not-allowed ${
                           isSearching ? 'animate-pulse' : ''
                         }`}
            />
            
            {/* Search Icon */}
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
              {isSearching ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
              ) : (
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              )}
            </div>

            {/* Clear Button */}
            {input && !isSearching && (
              <button
                onClick={clearSearch}
                className="absolute right-16 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-gray-200 transition-colors"
                type="button"
              >
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}

            {/* Search Button */}
            <button
              onClick={handleManualSearch}
              disabled={!input.trim() || isSearching}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-600 to-purple-600 
                         text-white px-4 py-2 rounded-xl font-medium transition-all duration-200
                         hover:from-blue-700 hover:to-purple-700 hover:scale-105
                         disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed disabled:scale-100
                         focus:outline-none focus:ring-2 focus:ring-blue-300"
              type="button"
            >
              {isSearching ? (
                <div className="flex items-center space-x-1">
                  <div className="animate-spin rounded-full h-3 w-3 border border-white border-t-transparent"></div>
                </div>
              ) : (
                "Search"
              )}
            </button>
          </div>
        </Autocomplete>
      </div>

      {/* Popular Locations */}
      {input.length === 0 && (
        <div className="mt-2 text-center">
          <div className="flex flex-wrap justify-center gap-2 mt-3">
            {['Connaught Place', 'India Gate', 'Red Fort', 'Karol Bagh'].map((location) => (
              <button
                key={location}
                onClick={() => setInput(location)}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
              >
                {location}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
