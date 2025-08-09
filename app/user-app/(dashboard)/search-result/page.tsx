// app/search-result/page.tsx

import ClientSearchResult from "./Clientsearchresult";

export default function SearchResultPage({ searchParams }: { searchParams: any }) {
  const lat = parseFloat(searchParams.lat || "28.6139");
  const lng = parseFloat(searchParams.lng || "77.2090");
  const place = decodeURIComponent(searchParams.place || "Selected Location");

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-6 space-y-6">

      <ClientSearchResult place={(place)} />
    
    </div>
  );
}
