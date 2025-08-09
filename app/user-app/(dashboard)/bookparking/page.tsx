import { Suspense } from 'react';
import BookparkingContent from './BookparkingContent';

export default function BookparkingPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <p className="text-lg font-medium text-gray-600 animate-pulse">
          Loading parking lot details...
        </p>
      </div>
    }>
      <BookparkingContent />
    </Suspense>
  );
}
