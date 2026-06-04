'use client';

import { Suspense } from 'react';
import { useTranslations } from 'next-intl';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CompareContent } from '@/components/CompareContent';

export default function ComparePage() {
  const t = useTranslations('compare');

  return (
    <main className="min-h-screen">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-5xl font-vintage font-bold text-center mb-4 text-vintage-dark">
          {t('title')}
        </h1>
        <p className="text-center font-serif text-lg text-vintage-brown mb-12">
          {t('description')}
        </p>
        <Suspense fallback={<div className="text-center py-12 font-serif">Loading...</div>}>
          <CompareContent />
        </Suspense>
      </div>
      <Footer />
    </main>
  );
}
