import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type User = {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  roles?: any[];
  avatar: string | null;
  subscription: any | null;
};

interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  updateUser: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
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
        set({ user: null, token: null });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
