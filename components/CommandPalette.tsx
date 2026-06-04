'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { searchImages } from '@/lib/search';
import { getLocalizedTitle } from '@/lib/data-utils';
import Image from 'next/image';

export function CommandPalette() {
  const t = useTranslations('search');
  const locale = useLocale();
  const router = useRouter();
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const results = useMemo(
    () => searchImages(query, locale).slice(0, 8),
    [query, locale]
  );

  const close = useCallback(() => {
    setOpen(false);
    setQuery('');
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [close]);

  const goTo = (id: string) => {
    router.push(`/${locale}/image/${id}`);
    close();
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="hidden md:inline-flex items-center gap-2 px-3 py-1.5 text-xs font-serif border-2 border-vintage-dark/40 rounded-vintage bg-vintage-paper/80 hover:bg-vintage-sepia transition-colors"
        aria-label={t('open')}
      >
        <span>{t('open')}</span>
        <kbd className="px-1.5 py-0.5 text-[10px] border border-vintage-dark/30 rounded bg-vintage-sepia/30">
          ⌘K
        </kbd>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-start justify-center pt-[12vh] px-4"
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label={t('title')}
          >
            <button
              type="button"
              className="absolute inset-0 bg-vintage-ink/40 backdrop-blur-sm"
              onClick={close}
              aria-label={t('close')}
            />
            <motion.div
              className="relative w-full max-w-xl surface border-2 border-vintage-dark shadow-vintage-lg p-0 overflow-hidden"
              initial={reduced ? false : { opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('placeholder')}
                className="w-full px-5 py-4 font-serif text-lg bg-transparent border-b-2 border-vintage-dark/20 focus:outline-none"
                aria-controls="search-results"
              />
              <ul
                id="search-results"
                className="max-h-80 overflow-y-auto py-2"
                role="listbox"
              >
                {results.length === 0 && query.trim() ? (
                  <li className="px-5 py-6 text-center font-serif text-vintage-dark/60">
                    {t('noResults')}
                  </li>
                ) : (
                  results.map(({ image }) => (
                    <li key={image.id} role="option">
                      <button
                        type="button"
                        className="w-full flex items-center gap-4 px-5 py-3 text-left hover:bg-vintage-sepia/40 transition-colors"
                        onClick={() => goTo(image.id)}
                      >
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden border border-vintage-dark/30 bg-vintage-sepia">
                          <Image
                            src={image.thumbnailUrl || image.imageUrl}
                            alt=""
                            fill
                            className="object-cover sepia-filter"
                            sizes="48px"
                          />
                        </div>
                        <div>
                          <p className="font-vintage font-bold text-vintage-dark line-clamp-1">
                            {getLocalizedTitle(image, locale)}
                          </p>
                          <p className="font-serif text-xs text-vintage-brown">
                            {image.year} · {image.decade}
                          </p>
                        </div>
                      </button>
                    </li>
                  ))
                )}
                {!query.trim() && (
                  <li className="px-5 py-4 font-serif text-sm text-vintage-dark/50">
                    {t('hint')}
                  </li>
                )}
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
