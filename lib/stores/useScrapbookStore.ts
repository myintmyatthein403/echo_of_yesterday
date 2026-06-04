import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ScrapbookState {
  favorites: string[];
  toggleFavorite: (imageId: string) => void;
  isFavorite: (imageId: string) => boolean;
  clearFavorites: () => void;
}

export const useScrapbookStore = create<ScrapbookState>()(
  persist(
    (set, get) => ({
      favorites: [],
      toggleFavorite: (imageId) =>
        set((state) => {
          const exists = state.favorites.includes(imageId);
          return {
            favorites: exists
              ? state.favorites.filter((id) => id !== imageId)
              : [...state.favorites, imageId],
          };
        }),
      isFavorite: (imageId) => get().favorites.includes(imageId),
      clearFavorites: () => set({ favorites: [] }),
    }),
    { name: 'eoy-scrapbook' }
  )
);
