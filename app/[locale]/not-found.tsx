import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function NotFound() {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-6xl font-vintage font-bold text-vintage-dark mb-4">
          404
        </h1>
        <p className="text-2xl font-serif text-vintage-brown mb-8">
          Page Not Found
        </p>
        <p className="font-serif text-lg text-vintage-dark/80 mb-12">
          The page you&apos;re looking for seems to have been lost in time...
        </p>
        <Link href="/" className="btn-vintage">
          Return Home
        </Link>
      </div>
      <Footer />
    </main>
  );
}

