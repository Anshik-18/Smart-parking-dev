"use client";
import { useEffect, useState } from "react";
// import { Textinput } from "@repo/ui/textinput";
import LocationPicker from "../../../components/locationpicker";

export default function CreateLot() {
  const [name, setname] = useState("");
  const [price, setprice] = useState("");
  const [adress, setadress] = useState("");
  const [totalslots, settotalslots] = useState("");
  const [parkinglotresult, setparkinglotresult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!name.trim()) newErrors.name = "Parking lot name is required";
    if (!price.trim()) newErrors.price = "Price is required";
    if (!adress.trim()) newErrors.adress = "Address is required";
    if (!totalslots.trim()) newErrors.totalslots = "Total slots is required";
    if (latitude === null || longitude === null) newErrors.location = "Please select a location on the map";
    
    // Validate price is a number
    if (price && isNaN(Number(price))) newErrors.price = "Price must be a valid number";
    
    // Validate total slots is a positive integer
    if (totalslots && (isNaN(Number(totalslots)) || Number(totalslots) <= 0 || !Number.isInteger(Number(totalslots)))) {
      newErrors.totalslots = "Total slots must be a positive whole number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  async function createparkinglot() {
    if (!validateForm()) return;

    setIsLoading(true);
    setparkinglotresult(null);

    try {
      const result = await fetch("/api/parkinglot/Createlot", {
        method: "POST",
        body: JSON.stringify({ 
          name: name.trim(), 
          price: Number(price), 
          adress: adress.trim(), 
          totalslots: Number(totalslots), 
          latitude, 
          longitude 
        }),
        headers: { "Content-Type": "application/json" },
      });

      if (!result.ok) {
        throw new Error("Something went wrong");
      }

      const { message } = await result.json();
      setparkinglotresult(message);
      
      // Reset form on success
      setname("");
      setprice("");
      setadress("");
      settotalslots("");
      setLatitude(null);
      setLongitude(null);
      setErrors({});
      
    } catch (err) {
      console.log(err);
      setparkinglotresult("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Create New Parking Lot
            </span>
          </h1>
          <p className="text-gray-600">Set up your parking facility with detailed information</p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/30 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
            <h2 className="text-xl font-semibold text-white text-center">
              Parking Lot Details
            </h2>
          </div>

          <div className="p-8 space-y-6">
            
            {/* Name Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Parking Lot Name
              </label>
              <input
                type="text"
                placeholder="Enter parking lot name"
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 bg-gray-50/50 backdrop-blur-sm focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:bg-white ${
                  errors.name ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-blue-500 hover:border-gray-300'
                }`}
                onChange={(e) => {
                  setname(e.target.value);
                  if (errors.name) setErrors(prev => ({...prev, name: ''}));
                }}
                value={name}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* Price Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hourly Rate (₹)
              </label>
              <input
                type="number"
                placeholder="Enter price per hour"
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 bg-gray-50/50 backdrop-blur-sm focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:bg-white ${
                  errors.price ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-blue-500 hover:border-gray-300'
                }`}
                onChange={(e) => {
                  setprice(e.target.value);
                  if (errors.price) setErrors(prev => ({...prev, price: ''}));
                }}
                value={price}
              />
              {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
            </div>

            {/* Address Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <textarea
                placeholder="Enter complete address"
                rows={3}
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 bg-gray-50/50 backdrop-blur-sm focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:bg-white resize-none ${
                  errors.adress ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-blue-500 hover:border-gray-300'
                }`}
                onChange={(e) => {
                  setadress(e.target.value);
                  if (errors.adress) setErrors(prev => ({...prev, adress: ''}));
                }}
                value={adress}
              />
              {errors.adress && <p className="text-red-500 text-sm mt-1">{errors.adress}</p>}
            </div>

            {/* Total Slots Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Parking Slots
              </label>
              <input
                type="number"
                placeholder="Enter total number of slots"
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 bg-gray-50/50 backdrop-blur-sm focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:bg-white ${
                  errors.totalslots ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-blue-500 hover:border-gray-300'
                }`}
                onChange={(e) => {
                  settotalslots(e.target.value);
                  if (errors.totalslots) setErrors(prev => ({...prev, totalslots: ''}));
                }}
                value={totalslots}
              />
              {errors.totalslots && <p className="text-red-500 text-sm mt-1">{errors.totalslots}</p>}
            </div>

            {/* Location Picker */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location on Map
              </label>
              <div className="border-2 border-gray-200 rounded-xl overflow-hidden bg-gray-50/50 backdrop-blur-sm hover:border-gray-300 transition-colors">
                <LocationPicker
                  onLocationSelect={(lat, lng) => {
                    setLatitude(lat);
                    setLongitude(lng);
                    if (errors.location) setErrors(prev => ({...prev, location: ''}));
                  }}
                />
              </div>
              {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
              {latitude && longitude && (
                <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-700 text-sm">
                    <span className="font-medium">Location selected:</span> {latitude.toFixed(6)}, {longitude.toFixed(6)}
                  </p>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                onClick={createparkinglot}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-lg flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Creating Parking Lot...</span>
                  </>
                ) : (
                  <span>Create Parking Lot</span>
                )}
              </button>
            </div>

            {/* Result Message */}
            {parkinglotresult && (
              <div className={`mt-6 p-4 rounded-xl border-2 ${
                parkinglotresult.includes('wrong') || parkinglotresult.includes('error')
                  ? 'bg-red-50 border-red-200 text-red-800'
                  : 'bg-green-50 border-green-200 text-green-800'
              }`}>
                <span className="font-medium">{parkinglotresult}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}