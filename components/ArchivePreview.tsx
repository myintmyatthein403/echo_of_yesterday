'use client';

import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { sampleImages } from '@/lib/data';
import { StaggerGroup, StaggerItem } from '@/components/motion/StaggerGroup';
import { ImageCard } from '@/components/ImageCard';
import { Reveal } from '@/components/motion/Reveal';

export function ArchivePreview() {
  const locale = useLocale();
  const t = useTranslations('archive');
  const previewImages = sampleImages.slice(0, 6);

  return (
    <div>
      <StaggerGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
        {previewImages.map((image) => (
          <StaggerItem key={image.id}>
            <ImageCard image={image} />
          </StaggerItem>
        ))}
      </StaggerGroup>
      <Reveal className="text-center">
        <Link href={`/${locale}/archive`} className="btn-vintage">
          {t('browseFullArchive')}
        </Link>
      </Reveal>
    </div>
  );
}
