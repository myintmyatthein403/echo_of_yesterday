'use client';

import { useMemo, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ArchiveFilters } from '@/components/ArchiveFilters';
import { sampleImages } from '@/lib/data';
import { useFilterStore } from '@/lib/stores/useFilterStore';
import { StaggerGroup, StaggerItem } from '@/components/motion/StaggerGroup';
import { ImageCard } from '@/components/ImageCard';
import { Reveal } from '@/components/motion/Reveal';

export default function ArchivePage() {
  const filters = useFilterStore((s) => s.filters);
  const clearFilters = useFilterStore((s) => s.clearFilters);
  const locale = useLocale();
  const t = useTranslations('archive');
  const [density, setDensity] = useState<'comfortable' | 'compact'>(
    'comfortable'
  );

  const filteredImages = useMemo(() => {
    return sampleImages.filter((image) => {
      if (filters.era && image.era !== filters.era) return false;

      const imageCategory =
        typeof image.category === 'string'
          ? image.category
          : image.category[locale] ||
            image.category['en'] ||
            image.category['my'] ||
            '';
      if (filters.category && imageCategory !== filters.category) return false;

      const imageLocation =
        typeof image.location === 'string'
          ? image.location
          : image.location?.[locale] ||
            image.location?.['en'] ||
            image.location?.['my'] ||
            '';
      if (filters.location && imageLocation !== filters.location) return false;

      if (filters.decade && image.decade !== filters.decade) return false;
      if (filters.year && image.year !== filters.year) return false;

      if (filters.tags && filters.tags.length > 0) {
        const imageTags = Array.isArray(image.tags)
          ? image.tags
          : image.tags[locale] || image.tags['en'] || image.tags['my'] || [];
        if (!filters.tags.some((tag) => imageTags.includes(tag))) return false;
      }
      return true;
    });
  }, [filters, locale]);

  const gridClass =
    density === 'compact'
      ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'
      : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8';

  return (
    <main className="min-h-screen">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <Reveal>
          <h1 className="font-vintage text-display-sm md:text-display-md font-bold text-center mb-3 text-vintage-dark">
            {t('title')}
          </h1>
          <p className="text-center font-serif text-lg text-vintage-brown mb-10 max-w-2xl mx-auto">
            {t('description')}
          </p>
        </Reveal>

        <div className="sticky top-[4.5rem] z-40 -mx-4 px-4 py-3 mb-6 bg-vintage-paper/85 backdrop-blur-md border-b border-vintage-dark/10">
          <ArchiveFilters />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <motion.p
            key={filteredImages.length}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-serif text-vintage-dark"
          >
            {t('found', { count: filteredImages.length })}
          </motion.p>
          <div className="flex gap-2" role="group" aria-label={t('viewDensity')}>
            <button
              type="button"
              onClick={() => setDensity('comfortable')}
              className={`px-3 py-1 text-xs font-serif border-2 rounded-vintage ${
                density === 'comfortable'
                  ? 'bg-vintage-brown text-vintage-paper border-vintage-dark'
                  : 'border-vintage-dark/30'
              }`}
            >
              {t('viewComfortable')}
            </button>
            <button
              type="button"
              onClick={() => setDensity('compact')}
              className={`px-3 py-1 text-xs font-serif border-2 rounded-vintage ${
                density === 'compact'
                  ? 'bg-vintage-brown text-vintage-paper border-vintage-dark'
                  : 'border-vintage-dark/30'
              }`}
            >
              {t('viewCompact')}
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {filteredImages.length > 0 ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <StaggerGroup className={gridClass}>
                {filteredImages.map((image) => (
                  <StaggerItem key={image.id}>
                    <ImageCard
                      image={image}
                      variant={density === 'compact' ? 'card' : 'polaroid'}
                    />
                  </StaggerItem>
                ))}
              </StaggerGroup>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20 card-vintage max-w-lg mx-auto"
            >
              <p className="font-vintage text-4xl mb-4 text-vintage-brown/40">
                ∅
              </p>
              <p className="font-serif text-xl text-vintage-dark/70 mb-6">
                {t('noImages')}
              </p>
              <button
                type="button"
                onClick={clearFilters}
                className="btn-vintage-secondary"
              >
                {t('clearFilters')}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Footer />
    </main>
  );
}
