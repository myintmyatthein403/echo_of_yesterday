import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { locales } from '@/i18n';
import { fontBody, fontSerif, fontVintage } from '@/lib/fonts';
import { Atmosphere } from '@/components/Atmosphere';
import { MotionProvider } from '@/components/providers/MotionProvider';
import '../globals.css';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  let normalizedLocale = locale;
  if (normalizedLocale && normalizedLocale.includes('-')) {
    normalizedLocale = normalizedLocale.split('-')[0];
  }

  if (!normalizedLocale || !locales.includes(normalizedLocale as (typeof locales)[number])) {
    return (
      <html lang="en">
        <body>
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <h1>Invalid Locale: {locale}</h1>
            <p>
              The requested locale is not supported. Supported locales:{' '}
              {locales.join(', ')}
            </p>
          </div>
        </body>
      </html>
    );
  }

  const messages = await getMessages();

  return (
    <html
      lang={normalizedLocale}
      className={`${fontBody} ${fontVintage.className}`}
    >
      <body className={`${fontSerif.className} min-h-screen antialiased`}>
        <Atmosphere />
        <NextIntlClientProvider
          locale={normalizedLocale}
          messages={messages}
          timeZone="Asia/Yangon"
        >
          <MotionProvider>{children}</MotionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
