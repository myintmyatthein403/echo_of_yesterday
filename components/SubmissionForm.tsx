'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { SubmissionForm as SubmissionFormType } from '@/lib/types';
import { categories, eras } from '@/lib/data';

const STEPS = 3;

export function SubmissionForm() {
  const t = useTranslations('submit');

  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<Partial<SubmissionFormType>>({
    title: '',
    description: '',
    year: new Date().getFullYear(),
    location: '',
    category: '',
    tags: [],
    historicalContext: '',
    source: '',
  });
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>(
    'idle'
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const commonTags = [
    'street',
    'urban',
    'people',
    'transportation',
    'market',
    'commerce',
    'traditional',
    'food',
    'architecture',
    'fashion',
  ];

  const handleInputChange = (field: keyof SubmissionFormType, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handleAddTag = (tag: string) => {
    if (tag.trim() && !selectedTags.includes(tag.trim())) {
      const newTags = [...selectedTags, tag.trim()];
      setSelectedTags(newTags);
      handleInputChange('tags', newTags);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    const newTags = selectedTags.filter((t) => t !== tag);
    setSelectedTags(newTags);
    handleInputChange('tags', newTags);
  };

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files?.[0];
      if (file?.type.startsWith('image/')) {
        handleInputChange('image', file);
        setPreviewUrl(URL.createObjectURL(file));
      }
    },
    []
  );

  const validateStep = (): boolean => {
    const e: Record<string, string> = {};
    if (step === 0) {
      if (!formData.title?.trim()) e.title = t('errorRequired');
      if (!formData.description?.trim()) e.description = t('errorRequired');
    }
    if (step === 1) {
      if (!formData.category) e.category = t('errorRequired');
    }
    if (step === 2 && !formData.image) {
      e.image = t('errorRequired');
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (validateStep()) setStep((s) => Math.min(s + 1, STEPS - 1));
  };

  const back = () => setStep((s) => Math.max(s - 1, 0));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep()) return;
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setStep(0);
      setFormData({
        title: '',
        description: '',
        year: new Date().getFullYear(),
        location: '',
        category: '',
        tags: [],
        historicalContext: '',
        source: '',
      });
      setSelectedTags([]);
      setPreviewUrl(null);
    }, 1500);
  };

  const tEras = useTranslations('eras');
  const tCategories = useTranslations('categories');

  return (
    <form onSubmit={handleSubmit} className="card-vintage max-w-2xl mx-auto">
      {submitStatus === 'success' && (
        <div className="bg-vintage-success/15 border-2 border-vintage-success p-4 text-vintage-dark font-serif mb-6">
          {t('thankYou')}
        </div>
      )}

      <div className="flex gap-2 mb-8" aria-label={t('progress')}>
        {Array.from({ length: STEPS }).map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors ${
              i <= step ? 'bg-vintage-brown' : 'bg-vintage-sepia'
            }`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: 0.25 }}
          className="space-y-5"
        >
          {step === 0 && (
            <>
              <h2 className="font-vintage text-xl font-bold text-vintage-dark">
                {t('stepDetails')}
              </h2>
              <div>
                <label className="block font-serif text-sm font-bold mb-2">
                  {t('imageTitle')} *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="input-vintage"
                  aria-invalid={!!errors.title}
                />
                {errors.title && (
                  <p className="text-vintage-error text-xs mt-1">{errors.title}</p>
                )}
              </div>
              <div>
                <label className="block font-serif text-sm font-bold mb-2">
                  {t('descriptionLabel')} *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange('description', e.target.value)
                  }
                  className="input-vintage min-h-[120px]"
                  aria-invalid={!!errors.description}
                />
                {errors.description && (
                  <p className="text-vintage-error text-xs mt-1">
                    {errors.description}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-serif text-sm font-bold mb-2">
                    {t('yearLabel')} *
                  </label>
                  <input
                    type="number"
                    value={formData.year}
                    onChange={(e) =>
                      handleInputChange('year', Number(e.target.value))
                    }
                    className="input-vintage"
                    min={1900}
                    max={new Date().getFullYear()}
                  />
                </div>
                <div>
                  <label className="block font-serif text-sm font-bold mb-2">
                    {t('locationLabel')}
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) =>
                      handleInputChange('location', e.target.value)
                    }
                    className="input-vintage"
                  />
                </div>
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <h2 className="font-vintage text-xl font-bold text-vintage-dark">
                {t('stepContext')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-serif text-sm font-bold mb-2">
                    {t('categoryLabel')} *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      handleInputChange('category', e.target.value)
                    }
                    className="input-vintage"
                    aria-invalid={!!errors.category}
                  >
                    <option value="">{t('selectCategory')}</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {tCategories(cat as never)}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="text-vintage-error text-xs mt-1">
                      {errors.category}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block font-serif text-sm font-bold mb-2">
                    {t('eraLabel')}
                  </label>
                  <select
                    value={formData.era}
                    onChange={(e) => handleInputChange('era', e.target.value)}
                    className="input-vintage"
                  >
                    <option value="">{t('selectEra')}</option>
                    {eras.map((era) => (
                      <option key={era} value={era}>
                        {tEras(era as never)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-serif text-sm font-bold mb-2">
                  {t('tagsLabel')}
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {selectedTags.map((tag) => (
                    <span
                      key={tag}
                      className="chip chip-active flex items-center gap-1"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        aria-label={`Remove ${tag}`}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag(tagInput);
                      }
                    }}
                    className="input-vintage flex-1"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddTag(tagInput)}
                    className="btn-vintage-secondary text-sm"
                  >
                    {t('addTag')}
                  </button>
                </div>
              </div>
              <div>
                <label className="block font-serif text-sm font-bold mb-2">
                  {t('historicalContextLabel')}
                </label>
                <textarea
                  value={formData.historicalContext}
                  onChange={(e) =>
                    handleInputChange('historicalContext', e.target.value)
                  }
                  className="input-vintage min-h-[80px]"
                />
              </div>
              <div>
                <label className="block font-serif text-sm font-bold mb-2">
                  {t('sourceLabel')}
                </label>
                <input
                  type="text"
                  value={formData.source}
                  onChange={(e) => handleInputChange('source', e.target.value)}
                  className="input-vintage"
                />
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="font-vintage text-xl font-bold text-vintage-dark">
                {t('stepImage')}
              </h2>
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={onDrop}
                className="border-2 border-dashed border-vintage-dark/40 rounded-vintage p-8 text-center bg-vintage-sepia/20 hover:bg-vintage-sepia/40 transition-colors"
              >
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt=""
                    className="max-h-48 mx-auto object-contain sepia-filter mb-4"
                  />
                ) : (
                  <p className="font-serif text-vintage-dark/70 mb-4">
                    {t('dropImage')}
                  </p>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleInputChange('image', file);
                      setPreviewUrl(URL.createObjectURL(file));
                    }
                  }}
                  className="input-vintage max-w-xs mx-auto"
                  aria-invalid={!!errors.image}
                />
                {errors.image && (
                  <p className="text-vintage-error text-xs mt-2">{errors.image}</p>
                )}
                <p className="font-serif text-xs text-vintage-dark/50 mt-2">
                  {t('imageFileHint')}
                </p>
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="divider-vintage" />

      <div className="flex justify-between gap-4">
        {step > 0 ? (
          <button type="button" onClick={back} className="btn-vintage-secondary">
            {t('back')}
          </button>
        ) : (
          <span />
        )}
        {step < STEPS - 1 ? (
          <button type="button" onClick={next} className="btn-vintage ml-auto">
            {t('next')}
          </button>
        ) : (
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-vintage ml-auto disabled:opacity-50"
          >
            {isSubmitting ? t('submitting') : t('submitImage')}
          </button>
        )}
      </div>
    </form>
  );
}
