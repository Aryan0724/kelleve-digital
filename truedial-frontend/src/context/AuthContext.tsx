"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  avatar: string | null;
  role: string;
  roles?: string[];
  categories?: string[];
  verification_level?: string;
  is_active?: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  role: string | null;
  /** Fetch user from server using cookie token. Called automatically on mount. */
  refreshUser: () => Promise<void>;
  /** Clear local state. Actual cookie deletion happens via server action. */
  clearUser: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isLoggedIn: false,
  role: null,
  refreshUser: async () => {},
  clearUser: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    setIsLoading(true);
    try {
      // Call our internal Next.js API route that reads the httpOnly cookie
      // and fetches user data from the Laravel backend
      const res = await fetch("/api/auth/me", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearUser = useCallback(() => {
    setUser(null);
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const role = user?.role || user?.roles?.[0] || null;

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isLoggedIn: !!user,
        role,
        refreshUser,
        clearUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
