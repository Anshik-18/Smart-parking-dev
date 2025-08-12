"use client";

export default function QuickActions() {
  const actions = [
    {
      icon: "🔍",
      label: "Find Nearby",
      description: "Discover parking spots around you",
      color: "from-blue-500 to-purple-500",
      action: () => console.log("Find nearby clicked")
    },
    {
      icon: "⭐",
      label: "Favorites",
      description: "Your saved parking locations",
      color: "from-pink-500 to-rose-500",
      action: () => console.log("Favorites clicked")
    },
    {
      icon: "📊",
      label: "History",
      description: "View your booking history",
      color: "from-emerald-500 to-teal-500",
      action: () => console.log("History clicked")
    },
    {
      icon: "⚙️",
      label: "Settings",
      description: "Manage your preferences",
      color: "from-gray-500 to-gray-600",
      action: () => console.log("Settings clicked")
    }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Quick Actions</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.action}
            className="bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 group"
          >
            <div className="text-center">
              <div className="text-3xl mb-3 group-hover:animate-pulse">{action.icon}</div>
              <div className={`font-bold mb-1 bg-gradient-to-r ${action.color} bg-clip-text text-transparent`}>
                {action.label}
              </div>
              <div className="text-xs text-gray-600">{action.description}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}