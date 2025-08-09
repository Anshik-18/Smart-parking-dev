"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
interface LotDetails {
  Name: string;
  price: number;
  Adress: string;
  vacantslots: number;
}

export default function Bookparking() {
  const searchparams = useSearchParams();
  const [parking_lot_id, setParkingLotId] = useState<string | null>(null);
  const [lotdetails, setLotDetails] = useState<LotDetails | null>(null);
  const [carnumber, setCarnumber] = useState("");
  const [result_status, setResultStatus] = useState<boolean | null>(null);
  const [result_message, setResultMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(15 * 60);
  const totalTime = 15 * 60; // 15 minutes

  useEffect(() => {
    const parking_lot_id = searchparams.get("lotid");
    setParkingLotId(parking_lot_id);
  }, [searchparams]);

  function formatTime(seconds: number) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }

  useEffect(() => {
    async function fetchlot() {
      if (!parking_lot_id) return;
      const res = await fetch(`/api/parkinglot/check_full/${parking_lot_id}`);
      if (res.ok) {
        const data = await res.json();
        setLotDetails(data);
      } else {
        console.error("Error fetching lot");
      }
      setLoading(false);
    }
    fetchlot();
  }, [parking_lot_id]);

  async function onsubmit() {
    try {
      const result = await fetch("/api/booking/create", {
        method: "POST",
        body: JSON.stringify({ carnumber, parking_lot_id }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await result.json();
      if (!result.ok) {
        setResultStatus(false);
        setResultMessage(data.message || "Something went wrong");
      } else {
        setResultStatus(true);
        setResultMessage(data.message || "Successfully booked parking slot");
        setTimeLeft(totalTime);
      }
    } catch (e) {
      console.log(e);
      setResultStatus(false);
      setResultMessage("Something went wrong");
    }
  }

  useEffect(() => {
    if (result_status === true) {
      const interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [result_status]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <p className="text-lg font-medium text-gray-600 animate-pulse">
          Loading parking lot details...
        </p>
      </div>
    );
  }

  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const progress = ((totalTime - timeLeft) / totalTime) * circumference;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/40">
        {result_status === null ? (
          <>
            <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">
              Book Your Parking Slot
            </h2>

            <div className="mb-6 bg-gray-50 rounded-xl p-4 shadow-sm border border-gray-100">
              <h1 className="text-xl font-semibold text-gray-800">{lotdetails?.Name}</h1>
              <p className="text-gray-600">💰 Price: ₹{lotdetails?.price}</p>
              <p className="text-gray-600">📍 Address: {lotdetails?.Adress}</p>
              <p className="text-gray-600">🚗 Available Slots: {lotdetails?.vacantslots}</p>
            </div>

            <input
              type="text"
              placeholder="Enter your car number"
              className="w-full p-3 mb-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
              value={carnumber}
              onChange={(e) => setCarnumber(e.target.value)}
            />

            <button
              onClick={onsubmit}
              disabled={!carnumber}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Book the Slot
            </button>
          </>
        ) : (
          <div
            className={`p-6 rounded-xl text-center font-medium transition-all duration-300 ${
              result_status
                ? "bg-green-50 border border-green-200 text-green-800"
                : "bg-red-50 border border-red-200 text-red-800"
            }`}
          >
            <p className="text-lg mb-6">{result_message}</p>

            {result_status && (
              <div className="flex flex-col items-center">
                <div className="relative w-32 h-32">
                  <svg className="transform -rotate-90 w-32 h-32">
                    <circle
                      cx="64"
                      cy="64"
                      r={radius}
                      stroke="currentColor"
                      strokeWidth="8"
                      className="text-gray-200"
                      fill="transparent"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r={radius}
                      stroke="url(#gradient)"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={circumference}
                      strokeDashoffset={progress}
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-linear"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#6366f1" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center font-bold text-xl text-blue-700">
                    {formatTime(timeLeft)}
                  </div>
                </div>
                <p className="mt-4 text-gray-700">
                  Please reach within the given time to confirm your spot.
                </p>
              </div>
            )}

            <button
              className="mt-6 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow hover:shadow-lg transition"
              onClick={() => {
                setResultStatus(null);
                setResultMessage("");
                setCarnumber("");
              }}
            >
              Book Another
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
