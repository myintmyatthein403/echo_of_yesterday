import { getTranslations } from 'next-intl/server';
import { Timeline } from '@/components/Timeline';
import { ArchivePreview } from '@/components/ArchivePreview';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { HomeHero } from '@/components/HomeHero';
import { Reveal } from '@/components/motion/Reveal';
import { sampleImages, eras, decades } from '@/lib/data';

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;
  const tTimeline = await getTranslations('timeline');
  const tArchive = await getTranslations('archive');

  const featured =
    sampleImages[Math.floor(Date.now() / 86400000) % sampleImages.length];

  return (
    <main className="min-h-screen">
      <Header />

      <HomeHero
        featured={featured}
        stats={{
          images: sampleImages.length,
          eras: eras.length,
          decades: decades.length,
        }}
      />

      <section className="py-16 px-4 bg-vintage-sepia/25 border-y border-vintage-dark/10">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <h2 className="font-vintage text-display-sm font-bold text-center mb-12 text-vintage-dark">
              {tTimeline('title')}
            </h2>
          </Reveal>
          <Timeline preview={true} />
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <h2 className="font-vintage text-display-sm font-bold text-center mb-12 text-vintage-dark">
              {tArchive('title')}
            </h2>
          </Reveal>
          <ArchivePreview />
        </div>
      </section>

      <Footer />
    </main>
  );
}
