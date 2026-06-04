import Image from 'next/image';

interface PlaceholderImageProps {
  alt: string;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
}

export function PlaceholderImage({ 
  alt, 
  className = '', 
  fill = false,
  width,
  height,
  sizes 
}: PlaceholderImageProps) {
  // Generate a placeholder image using a service or create a simple SVG
  const placeholderUrl = `data:image/svg+xml,%3Csvg width='400' height='300' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='400' height='300' fill='%23d4c5a9'/%3E%3Ctext x='50%25' y='50%25' font-family='serif' font-size='18' fill='%238b6f47' text-anchor='middle' dominant-baseline='middle'%3E${encodeURIComponent(alt)}%3C/text%3E%3C/svg%3E`;

  if (fill) {
    return (
      <Image
        src={placeholderUrl}
        alt={alt}
        fill
        className={className}
        sizes={sizes}
      />
    );
  }

  return (
    <Image
      src={placeholderUrl}
      alt={alt}
      width={width || 400}
      height={height || 300}
      className={className}
      sizes={sizes}
    />
  );
}

