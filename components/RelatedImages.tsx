'use client';

import { useLocale, useTranslations } from 'next-intl';
import type { ImageItem } from '@/lib/types';
import { getRelatedImages } from '@/lib/related-images';
import { StaggerGroup, StaggerItem } from '@/components/motion/StaggerGroup';
import { ImageCard } from '@/components/ImageCard';
import { Reveal } from '@/components/motion/Reveal';

interface RelatedImagesProps {
  image: ImageItem;
}

export function RelatedImages({ image }: RelatedImagesProps) {
  const locale = useLocale();
  const t = useTranslations('image');
  const related = getRelatedImages(image, locale);

  if (related.length === 0) return null;

  return (
    <Reveal className="mt-12">
      <h2 className="font-vintage text-2xl font-bold text-vintage-dark mb-6">
        {t('relatedImages')}
      </h2>
      <StaggerGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {related.map((img) => (
          <StaggerItem key={img.id}>
            <ImageCard image={img} variant="card" tagLimit={1} />
          </StaggerItem>
        ))}
      </StaggerGroup>
    </Reveal>
  );
}
