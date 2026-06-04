'use client';

import Link from 'next/link';
import { Suspense, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { SepiaToggle } from './SepiaToggle';
import { LanguageSwitcher } from './LanguageSwitcher';
import { CommandPalette } from './CommandPalette';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const t = useTranslations('common');
  const tHeader = useTranslations('header');
  const locale = useLocale();
  const reduced = useReducedMotion();

  const navLinks = [
    { href: `/${locale}/timeline`, label: t('timeline') },
    { href: `/${locale}/archive`, label: t('archive') },
    { href: `/${locale}/compare`, label: t('compare') },
    { href: `/${locale}/scrapbook`, label: t('scrapbook') },
    { href: `/${locale}/submit`, label: t('submit') },
  ];

  return (
    <header className="sticky top-0 z-50 border-b-2 border-vintage-dark/80 bg-vintage-paper/90 backdrop-blur-md shadow-vintage-sm">
      <nav className="max-w-7xl mx-auto px-4 py-3" aria-label="Main">
        <div className="flex items-center justify-between gap-4">
          <Link
            href={`/${locale}`}
            className="font-vintage text-xl md:text-2xl font-bold text-vintage-dark hover:text-vintage-brown transition-colors shrink-0"
          >
            {tHeader('title')}
          </Link>

          <div className="hidden lg:flex items-center gap-5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-serif text-sm text-vintage-dark hover:text-vintage-brown transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-vintage-brown hover:after:w-full after:transition-all"
              >
                {link.label}
              </Link>
            ))}
            <CommandPalette />
            <Suspense fallback={null}>
              <LanguageSwitcher />
            </Suspense>
            <SepiaToggle />
          </div>

          <div className="flex lg:hidden items-center gap-2">
            <CommandPalette />
            <button
              type="button"
              className="btn-vintage-secondary text-sm py-2 px-3"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-nav"
            >
              {t('menu')}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              id="mobile-nav"
              className="lg:hidden overflow-hidden border-t border-vintage-dark/20 mt-3 pt-3"
              initial={reduced ? false : { height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <div className="space-y-2 pb-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block font-serif py-2 text-vintage-dark hover:text-vintage-brown"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="pt-2 flex items-center gap-4">
                  <Suspense fallback={null}>
                    <LanguageSwitcher />
                  </Suspense>
                  <SepiaToggle />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
