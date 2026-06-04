import { getRequestConfig } from 'next-intl/server';

export const locales = ['my', 'en', 'zh', 'de'] as const;
export type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  // Normalize locale (e.g., 'en-US' -> 'en')
  if (locale && locale.includes('-')) {
    locale = locale.split('-')[0];
  }

  // Validate locale - middleware handles invalid locales, but add safety
  if (!locale || !locales.includes(locale as Locale)) {
    locale = 'my';
  }

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
