'use client';

import { useTranslations } from 'next-intl';
import { useScrapbookStore } from '@/lib/stores/useScrapbookStore';
import { useHydrated } from '@/lib/stores/useHydrated';

interface FavoriteButtonProps {
  imageId: string;
  className?: string;
}

export function FavoriteButton({ imageId, className = '' }: FavoriteButtonProps) {
  const t = useTranslations('scrapbook');
  const hydrated = useHydrated();
  const isFavorite = useScrapbookStore((s) => s.isFavorite(imageId));
  const toggleFavorite = useScrapbookStore((s) => s.toggleFavorite);

  const active = hydrated && isFavorite;

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(imageId);
      }}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-vintage border-2 border-vintage-dark bg-vintage-paper/90 text-lg shadow-vintage-sm transition-all hover:bg-vintage-sepia ${className}`}
      aria-label={active ? t('removeFromScrapbook') : t('addToScrapbook')}
      aria-pressed={active}
    >
      <span aria-hidden="true">{active ? '♥' : '♡'}</span>
    </button>
  );
}
