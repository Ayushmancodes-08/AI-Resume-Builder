import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  setTokens: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: 'guest-access-token',
      refreshToken: 'guest-refresh-token',
      isAuthenticated: true,
      setTokens: (accessToken, refreshToken) =>
        set({
          accessToken,
          refreshToken,
          isAuthenticated: true,
        }),
      logout: () =>
        set({
          accessToken: 'guest-access-token',
          refreshToken: 'guest-refresh-token',
          isAuthenticated: true,
        }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
