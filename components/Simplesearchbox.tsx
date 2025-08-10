
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface SimpleSearchBoxProps {
  onSearch?: (query: string) => void;
  className?: string;
  placeholder?: string;
}

export default function SimpleSearchBox({ 
  onSearch, 
  className = "", 
  placeholder = "Search for parking near..." 
}: SimpleSearchBoxProps) {
  const [input, setInput] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!input.trim()) {
      alert("Please enter a location to search");
      return;
    }

    setIsSearching(true);

    try {
      // Simple navigation to search results - let the search result page handle geocoding
      const searchQuery = encodeURIComponent(input.trim());
      router.push(`/user-app/search-result?search=${searchQuery}&q=${searchQuery}`);
      
      // Call parent callback if provided
      if (onSearch) {
        onSearch(input.trim());
      }
    } catch (error) {
      console.error("Search error:", error);
      alert("Search failed. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  const clearSearch = () => {
    setInput("");
  };

  return (
    <div className={`relative max-w-2xl mx-auto ${className}`}>
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <input
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
            type="submit"
            disabled={!input.trim() || isSearching}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-600 to-purple-600 
                       text-white px-4 py-2 rounded-xl font-medium transition-all duration-200
                       hover:from-blue-700 hover:to-purple-700 hover:scale-105
                       disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed disabled:scale-100
                       focus:outline-none focus:ring-2 focus:ring-blue-300"
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
      </form>

      {/* Popular Locations */}
      {input.length === 0 && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500 mb-3">Popular locations:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {['Connaught Place', 'India Gate', 'Red Fort', 'Karol Bagh', 'Lajpat Nagar'].map((location) => (
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
