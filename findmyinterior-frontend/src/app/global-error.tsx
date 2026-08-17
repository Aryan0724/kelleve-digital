"use client";

import { useEffect } from "react";
import { AlertCircle, RefreshCw, Home } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Critical Global Application Error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center bg-white dark:bg-slate-950 font-sans">
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-full p-6 mb-8 shadow-sm">
            <AlertCircle className="w-16 h-16" />
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
            System Unavailable
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-10 max-w-lg mx-auto">
            We've encountered a critical system error. Don't worry, your data is safe and our engineering team has been notified.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <button
              onClick={() => reset()}
              className="flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 rounded-xl font-bold transition-all w-full sm:w-auto shadow-lg shadow-amber-500/30 active:scale-95"
            >
              <RefreshCw className="w-5 h-5" />
              Reload Application
            </button>
            <a 
              href="/"
              className="flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white px-8 py-4 rounded-xl font-bold transition-all w-full sm:w-auto active:scale-95"
            >
              <Home className="w-5 h-5" />
              Go to Homepage
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
