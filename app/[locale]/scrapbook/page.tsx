'use client';

import { useMemo } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { sampleImages } from '@/lib/data';
import { useScrapbookStore } from '@/lib/stores/useScrapbookStore';
import { useHydrated } from '@/lib/stores/useHydrated';
import { StaggerGroup, StaggerItem } from '@/components/motion/StaggerGroup';
import { ImageCard } from '@/components/ImageCard';
import { Reveal } from '@/components/motion/Reveal';
import Link from 'next/link';

export default function ScrapbookPage() {
  const locale = useLocale();
  const t = useTranslations('scrapbook');
  const hydrated = useHydrated();
  const favorites = useScrapbookStore((s) => s.favorites);
  const clearFavorites = useScrapbookStore((s) => s.clearFavorites);

  const savedImages = useMemo(
    () => sampleImages.filter((img) => favorites.includes(img.id)),
    [favorites]
  );

  return (
    <main className="min-h-screen">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <Reveal>
          <h1 className="font-vintage text-display-sm font-bold text-center text-vintage-dark mb-3">
            {t('title')}
          </h1>
          <p className="text-center font-serif text-lg text-vintage-brown mb-10 max-w-xl mx-auto">
            {t('description')}
          </p>
        </Reveal>

        {!hydrated ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton h-80" />
            ))}
          </div>
        ) : savedImages.length === 0 ? (
          <div className="text-center py-20 card-vintage max-w-md mx-auto">
            <p className="font-vintage text-5xl mb-4 text-vintage-brown/30">
              ♡
            </p>
            <p className="font-serif text-lg text-vintage-dark/80 mb-6">
              {t('empty')}
            </p>
            <Link href={`/${locale}/archive`} className="btn-vintage">
              {t('browseArchive')}
            </Link>
          </div>
        ) : (
          <>
            <div className="flex justify-end mb-6">
              <button
                type="button"
                onClick={clearFavorites}
                className="btn-vintage-secondary text-sm"
              >
                {t('clearAll')}
              </button>
            </div>
            <StaggerGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {savedImages.map((image) => (
                <StaggerItem key={image.id}>
                  <ImageCard image={image} />
                </StaggerItem>
              ))}
            </StaggerGroup>
          </>
        )}
      </div>
      <Footer />
    </main>
  );
}
