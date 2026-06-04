import { sampleImages } from '@/lib/data';
import {
  getLocalizedDescription,
  getLocalizedLocation,
  getLocalizedTags,
  getLocalizedTitle,
} from '@/lib/data-utils';
import type { ImageItem } from '@/lib/types';

export interface SearchResult {
  image: ImageItem;
  score: number;
}

function normalize(text: string): string {
  return text.toLowerCase().trim();
}

function scoreMatch(haystack: string, query: string): number {
  const h = normalize(haystack);
  const q = normalize(query);
  if (!q || !h) return 0;
  if (h === q) return 100;
  if (h.startsWith(q)) return 80;
  if (h.includes(q)) return 50;
  const words = q.split(/\s+/).filter(Boolean);
  let wordScore = 0;
  for (const w of words) {
    if (h.includes(w)) wordScore += 20;
  }
  return wordScore;
}

export function searchImages(query: string, locale: string): SearchResult[] {
  const q = query.trim();
  if (!q) return [];

  const results: SearchResult[] = [];

  for (const image of sampleImages) {
    const fields = [
      getLocalizedTitle(image, locale),
      getLocalizedDescription(image, locale),
      getLocalizedLocation(image, locale) ?? '',
      image.year.toString(),
      image.decade,
      image.era,
      ...getLocalizedTags(image, locale),
    ].filter(Boolean);

    const score = Math.max(...fields.map((f) => scoreMatch(f, q)), 0);
    if (score > 0) {
      results.push({ image, score });
    }
  }

  return results.sort((a, b) => b.score - a.score);
}
