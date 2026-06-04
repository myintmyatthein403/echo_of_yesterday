'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useSepiaStore } from '@/lib/stores/useSepiaStore';
import { useHydrated } from '@/lib/stores/useHydrated';

export function SepiaToggle() {
  const t = useTranslations('common');
  const isSepia = useSepiaStore((state) => state.isSepia);
  const toggleSepia = useSepiaStore((state) => state.toggleSepia);
  const hydrated = useHydrated();

  useEffect(() => {
    if (isSepia) {
      document.body.classList.add('sepia-filter');
    } else {
      document.body.classList.remove('sepia-filter');
    }
  }, [isSepia]);

  const active = hydrated && isSepia;

  return (
    <button
      type="button"
      onClick={toggleSepia}
      className="px-4 py-2 bg-vintage-accent text-vintage-dark font-serif border-2 border-vintage-dark 
                 hover:bg-vintage-brown hover:text-vintage-paper transition-colors text-sm rounded-vintage"
      aria-label={active ? t('sepiaOff') : t('sepiaOn')}
      aria-pressed={active}
    >
      <span aria-hidden="true">{active ? '☀️' : '📷'}</span>
    </button>
  );
}
