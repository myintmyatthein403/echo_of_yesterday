'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import type { ImageItem } from '@/lib/types';
import {
  getLocalizedLocation,
  getLocalizedTags,
  getLocalizedTitle,
} from '@/lib/data-utils';
import { MotionCard } from '@/components/motion/MotionCard';
import { FavoriteButton } from '@/components/FavoriteButton';

interface ImageCardProps {
  image: ImageItem;
  variant?: 'polaroid' | 'card';
  tagLimit?: number;
}

export function ImageCard({
  image,
  variant = 'polaroid',
  tagLimit = 2,
}: ImageCardProps) {
  const locale = useLocale();
  const title = getLocalizedTitle(image, locale);
  const wrapperClass =
    variant === 'polaroid'
      ? 'polaroid group block relative'
      : 'card-vintage group block relative';

  return (
    <MotionCard>
      <Link href={`/${locale}/image/${image.id}`} className={wrapperClass}>
        <div className="absolute top-3 right-3 z-10">
          <FavoriteButton imageId={image.id} />
        </div>
        <div className="relative w-full h-56 mb-3 overflow-hidden bg-vintage-sepia">
          <Image
            src={image.thumbnailUrl || image.imageUrl}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500 sepia-filter"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <h3 className="font-vintage text-lg font-bold text-vintage-dark mb-1 line-clamp-2">
          {title}
        </h3>
        <p className="font-serif text-sm text-vintage-brown mb-2">
          {image.year} · {getLocalizedLocation(image, locale) || '—'}
        </p>
        <div className="flex flex-wrap gap-1">
          {getLocalizedTags(image, locale).slice(0, tagLimit).map((tag, i) => (
            <span
              key={i}
              className="px-2 py-0.5 bg-vintage-sepia/80 text-vintage-dark text-xs font-serif border border-vintage-dark/20"
            >
              {tag}
            </span>
          ))}
        </div>
      </Link>
    </MotionCard>
  );
}
