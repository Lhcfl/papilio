import { create } from 'zustand';

export const useRightbarOrPopup = create<{
  title: React.ReactNode;
  node: React.ReactNode;
  closing: boolean;
  push: (p: { title: React.ReactNode; node: React.ReactNode }) => void;
  close: () => void;
}>((set) => ({
  title: null,
  node: null,
  closing: false,
  push: ({ title, node }) => {
    set({ title, node });
  },
  close: () => {
    set({ closing: true });
    setTimeout(() => {
      set({ title: null, node: null, closing: false });
    }, 300);
  },
}));
