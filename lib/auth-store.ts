import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  email: string;
  name?: string;
  role?: string;
  avatarUrl?: string; // Optional avatar
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
  fetchUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: (token, user) => set({ token, user, isAuthenticated: true }),
      logout: () => set({ token: null, user: null, isAuthenticated: false }),
      fetchUser: async () => {
        try {
          const token = get().token;
          if (!token) return;

          const response = await fetch('http://localhost:8080/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            const userData = await response.json();
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
    }
  )
);
