'use client';

import { useState, useRef, useCallback } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { motion, useReducedMotion } from 'framer-motion';
import { ImageItem } from '@/lib/types';
import {
  getLocalizedTitle,
  getLocalizedDescription,
  getLocalizedLocation,
} from '@/lib/data-utils';
import Image from 'next/image';

interface BeforeAfterComparisonProps {
  beforeImage: ImageItem;
  afterImage: ImageItem;
}

export function BeforeAfterComparison({
  beforeImage,
  afterImage,
}: BeforeAfterComparisonProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const locale = useLocale();
  const t = useTranslations('compare');
  const tImage = useTranslations('image');
  const reduced = useReducedMotion();

  const beforeTitle = getLocalizedTitle(beforeImage, locale);
  const afterTitle = getLocalizedTitle(afterImage, locale);
  const beforeDescription = getLocalizedDescription(beforeImage, locale);
  const afterDescription = getLocalizedDescription(afterImage, locale);
  const beforeLocation = getLocalizedLocation(beforeImage, locale);
  const afterLocation = getLocalizedLocation(afterImage, locale);

  const updateFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setSliderPosition((x / rect.width) * 100);
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    updateFromClientX(e.clientX);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    updateFromClientX(e.clientX);
  };

  const onPointerUp = () => {
    dragging.current = false;
  };

  return (
    <div className="space-y-8">
      <div
        ref={containerRef}
        className="relative w-full h-[min(600px,70vh)] overflow-hidden bg-vintage-sepia border-4 border-vintage-dark shadow-vintage-lg cursor-ew-resize select-none touch-none"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        role="slider"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(sliderPosition)}
        aria-label={t('slideToCompare')}
      >
        <div className="absolute inset-0">
          <Image
            src={beforeImage.imageUrl}
            alt={beforeTitle}
            fill
            className="object-cover pointer-events-none"
            sizes="100vw"
            draggable={false}
          />
        </div>

        <div
          className="absolute inset-0 overflow-hidden pointer-events-none"
          style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
        >
          <Image
            src={afterImage.imageUrl}
            alt={afterTitle}
            fill
            className="object-cover"
            sizes="100vw"
            draggable={false}
          />
        </div>

        <motion.div
          className="absolute top-0 bottom-0 w-1 bg-vintage-dark z-10 pointer-events-none"
          style={{ left: `${sliderPosition}%` }}
          layout={!reduced}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-vintage-dark border-4 border-vintage-paper rounded-full shadow-vintage flex items-center justify-center">
            <div className="w-6 h-6 bg-vintage-paper rounded-full" />
          </div>
        </motion.div>
      </div>

      <div className="card-vintage">
        <label
          htmlFor="compare-slider"
          className="block font-serif text-lg font-bold text-vintage-dark mb-4"
        >
          {t('slideToCompare')}: {Math.round(sliderPosition)}%
        </label>
        <input
          id="compare-slider"
          type="range"
          min={0}
          max={100}
          value={sliderPosition}
          onChange={(e) => setSliderPosition(Number(e.target.value))}
          className="w-full h-3 bg-vintage-sepia rounded-lg appearance-none cursor-pointer accent-vintage-brown"
        />
        <div className="flex justify-between mt-2 font-serif text-sm text-vintage-brown">
          <span>
            {t('before')} ({beforeImage.year})
          </span>
          <span>
            {t('after')} ({afterImage.year})
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card-vintage">
          <h3 className="font-vintage text-2xl font-bold text-vintage-dark mb-3">
            {t('before')}: {beforeTitle}
          </h3>
          <p className="font-serif text-vintage-brown mb-2">
            {tImage('year')}: {beforeImage.year} · {beforeLocation || '—'}
          </p>
          <p className="font-serif text-vintage-dark/90">{beforeDescription}</p>
        </div>
        <div className="card-vintage">
          <h3 className="font-vintage text-2xl font-bold text-vintage-dark mb-3">
            {t('after')}: {afterTitle}
          </h3>
          <p className="font-serif text-vintage-brown mb-2">
            {tImage('year')}: {afterImage.year} · {afterLocation || '—'}
          </p>
          <p className="font-serif text-vintage-dark/90">{afterDescription}</p>
        </div>
      </div>
    </div>
  );
}
