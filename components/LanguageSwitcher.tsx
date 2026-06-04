'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import { locales, type Locale } from '@/i18n';

const languageNames: Record<Locale, string> = {
  my: 'မြန်မာ',
  en: 'English',
  zh: '中文',
  de: 'Deutsch',
};

export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const locale = useLocale() as Locale;

  const switchLanguage = (newLocale: Locale) => {
    if (newLocale === locale) return;
    
    // Get current path without locale
    // In next-intl with localePrefix: 'always', the pathname usually starts with /locale
    const segments = pathname.split('/').filter(Boolean);
    
    // Check if first segment is a locale
    let pathWithoutLocale = '';
    if (segments.length > 0 && locales.includes(segments[0] as Locale)) {
      // Remove locale from path
      pathWithoutLocale = '/' + segments.slice(1).join('/');
    } else {
      // No locale in path (should not happen with localePrefix: 'always', but just in case)
      pathWithoutLocale = pathname;
    }
    
    // Ensure we have at least /
    if (pathWithoutLocale === '') {
      pathWithoutLocale = '/';
    }
    
    // Build new path with new locale
    const newPath = pathWithoutLocale === '/' 
      ? `/${newLocale}` 
      : `/${newLocale}${pathWithoutLocale}`;
    
    // Append search params if they exist
    const queryString = searchParams.toString();
    const finalPath = queryString ? `${newPath}?${queryString}` : newPath;
    
    // Debug: Log navigation
    if (process.env.NODE_ENV === 'development') {
      console.log('[LanguageSwitcher] Switching to:', finalPath);
    }
    
    // Navigate to new locale
    // Using window.location.href for a full reload to ensure all states are reset properly
    window.location.href = finalPath;
  };

  return (
    <div className="relative inline-block">
      <select
        value={locale}
        onChange={(e) => switchLanguage(e.target.value as Locale)}
        className="input-vintage text-sm py-1 px-3 cursor-pointer appearance-none pr-8 bg-vintage-paper"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%235c4a37' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 0.5rem center',
          backgroundSize: '12px',
        }}
      >
        {locales.map((loc) => (
          <option key={loc} value={loc}>
            {languageNames[loc]}
          </option>
        ))}
      </select>
    </div>
  );
}

