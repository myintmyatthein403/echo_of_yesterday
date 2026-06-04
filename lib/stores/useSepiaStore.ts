import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SepiaState {
  isSepia: boolean;
  toggleSepia: () => void;
  setSepia: (value: boolean) => void;
}

/**
 * Global sepia-filter preference. Persisting it means the visitor's choice of
 * the vintage sepia look survives reloads and navigation.
 */
export const useSepiaStore = create<SepiaState>()(
  persist(
    (set) => ({
      isSepia: false,
      toggleSepia: () => set((state) => ({ isSepia: !state.isSepia })),
      setSepia: (value) => set({ isSepia: value }),
    }),
    {
      name: 'eoy-sepia',
    }
  )
);
