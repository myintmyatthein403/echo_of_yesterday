import Link from 'next/link';

export default function GlobalNotFound() {
  return (
    <html lang="my">
      <body
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Georgia, serif',
          background: '#f3ead7',
          color: '#3b2f23',
          textAlign: 'center',
          padding: '2rem',
        }}
      >
        <h1 style={{ fontSize: '4rem', margin: 0 }}>404</h1>
        <p style={{ fontSize: '1.25rem', margin: '0.5rem 0 1.5rem' }}>
          This page has been lost in time.
        </p>
        <Link href="/my" style={{ color: '#7a5230', textDecoration: 'underline' }}>
          Return home
        </Link>
      </body>
    </html>
  );
}
