import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ImageDetail } from '@/components/ImageDetail';
import { ImageAnalyzer } from '@/components/ImageAnalyzer';
import { sampleImages } from '@/lib/data';
import { getLocalizedDescription, getLocalizedTitle } from '@/lib/data-utils';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

type Props = {
  params: Promise<{ locale: string; id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, id } = await params;
  const image = sampleImages.find((img) => img.id === id);
  if (!image) return { title: 'Not Found' };

  const title = getLocalizedTitle(image, locale);
  const description = getLocalizedDescription(image, locale);

  return {
    title,
    description: description.slice(0, 160),
    openGraph: {
      title,
      description: description.slice(0, 160),
      images: [
        {
          url: image.imageUrl.startsWith('/')
            ? image.imageUrl
            : image.imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
  };
}

export default async function ImagePage({ params }: Props) {
  const { id } = await params;
  const image = sampleImages.find((img) => img.id === id);

  if (!image) {
    notFound();
  }

  return (
    <main className="min-h-screen">
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-12">
        <ImageDetail image={image} />
        <div className="mt-8">
          <ImageAnalyzer imageUrl={image.imageUrl} />
        </div>
      </div>
      <Footer />
    </main>
  );
}
