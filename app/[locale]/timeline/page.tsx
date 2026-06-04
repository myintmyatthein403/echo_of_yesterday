import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Timeline } from '@/components/Timeline';
import { getTranslations } from 'next-intl/server';

export default async function TimelinePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('timeline');

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

        <Timeline />
      </div>

      <Footer />
    </main>
  );
}

