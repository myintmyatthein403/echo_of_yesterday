import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'မနေ့ကရဲ့ ပဲ့တင်သံ | Echoes of Yesterday',
  description: 'A vintage web archive showcasing Myanmar\'s cultural and historical changes through images, advertisements, and records.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
