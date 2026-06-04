'use client';

import { useTranslations } from 'next-intl';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SubmissionForm } from '@/components/SubmissionForm';

export default function SubmitPage() {
  const t = useTranslations('submit');

  return (
    <main className="min-h-screen">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-5xl font-vintage font-bold text-center mb-4 text-vintage-dark">
          {t('title')}
        </h1>
        <p className="text-center font-serif text-lg text-vintage-brown mb-12">
          {t('description')}
        </p>

        <SubmissionForm />
      </div>

      <Footer />
    </main>
  );
}

