'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ImageItem } from '@/lib/types';
import {
  getLocalizedTitle,
  getLocalizedDescription,
  getLocalizedHistoricalContext,
  getLocalizedLocation,
  getLocalizedCategory,
  getLocalizedTags,
} from '@/lib/data-utils';
import Image from 'next/image';
import Link from 'next/link';
import { CommentSection } from './CommentSection';
import { RelatedImages } from './RelatedImages';
import { FavoriteButton } from './FavoriteButton';
import { Reveal } from '@/components/motion/Reveal';

interface ImageDetailProps {
  image: ImageItem;
}

export function ImageDetail({ image }: ImageDetailProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [progress, setProgress] = useState(0);
  const locale = useLocale();
  const t = useTranslations('image');
  const tEras = useTranslations('eras');
  const tCategories = useTranslations('categories');
  const reduced = useReducedMotion();

  const title = useMemo(() => getLocalizedTitle(image, locale), [image, locale]);
  const description = useMemo(
    () => getLocalizedDescription(image, locale),
    [image, locale]
  );
  const historicalContext = useMemo(
    () => getLocalizedHistoricalContext(image, locale),
    [image, locale]
  );
  const location = useMemo(
    () => getLocalizedLocation(image, locale),
    [image, locale]
  );
  const category = useMemo(
    () => getLocalizedCategory(image, locale),
    [image, locale]
  );
  const tags = useMemo(() => getLocalizedTags(image, locale), [image, locale]);

  const onScroll = useCallback(() => {
    const el = document.documentElement;
    const scrollTop = el.scrollTop;
    const max = el.scrollHeight - el.clientHeight;
    setProgress(max > 0 ? scrollTop / max : 0);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [onScroll]);

  useEffect(() => {
    if (!isFullscreen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsFullscreen(false);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [isFullscreen]);

  const sourceText =
    typeof image.source === 'string'
      ? image.source
      : image.source?.[locale] ||
        image.source?.['en'] ||
        image.source?.['my'] ||
        '';

  return (
    <div>
      <div
        className="reading-progress z-[60]"
        style={{ transform: `scaleX(${progress})` }}
        aria-hidden
      />

      <Link
        href={`/${locale}/archive`}
        className="inline-flex items-center gap-2 font-serif text-vintage-dark hover:text-vintage-brown mb-8 transition-colors"
      >
        ← {t('backToArchive')}
      </Link>

      <div className="grid lg:grid-cols-[1fr_320px] gap-10">
        <div>
          <Reveal>
            <div className="card-vintage mb-8 p-4 md:p-6 relative">
              <div className="absolute top-4 right-4 z-10">
                <FavoriteButton imageId={image.id} />
              </div>
              <button
                type="button"
                className="relative w-full aspect-[4/3] md:aspect-[16/10] overflow-hidden bg-vintage-sepia cursor-zoom-in block"
                onClick={() => setIsFullscreen(true)}
                aria-label={t('openFullscreen')}
              >
                <Image
                  src={image.imageUrl}
                  alt={title}
                  fill
                  className="object-contain sepia-filter hover:sepia-0 transition-[filter] duration-700"
                  sizes="(max-width: 1024px) 100vw, 65vw"
                  priority
                />
              </button>
            </div>
          </Reveal>

          <Reveal delay={0.05}>
            <h1 className="font-vintage text-display-sm font-bold text-vintage-ink mb-4">
              {title}
            </h1>
            <p className="font-serif text-lg text-vintage-dark/90 leading-relaxed mb-6">
              {description}
            </p>
          </Reveal>

          {historicalContext && (
            <Reveal delay={0.1}>
              <div className="mb-8">
                <h2 className="font-vintage text-xl font-bold text-vintage-dark mb-3">
                  {t('historicalContext')}
                </h2>
                <p className="font-serif text-lg text-vintage-dark/85 leading-relaxed">
                  {historicalContext}
                </p>
              </div>
            </Reveal>
          )}

          <Reveal delay={0.15}>
            <div className="mb-8">
              <h2 className="font-vintage text-xl font-bold text-vintage-dark mb-3">
                {t('categoryTags')}
              </h2>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-vintage-brown text-vintage-paper font-serif border-2 border-vintage-dark text-sm">
                  {tCategories(category as never) || category}
                </span>
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-vintage-sepia text-vintage-dark font-serif border border-vintage-dark text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>

          {(image.beforeImageId || image.afterImageId) && (
            <Link
              href={`/${locale}/compare?before=${image.beforeImageId || image.id}&after=${image.afterImageId || image.id}`}
              className="btn-vintage inline-block mb-8"
            >
              {t('viewComparison')}
            </Link>
          )}

          <CommentSection imageId={image.id} />
          <RelatedImages image={image} />
        </div>

        <aside className="lg:sticky lg:top-24 h-fit">
          <Reveal>
            <div className="surface border-2 border-vintage-dark p-6 font-serif text-sm space-y-4">
              <h2 className="font-vintage text-lg font-bold text-vintage-dark border-b border-vintage-dark/20 pb-2">
                {t('indexCard')}
              </h2>
              <div>
                <span className="text-vintage-brown block text-xs uppercase tracking-wide">
                  {t('year')}
                </span>
                <span className="font-vintage text-xl">{image.year}</span>
              </div>
              <div>
                <span className="text-vintage-brown block text-xs uppercase tracking-wide">
                  {t('decade')}
                </span>
                {image.decade}
              </div>
              <div>
                <span className="text-vintage-brown block text-xs uppercase tracking-wide">
                  {t('era')}
                </span>
                {tEras(image.era as never) || image.era}
              </div>
              {location && (
                <div>
                  <span className="text-vintage-brown block text-xs uppercase tracking-wide">
                    {t('location')}
                  </span>
                  {location}
                </div>
              )}
              {sourceText && (
                <div>
                  <span className="text-vintage-brown block text-xs uppercase tracking-wide">
                    {t('source')}
                  </span>
                  {sourceText}
                </div>
              )}
            </div>
          </Reveal>
        </aside>
      </div>

      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            className="fixed inset-0 bg-vintage-ink/95 z-[70] flex items-center justify-center p-4 md:p-8"
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsFullscreen(false)}
            role="dialog"
            aria-modal="true"
            aria-label={title}
          >
            <motion.div
              initial={reduced ? false : { scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="relative max-w-6xl max-h-[90vh] w-full h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={image.imageUrl}
                alt={title}
                width={1920}
                height={1080}
                className="max-w-full max-h-[85vh] w-auto h-auto mx-auto object-contain"
              />
              <button
                type="button"
                onClick={() => setIsFullscreen(false)}
                className="absolute top-0 right-0 md:-top-2 md:-right-2 w-10 h-10 flex items-center justify-center bg-vintage-paper border-2 border-vintage-dark font-bold text-vintage-dark hover:bg-vintage-sepia"
                aria-label={t('closeFullscreen')}
              >
                ×
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
