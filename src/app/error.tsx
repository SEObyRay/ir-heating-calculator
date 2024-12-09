'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Er is iets misgegaan</h2>
        <p className="text-gray-600 mb-6">
          We kunnen de pagina momenteel niet laden. Probeer het opnieuw.
        </p>
        <button
          onClick={reset}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Probeer opnieuw
        </button>
      </div>
    </div>
  );
}
