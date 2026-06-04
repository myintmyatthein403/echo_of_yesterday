import { ImageItem } from './types';

/**
 * Get localized value from image data
 */
export function getLocalizedValue<T>(
  value: T | Record<string, T> | undefined,
  locale: string,
  fallback?: T
): T | undefined {
  if (!value) return fallback;

  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return value as T;
  }

  const valueObj = value as Record<string, T>;
  const hasLocaleKeys =
    'my' in valueObj ||
    'en' in valueObj ||
    'zh' in valueObj ||
    'de' in valueObj;

  if (hasLocaleKeys) {
    if (locale && valueObj[locale] !== undefined && valueObj[locale] !== null) {
      return valueObj[locale];
    }
    if (valueObj['en'] !== undefined && valueObj['en'] !== null) {
      return valueObj['en'];
    }
    if (valueObj['my'] !== undefined && valueObj['my'] !== null) {
      return valueObj['my'];
    }
    if (valueObj['zh'] !== undefined && valueObj['zh'] !== null) {
      return valueObj['zh'];
    }
    if (valueObj['de'] !== undefined && valueObj['de'] !== null) {
      return valueObj['de'];
    }
    return fallback;
  }

  return value as T;
}

export function getLocalizedTitle(image: ImageItem, locale: string): string {
  return getLocalizedValue(image.title, locale, 'Untitled Image') as string;
}

export function getLocalizedDescription(image: ImageItem, locale: string): string {
  return getLocalizedValue(image.description, locale, '') as string;
}

export function getLocalizedHistoricalContext(
  image: ImageItem,
  locale: string
): string | undefined {
  return getLocalizedValue(image.historicalContext, locale) as
    | string
    | undefined;
}

export function getLocalizedLocation(
  image: ImageItem,
  locale: string
): string | undefined {
  return getLocalizedValue(image.location, locale) as string | undefined;
}

export function getLocalizedCategory(image: ImageItem, locale: string): string {
  return getLocalizedValue(image.category, locale, 'Other') as string;
}

export function getLocalizedTags(image: ImageItem, locale: string): string[] {
  const tags = getLocalizedValue(image.tags, locale, []) as string[];
  return Array.isArray(tags) ? tags : [];
}
