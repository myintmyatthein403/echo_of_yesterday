import { sampleImages } from '@/lib/data';
import { getLocalizedTags } from '@/lib/data-utils';
import type { ImageItem } from '@/lib/types';

export function getRelatedImages(
  image: ImageItem,
  locale: string,
  limit = 4
): ImageItem[] {
  const tags = getLocalizedTags(image, locale);

  const scored = sampleImages
    .filter((img) => img.id !== image.id)
    .map((img) => {
      const otherTags = getLocalizedTags(img, locale);
      const sharedTags = tags.filter((t) => otherTags.includes(t)).length;
      let score = sharedTags * 3;
      if (img.era === image.era) score += 2;
      if (img.decade === image.decade) score += 2;
      const catA =
        typeof image.category === 'string'
          ? image.category
          : image.category['en'] ?? '';
      const catB =
        typeof img.category === 'string'
          ? img.category
          : img.category['en'] ?? '';
      if (catA && catA === catB) score += 1;
      return { img, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map(({ img }) => img);
}
