"use client";
import { useState, useEffect } from 'react';

export default function StatsCards({ stats }: { stats: any }) {
  const [animatedStats, setAnimatedStats] = useState({
    totalBookings: 0,
    availableSlots: 0,
    userRating: 0
  });

  useEffect(() => {
    const duration = 1000;
    const steps = 50;
    const stepTime = duration / steps;

    const animateValue = (start: number, end: number, callback: (value: number) => void) => {
      let current = start;
      const increment = (end - start) / steps;
      
      const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
          current = end;
          clearInterval(timer);
        }
        callback(Math.round(current * 10) / 10);
      }, stepTime);
    };

    animateValue(0, stats.totalBookings, (val) => 
      setAnimatedStats(prev => ({ ...prev, totalBookings: Math.floor(val) }))
    );
    animateValue(0, stats.availableSlots, (val) => 
      setAnimatedStats(prev => ({ ...prev, availableSlots: Math.floor(val) }))
    );
    animateValue(0, stats.userRating, (val) => 
      setAnimatedStats(prev => ({ ...prev, userRating: val }))
    );
  }, [stats]);

  const statCards = [
    {
      icon: "📊",
      label: "Total Bookings",
      value: animatedStats.totalBookings,
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: "🅿️",
      label: "Available Spots",
      value: animatedStats.availableSlots,
      color: "from-emerald-500 to-teal-500"
    },
    {
      icon: "⭐",
      label: "Your Rating",
      value: `${animatedStats.userRating}/5`,
      color: "from-amber-500 to-orange-500"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
      {statCards.map((card, index) => (
        <div
          key={index}
          className="bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 group"
        >
          <div className="text-center">
            <div className="text-4xl mb-3 group-hover:animate-bounce">{card.icon}</div>
            <div className={`text-2xl font-bold bg-gradient-to-r ${card.color} bg-clip-text text-transparent mb-2`}>
              {card.value}
            </div>
            <div className="text-gray-600 font-medium text-sm">{card.label}</div>
          </div>
          <div className={`absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r ${card.color} rounded-b-2xl transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500`}></div>
        </div>
      ))}
    </div>
  );
}