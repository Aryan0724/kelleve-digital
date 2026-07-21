"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw, Home } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled Application Error:", error);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 text-center">
      <div className="bg-red-50 dark:bg-red-900/10 text-red-500 rounded-full p-4 mb-6">
        <AlertCircle className="w-12 h-12" />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
        Oops! Something went wrong.
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
        We've encountered an unexpected error while loading this page. Our technical team has been notified.
      </p>
      
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          onClick={() => reset()}
          className="flex items-center gap-2 bg-[#E8701A] hover:bg-[#c25a12] text-white px-6 py-3 rounded-lg font-semibold transition-colors w-full sm:w-auto justify-center"
        >
          <RefreshCw className="w-5 h-5" />
          Try Again
        </button>
        <Link 
          href="/"
          className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-white px-6 py-3 rounded-lg font-semibold transition-colors w-full sm:w-auto justify-center"
        >
          <Home className="w-5 h-5" />
          Go to Homepage
        </Link>
      </div>
    </div>
  );
}
