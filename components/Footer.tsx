'use client';

import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';

export function Footer() {
  const t = useTranslations('common');
  const tFooter = useTranslations('footer');
  const locale = useLocale();

  return (
    <footer className="bg-vintage-dark text-vintage-paper py-14 px-4 mt-24 border-t-4 border-vintage-brown">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          <div>
            <h3 className="font-vintage text-2xl font-bold mb-3">
              {tFooter('title')}
            </h3>
            <p className="font-serif text-sm opacity-90 leading-relaxed">
              {tFooter('tagline')}
            </p>
          </div>
          <div>
            <h4 className="font-serif text-sm font-bold uppercase tracking-wider mb-4 opacity-80">
              {tFooter('quickLinks')}
            </h4>
            <ul className="space-y-2 font-serif text-sm">
              <li>
                <Link
                  href={`/${locale}/timeline`}
                  className="hover:text-vintage-accent transition-colors"
                >
                  {t('timeline')}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/archive`}
                  className="hover:text-vintage-accent transition-colors"
                >
                  {t('archive')}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/scrapbook`}
                  className="hover:text-vintage-accent transition-colors"
                >
                  {t('scrapbook')}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/compare`}
                  className="hover:text-vintage-accent transition-colors"
                >
                  {t('compare')}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/submit`}
                  className="hover:text-vintage-accent transition-colors"
                >
                  {t('submit')}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-serif text-sm font-bold uppercase tracking-wider mb-4 opacity-80">
              {tFooter('about')}
            </h4>
            <p className="font-serif text-sm opacity-90 leading-relaxed">
              {tFooter('aboutText')}
            </p>
          </div>
        </div>
        <div className="border-t border-vintage-paper/15 pt-8 text-center">
          <p className="font-serif text-sm opacity-75">
            {tFooter('copyright', { year: new Date().getFullYear() })}
          </p>
        </div>
      </div>
    </footer>
  );
}
