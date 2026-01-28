import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/api-client';

interface User {
  email: string;
  name?: string;
  role?: string;
  avatarUrl?: string; // Optional avatar
  isGithubConnected?: boolean;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  _hasHydrated: boolean;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
  fetchUser: () => Promise<void>;
  setHasHydrated: (state: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      _hasHydrated: false,
      setHasHydrated: (state) => set({ _hasHydrated: state }),
      setAuth: (token, user) => set({ token, user, isAuthenticated: true }),
      logout: () => set({ token: null, user: null, isAuthenticated: false }),
      fetchUser: async () => {
        try {
          const token = get().token;
          if (!token) return;

          // Use api client which handles base URL and headers automatically
          const response = await api.get('/auth/me');
          
          if (response.status === 200) {
            const userData = response.data;
            // Backend returns 'name', 'email'. Ensure frontend uses them.
            set({ user: userData });
          }
        } catch (error) {
          console.error("Failed to fetch user", error);
        }
      }
    }),
    {
      name: 'auth-storage',
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
