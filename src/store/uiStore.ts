import { create } from 'zustand';

interface ErrorState {
  isVisible: boolean;
  title: string;
  message: string;
  showError: (title: string, message: string) => void;
  hideError: () => void;
}

export const useUIStore = create<ErrorState>((set) => ({
  isVisible: false,
  title: '',
  message: '',
  showError: (title, message) => set({ isVisible: true, title, message }),
  hideError: () => set({ isVisible: false, title: '', message: '' }),
}));
