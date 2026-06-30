"use client";

import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { Button } from "@/components/ui/button";

export function UnverifiedBanner({ onVerifyClick, hasPendingVerification }: { onVerifyClick: () => void, hasPendingVerification?: boolean }) {
  const { user } = useAuthStore();

  if (!user) return null;

  const isVerified = ["verified_business", "trusted_professional", "elite_professional", "site_verified"].includes(user.verification_level || "");

  if (isVerified || hasPendingVerification) return null;

  return (
    <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-900 mb-6 flex flex-col md:flex-row items-center justify-between">
      <div className="flex items-center gap-3">
        <AlertTriangle className="h-5 w-5 text-red-600" />
        <div>
          <AlertTitle className="font-bold text-red-800">Boost Your Profile: Business Verification</AlertTitle>
          <AlertDescription className="text-red-700">
            Your profile is currently unverified. While you have full access to all features, verifying your business will give you a Trust Badge and significantly boost your ranking in search results!
          </AlertDescription>
        </div>
      </div>
      <Button 
        variant="destructive" 
        size="sm" 
        className="mt-4 md:mt-0 whitespace-nowrap bg-red-600 hover:bg-red-700 text-white"
        onClick={onVerifyClick}
      >
        Verify Now
      </Button>
    </Alert>
  );
}
