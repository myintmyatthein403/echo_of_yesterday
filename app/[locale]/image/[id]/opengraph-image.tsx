import { ImageResponse } from 'next/og';
import { sampleImages } from '@/lib/data';
import { getLocalizedTitle } from '@/lib/data-utils';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

type Props = { params: Promise<{ locale: string; id: string }> };

export default async function ImageOg({ params }: Props) {
  const { locale, id } = await params;
  const image = sampleImages.find((img) => img.id === id);
  const title = image
    ? getLocalizedTitle(image, locale)
    : 'Echoes of Yesterday';
  const year = image?.year ?? '';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: 64,
          background: '#f4f1e8',
          border: '12px solid #5c4a37',
        }}
      >
        <div
          style={{
            fontSize: 28,
            color: '#8b6f47',
            marginBottom: 16,
            fontFamily: 'serif',
          }}
        >
          Echoes of Yesterday · {year}
        </div>
        <div
          style={{
            fontSize: 56,
            fontWeight: 700,
            color: '#3d3024',
            lineHeight: 1.15,
            maxWidth: '90%',
            fontFamily: 'serif',
          }}
        >
          {title}
        </div>
        <div
          style={{
            marginTop: 32,
            fontSize: 22,
            color: '#8b6f47',
            fontFamily: 'serif',
          }}
        >
          မနေ့ကရဲ့ ပဲ့တင်သံ
        </div>
      </div>
    ),
    { ...size }
  );
}
