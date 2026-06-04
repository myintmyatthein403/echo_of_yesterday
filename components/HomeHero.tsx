'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import type { ImageItem } from '@/lib/types';
import { getLocalizedTitle } from '@/lib/data-utils';

interface HomeHeroProps {
  featured: ImageItem;
  stats: { images: number; eras: number; decades: number };
}

export function HomeHero({ featured, stats }: HomeHeroProps) {
  const t = useTranslations('home');
  const locale = useLocale();
  const reduced = useReducedMotion();
  const featuredTitle = getLocalizedTitle(featured, locale);

  const container = {
    hidden: {},
    visible: {
      transition: { staggerChildren: reduced ? 0 : 0.12 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: reduced ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  return (
    <section className="relative py-16 md:py-24 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-vintage-sepia/30 via-transparent to-transparent pointer-events-none" />
      <div className="max-w-7xl mx-auto relative">
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="grid lg:grid-cols-2 gap-12 items-center"
        >
          <div>
            <motion.p
              variants={item}
              className="font-serif text-sm uppercase tracking-[0.2em] text-vintage-brown mb-4"
            >
              {t('subtitle')}
            </motion.p>
            <motion.h1
              variants={item}
              className="font-vintage text-display-md md:text-display-lg font-bold text-vintage-ink mb-6"
            >
              {t('title')}
            </motion.h1>
            <motion.p
              variants={item}
              className="font-serif text-lg text-vintage-dark/85 max-w-xl mb-8 leading-relaxed"
            >
              {t('description')}
            </motion.p>
            <motion.div variants={item} className="flex flex-wrap gap-4 mb-10">
              <Link href={`/${locale}/timeline`} className="btn-vintage">
                {t('exploreTimeline')}
              </Link>
              <Link
                href={`/${locale}/archive`}
                className="btn-vintage-secondary"
              >
                {t('browseArchive')}
              </Link>
            </motion.div>
            <motion.div
              variants={item}
              className="flex flex-wrap gap-6 font-serif text-sm text-vintage-brown"
            >
              <span>
                <strong className="text-vintage-dark text-lg font-vintage">
                  {stats.images}
                </strong>{' '}
                {t('statImages')}
              </span>
              <span>
                <strong className="text-vintage-dark text-lg font-vintage">
                  {stats.eras}
                </strong>{' '}
                {t('statEras')}
              </span>
              <span>
                <strong className="text-vintage-dark text-lg font-vintage">
                  {stats.decades}
                </strong>{' '}
                {t('statDecades')}
              </span>
            </motion.div>
          </div>

          <motion.div variants={item} className="relative">
            <p className="font-serif text-xs uppercase tracking-widest text-vintage-brown mb-3 text-center lg:text-left">
              {t('photoOfDay')}
            </p>
            <Link
              href={`/${locale}/image/${featured.id}`}
              className="polaroid block max-w-md mx-auto lg:mx-0 lg:ml-auto rotate-1 hover:rotate-0 transition-transform duration-500"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-vintage-sepia mb-4">
                <motion.div
                  className="absolute inset-0"
                  initial={reduced ? false : { filter: 'sepia(1) brightness(0.85)' }}
                  animate={{ filter: 'sepia(0.35) contrast(1.05) brightness(1)' }}
                  transition={{ duration: 1.2, delay: 0.3 }}
                >
                  <Image
                    src={featured.imageUrl}
                    alt={featuredTitle}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 400px"
                    priority
                  />
                </motion.div>
              </div>
              <p className="font-vintage text-lg font-bold text-vintage-dark text-center px-2">
                {featuredTitle}
              </p>
              <p className="font-serif text-sm text-vintage-brown text-center mt-1">
                {featured.year}
              </p>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
