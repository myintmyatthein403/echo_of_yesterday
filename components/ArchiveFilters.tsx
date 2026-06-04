'use client';

import { useLocale, useTranslations } from 'next-intl';
import { FilterOptions } from '@/lib/types';
import { sampleImages, eras, categories } from '@/lib/data';
import { getLocalizedLocation, getLocalizedTags } from '@/lib/data-utils';
import { useFilterStore } from '@/lib/stores/useFilterStore';
import { motion, AnimatePresence } from 'framer-motion';

export function ArchiveFilters() {
  const locale = useLocale();
  const t = useTranslations('filters');
  const tArchive = useTranslations('archive');
  const filters = useFilterStore((s) => s.filters);
  const updateFilter = useFilterStore((s) => s.updateFilter);
  const clearFilters = useFilterStore((s) => s.clearFilters);

  const locations = Array.from(
    new Set(
      sampleImages
        .map((img) => getLocalizedLocation(img, locale))
        .filter((loc): loc is string => Boolean(loc))
    )
  );

  const allTags = Array.from(
    new Set(sampleImages.flatMap((img) => getLocalizedTags(img, locale)))
  );

  const tEras = useTranslations('eras');
  const tCategories = useTranslations('categories');

  const activeChips: { key: keyof FilterOptions; label: string }[] = [];
  if (filters.era)
    activeChips.push({ key: 'era', label: tEras(filters.era as never) });
  if (filters.category)
    activeChips.push({
      key: 'category',
      label: tCategories(filters.category as never),
    });
  if (filters.location)
    activeChips.push({ key: 'location', label: filters.location });
  if (filters.year)
    activeChips.push({ key: 'year', label: String(filters.year) });
  if (filters.tags?.length)
    filters.tags.forEach((tag) =>
      activeChips.push({ key: 'tags', label: tag })
    );

  const removeChip = (key: keyof FilterOptions, label?: string) => {
    if (key === 'tags' && label) {
      const next = (filters.tags || []).filter((t) => t !== label);
      updateFilter('tags', next.length ? next : undefined);
    } else {
      updateFilter(key, undefined);
    }
  };

  return (
    <div className="surface border-2 border-vintage-dark p-6 mb-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h2 className="font-vintage text-2xl font-bold text-vintage-dark">
          {t('title')}
        </h2>
        <button
          type="button"
          onClick={clearFilters}
          className="btn-vintage-secondary text-sm py-1 px-3"
        >
          {t('clearAll')}
        </button>
      </div>

      <AnimatePresence>
        {activeChips.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-wrap gap-2 mb-6"
          >
            <span className="font-serif text-xs text-vintage-brown self-center mr-1">
              {tArchive('activeFilters')}:
            </span>
            {activeChips.map((chip, i) => (
              <button
                key={`${chip.key}-${chip.label}-${i}`}
                type="button"
                onClick={() => removeChip(chip.key, chip.label)}
                className="chip chip-active hover:opacity-90"
              >
                {chip.label} ×
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block font-serif text-sm font-bold text-vintage-dark mb-2">
            {t('era')}
          </label>
          <select
            value={filters.era || ''}
            onChange={(e) => updateFilter('era', e.target.value || undefined)}
            className="input-vintage"
          >
            <option value="">{t('allEras')}</option>
            {eras.map((era) => (
              <option key={era} value={era}>
                {tEras(era as never)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-serif text-sm font-bold text-vintage-dark mb-2">
            {t('category')}
          </label>
          <select
            value={filters.category || ''}
            onChange={(e) =>
              updateFilter('category', e.target.value || undefined)
            }
            className="input-vintage"
          >
            <option value="">{t('allCategories')}</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {tCategories(category as never)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-serif text-sm font-bold text-vintage-dark mb-2">
            {t('location')}
          </label>
          <select
            value={filters.location || ''}
            onChange={(e) =>
              updateFilter('location', e.target.value || undefined)
            }
            className="input-vintage"
          >
            <option value="">{t('allLocations')}</option>
            {locations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-serif text-sm font-bold text-vintage-dark mb-2">
            {t('year')}
          </label>
          <input
            type="number"
            value={filters.year || ''}
            onChange={(e) =>
              updateFilter(
                'year',
                e.target.value ? Number(e.target.value) : undefined
              )
            }
            placeholder="e.g., 1965"
            className="input-vintage"
            min={1900}
            max={2024}
          />
        </div>
      </div>

      <div className="mt-4">
        <label className="block font-serif text-sm font-bold text-vintage-dark mb-2">
          {t('tags')}
        </label>
        <div className="flex flex-wrap gap-2">
          {allTags.slice(0, 12).map((tag) => {
            const active = filters.tags?.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() => {
                  const current = filters.tags || [];
                  const newTags = active
                    ? current.filter((t) => t !== tag)
                    : [...current, tag];
                  updateFilter('tags', newTags.length ? newTags : undefined);
                }}
                className={`px-3 py-1 font-serif text-sm border-2 transition-all rounded-vintage ${
                  active
                    ? 'bg-vintage-brown text-vintage-paper border-vintage-dark'
                    : 'bg-vintage-paper text-vintage-dark border-vintage-dark hover:bg-vintage-sepia'
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
