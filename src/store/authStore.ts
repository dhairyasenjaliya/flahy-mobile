import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  user: any | null;
  _hasHydrated: boolean;
  setToken: (token: string) => void;
  setUser: (user: any) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      _hasHydrated: false,
      isAuthenticated: false,
      setToken: (token) => set({ token, isAuthenticated: !!token }),
      setUser: (user) => set({ user }),
      logout: () => set({ token: null, user: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => () => {
        useAuthStore.setState({ _hasHydrated: true });
      },
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
