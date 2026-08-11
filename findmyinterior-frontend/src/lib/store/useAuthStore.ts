import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type User = {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  professional_type?: string;
  roles?: any[];
  avatar: string | null;
  subscription: any | null;
  verification_level?: string;
  is_verified_business?: boolean;
  trust_score?: number;
  profile_completion_score?: number;
  isAdmin?: boolean;
  city?: string | null;
  district?: string | null;
  wallet_balance?: number;
  address?: string | null;
  cover_image?: string | null;
};

interface AuthState {
  user: User | null;
  token: string | null;
  activeVenture: any | null;
  setActiveVenture: (venture: any | null) => void;
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
  setAuth: (user: User, token: string) => void;
  updateUser: (user: User) => void;
  logout: () => void;
  showLoginModal: boolean;
  loginRedirectUrl: string | null;
  setShowLoginModal: (show: boolean, redirectUrl?: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      activeVenture: null,
      setActiveVenture: (venture) => set({ activeVenture: venture }),
      _hasHydrated: false,
      setHasHydrated: (state) => set({ _hasHydrated: state }),
      showLoginModal: false,
      loginRedirectUrl: null,
      setShowLoginModal: (show, redirectUrl) => set({ showLoginModal: show, loginRedirectUrl: redirectUrl || null }),
      setAuth: (user, token) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth_token', token);
        }
        set({ user, token });
      },
      updateUser: (user) => set({ user }),
      logout: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_token');
        }
        set({ user: null, token: null, activeVenture: null });
      },
    }),
    {
      name: 'auth-storage',
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      }
    }
  )
);
