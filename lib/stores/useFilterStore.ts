import { create } from 'zustand';
import type { FilterOptions } from '@/lib/types';

interface FilterState {
  filters: FilterOptions;
  setFilters: (filters: FilterOptions) => void;
  updateFilter: <K extends keyof FilterOptions>(
    key: K,
    value: FilterOptions[K]
  ) => void;
  clearFilters: () => void;
}

/**
 * Global archive filter state. Living in a Zustand store (instead of local
 * component state) keeps the selected filters intact while the user navigates
 * away from the archive and back.
 */
export const useFilterStore = create<FilterState>((set) => ({
  filters: {},
  setFilters: (filters) => set({ filters }),
  updateFilter: (key, value) =>
    set((state) => ({
      filters: { ...state.filters, [key]: value || undefined },
    })),
  clearFilters: () => set({ filters: {} }),
}));
