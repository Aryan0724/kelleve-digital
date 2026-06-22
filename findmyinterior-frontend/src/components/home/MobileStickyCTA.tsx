"use client";

import Link from "next/link";
import { useAuthStore } from "@/lib/store/useAuthStore";

export function MobileStickyCTA() {
  const { user } = useAuthStore();
  const isPro = user && user.role !== "customer";

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-50">
      <Link href={isPro ? "/dashboard" : "/post-requirement"}>
        <button className="w-full bg-[#E8701A] hover:bg-[#E8701A]/90 text-white font-bold py-3.5 rounded-lg shadow-md transition text-center">
          {isPro ? "Go to Dashboard" : "Post Requirement (Free)"}
        </button>
      </Link>
    </div>
  );
}
