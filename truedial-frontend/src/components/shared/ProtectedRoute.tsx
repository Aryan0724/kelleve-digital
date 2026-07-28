"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  /** Roles allowed to access this route. If empty, any logged-in user can access. */
  allowedRoles?: string[];
  /** Where to redirect if not logged in. Defaults to /login */
  loginRedirect?: string;
  /** Where to redirect if logged in but wrong role. Defaults to /dashboard/user */
  forbiddenRedirect?: string;
}

/**
 * Wrap dashboard pages with this component to enforce authentication
 * and role-based access control.
 * 
 * Usage:
 *   <ProtectedRoute allowedRoles={["business", "admin"]}>
 *     <BusinessDashboard />
 *   </ProtectedRoute>
 */
export default function ProtectedRoute({
  children,
  allowedRoles = [],
  loginRedirect = "/login",
  forbiddenRedirect = "/dashboard/user",
}: ProtectedRouteProps) {
  const { user, isLoading, isLoggedIn, role } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return; // Still fetching user data

    if (!isLoggedIn) {
      // Not logged in → redirect to login with return URL
      router.replace(`${loginRedirect}?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    if (allowedRoles.length > 0 && role && !allowedRoles.includes(role)) {
      // Logged in but wrong role → redirect
      router.replace(forbiddenRedirect);
      return;
    }
  }, [isLoading, isLoggedIn, role, allowedRoles, router, pathname, loginRedirect, forbiddenRedirect]);

  // Loading state with premium skeleton
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-sm font-medium text-muted-foreground animate-pulse">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  // Not authorized — show nothing while redirecting
  if (!isLoggedIn) return null;
  if (allowedRoles.length > 0 && role && !allowedRoles.includes(role)) return null;

  return <>{children}</>;
}
