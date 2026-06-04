import { Lora, Playfair_Display } from 'next/font/google';

export const fontVintage = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-vintage',
  display: 'swap',
  weight: ['400', '700', '900'],
});

export const fontSerif = Lora({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export const fontBody = `${fontVintage.variable} ${fontSerif.variable}`;
