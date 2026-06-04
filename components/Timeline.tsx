'use client';

import { useState, useMemo } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { motion, useReducedMotion } from 'framer-motion';
import { sampleImages, decades } from '@/lib/data';
import { ImageItem } from '@/lib/types';
import {
  getLocalizedTitle,
  getLocalizedDescription,
  getLocalizedLocation,
} from '@/lib/data-utils';
import Link from 'next/link';
import { StaggerGroup, StaggerItem } from '@/components/motion/StaggerGroup';
import { ImageCard } from '@/components/ImageCard';

interface TimelineProps {
  preview?: boolean;
}

export function Timeline({ preview = false }: TimelineProps) {
  const [selectedDecade, setSelectedDecade] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const locale = useLocale();
  const t = useTranslations('timeline');
  const tDecades = useTranslations('decades');
  const reduced = useReducedMotion();

  const timelineData = useMemo(() => {
    const grouped: Record<string, Record<number, ImageItem[]>> = {};
    sampleImages.forEach((image) => {
      if (!grouped[image.decade]) grouped[image.decade] = {};
      if (!grouped[image.decade][image.year])
        grouped[image.decade][image.year] = [];
      grouped[image.decade][image.year].push(image);
    });
    return grouped;
  }, []);

  const filteredImages = useMemo(() => {
    if (selectedYear) {
      return sampleImages.filter((img) => img.year === selectedYear);
    }
    if (selectedDecade) {
      return sampleImages.filter((img) => img.decade === selectedDecade);
    }
    return preview ? sampleImages.slice(0, 6) : sampleImages;
  }, [selectedDecade, selectedYear, preview]);

  const visibleDecades = preview
    ? decades.filter((d) => sampleImages.some((img) => img.decade === d)).slice(0, 4)
    : decades.filter((d) => sampleImages.some((img) => img.decade === d));

  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row gap-10">
        {/* Decade rail */}
        <div className="lg:w-48 shrink-0 relative">
          <div
            className="hidden lg:block absolute left-4 top-0 bottom-0 w-0.5 bg-vintage-dark/20"
            aria-hidden
          />
          <motion.div
            className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0"
            layout={!reduced}
          >
            {visibleDecades.map((decade) => {
              const hasImages = sampleImages.some((img) => img.decade === decade);
              const active = selectedDecade === decade;
              return (
                <button
                  key={decade}
                  type="button"
                  onClick={() => {
                    setSelectedDecade(active ? null : decade);
                    setSelectedYear(null);
                  }}
                  disabled={!hasImages}
                  className={`relative lg:pl-8 px-4 py-2.5 font-vintage text-sm whitespace-nowrap border-2 transition-all rounded-vintage ${
                    active
                      ? 'bg-vintage-brown text-vintage-paper border-vintage-dark shadow-vintage'
                      : hasImages
                        ? 'bg-vintage-paper text-vintage-dark border-vintage-dark hover:bg-vintage-sepia'
                        : 'opacity-40 cursor-not-allowed'
                  }`}
                >
                  <span
                    className={`hidden lg:block absolute left-2 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full border-2 border-vintage-dark ${
                      active ? 'bg-vintage-accent' : 'bg-vintage-paper'
                    }`}
                    aria-hidden
                  />
                  {tDecades(decade as never) || decade}
                </button>
              );
            })}
          </motion.div>
        </div>

        <div className="flex-1 min-w-0">
          {selectedDecade && timelineData[selectedDecade] && (
            <div className="mb-8 flex flex-wrap gap-2">
              {Object.keys(timelineData[selectedDecade])
                .sort((a, b) => Number(a) - Number(b))
                .map((year) => (
                  <button
                    key={year}
                    type="button"
                    onClick={() =>
                      setSelectedYear(
                        selectedYear === Number(year) ? null : Number(year)
                      )
                    }
                    className={`px-4 py-2 font-serif text-sm border-2 rounded-vintage transition-all ${
                      selectedYear === Number(year)
                        ? 'bg-vintage-dark text-vintage-paper border-vintage-dark'
                        : 'bg-vintage-paper text-vintage-dark border-vintage-dark hover:bg-vintage-sepia'
                    }`}
                  >
                    {year}
                  </button>
                ))}
            </div>
          )}

          <StaggerGroup
            className={
              preview
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-8'
            }
          >
            {preview
              ? filteredImages.map((image) => (
                  <StaggerItem key={image.id}>
                    <ImageCard image={image} />
                  </StaggerItem>
                ))
              : filteredImages.map((image) => (
                  <StaggerItem key={image.id}>
                    <Link
                      href={`/${locale}/image/${image.id}`}
                      className="flex flex-col md:flex-row gap-6 card-vintage group"
                    >
                      <div className="relative w-full md:w-72 h-48 shrink-0 overflow-hidden bg-vintage-sepia">
                        <img
                          src={image.thumbnailUrl || image.imageUrl}
                          alt={getLocalizedTitle(image, locale)}
                          className="w-full h-full object-cover sepia-filter group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="flex-1 py-1">
                        <span className="font-serif text-xs text-vintage-brown">
                          {image.year} · {getLocalizedLocation(image, locale)}
                        </span>
                        <h3 className="font-vintage text-xl font-bold text-vintage-dark mt-1 mb-2">
                          {getLocalizedTitle(image, locale)}
                        </h3>
                        <p className="font-serif text-sm text-vintage-dark/80 line-clamp-3">
                          {getLocalizedDescription(image, locale)}
                        </p>
                      </div>
                    </Link>
                  </StaggerItem>
                ))}
          </StaggerGroup>

          {preview && filteredImages.length > 0 && (
            <div className="text-center mt-10">
              <Link href={`/${locale}/timeline`} className="btn-vintage">
                {t('viewFullTimeline')}
              </Link>
            </div>
          )}

          {filteredImages.length === 0 && (
            <p className="text-center py-12 font-serif text-lg text-vintage-dark/60">
              {t('noImages')}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
