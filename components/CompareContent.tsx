'use client';

import { useSearchParams } from 'next/navigation';
import { BeforeAfterComparison } from './BeforeAfterComparison';
import { sampleImages } from '@/lib/data';

export function CompareContent() {
  const searchParams = useSearchParams();
  const beforeId = searchParams.get('before');
  const afterId = searchParams.get('after');

  const beforeImage = beforeId ? sampleImages.find(img => img.id === beforeId || img.imageUrl === beforeId) : null;
  const afterImage = afterId ? sampleImages.find(img => img.id === afterId || img.imageUrl === afterId) : null;

  // If specific images not found, use sample images with before/after
  const defaultBefore = sampleImages.find(img => img.beforeImageId) || sampleImages[0];
  const defaultAfter = sampleImages.find(img => img.afterImageId) || sampleImages[1];

  if (!defaultBefore || !defaultAfter) {
    return (
      <div className="text-center py-12">
        <p className="font-serif text-lg text-vintage-dark/60">
          No images available for comparison.
        </p>
      </div>
    );
  }

  return (
    <BeforeAfterComparison
      beforeImage={beforeImage || defaultBefore}
      afterImage={afterImage || defaultAfter}
    />
  );
}
