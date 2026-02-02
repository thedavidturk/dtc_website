import { create } from "zustand";

interface StoreState {
  scroll: number;
  setScroll: (scroll: number) => void;
  section: number;
  setSection: (section: number) => void;
  mousePosition: { x: number; y: number };
  setMousePosition: (x: number, y: number) => void;
  isContactOpen: boolean;
  setContactOpen: (open: boolean) => void;
  isShowreelOpen: boolean;
  setShowreelOpen: (open: boolean) => void;
  isLoaded: boolean;
  setLoaded: (loaded: boolean) => void;
}

export const useStore = create<StoreState>((set) => ({
  scroll: 0,
  setScroll: (scroll) => set({ scroll }),
  section: 0,
  setSection: (section) => set({ section }),
  mousePosition: { x: 0, y: 0 },
  setMousePosition: (x, y) => set({ mousePosition: { x, y } }),
  isContactOpen: false,
  setContactOpen: (open) => set({ isContactOpen: open }),
  isShowreelOpen: false,
  setShowreelOpen: (open) => set({ isShowreelOpen: open }),
  isLoaded: false,
  setLoaded: (loaded) => set({ isLoaded: loaded }),
}));
