"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface GoogleAuthButtonProps {
  text?: string;
  role?: string;
  className?: string;
}

export function GoogleAuthButton({
  text = "Continue with Google",
  role = "customer",
  className = "",
}: GoogleAuthButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = () => {
    setLoading(true);
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://findmyinterior.com/api/v1";
    // Redirect browser to backend Google OAuth initiation endpoint
    window.location.href = `${baseUrl}/auth/google/redirect?role=${encodeURIComponent(role)}`;
  };

  return (
    <Button
      type="button"
      variant="outline"
      disabled={loading}
      onClick={handleGoogleLogin}
      className={`w-full relative flex items-center justify-center gap-3 py-6 text-sm font-medium transition-all duration-200
        bg-white/80 hover:bg-white dark:bg-slate-900/80 dark:hover:bg-slate-800
        border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700
        text-slate-800 dark:text-slate-100 shadow-sm hover:shadow-md active:scale-[0.99]
        backdrop-blur-md rounded-xl ${className}`}
    >
      {loading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin text-slate-500" />
          <span>Redirecting to Google...</span>
        </>
      ) : (
        <>
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-8.97Z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.26v3.15C3.26 21.3 7.37 24 12 24Z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.24A7.198 7.198 0 0 1 4.9 12c0-.78.13-1.54.38-2.24V6.61H1.26A11.933 11.933 0 0 0 0 12c0 1.92.45 3.74 1.26 5.39l4.02-3.15Z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.37 0 3.26 2.7 1.26 6.61l4.02 3.15c.95-2.85 3.6-4.96 6.72-4.96Z"
            />
          </svg>
          <span className="font-semibold">{text}</span>
        </>
      )}
    </Button>
  );
}
