/**
 * Utility function to generate placeholder image URLs
 * In production, replace these with actual image paths
 */
export function getPlaceholderImage(title: string, width = 800, height = 600): string {
  const encodedTitle = encodeURIComponent(title.substring(0, 30));
  return `data:image/svg+xml,%3Csvg width='${width}' height='${height}' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='paper' x='0' y='0' width='40' height='40' patternUnits='userSpaceOnUse'%3E%3Crect width='40' height='40' fill='%23f4f1e8'/%3E%3Cpath d='M0 20h40M20 0v40' stroke='%23d4c5a9' stroke-width='0.5' opacity='0.3'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23paper)'/%3E%3Crect x='10' y='10' width='calc(100%25-20px)' height='calc(100%25-20px)' fill='%23d4c5a9' stroke='%238b6f47' stroke-width='3'/%3E%3Ctext x='50%25' y='45%25' font-family='Georgia, serif' font-size='24' fill='%235c4a37' text-anchor='middle' dominant-baseline='middle' font-weight='bold'%3E${encodedTitle}%3C/text%3E%3Ctext x='50%25' y='55%25' font-family='Georgia, serif' font-size='16' fill='%238b6f47' text-anchor='middle' dominant-baseline='middle'%3EHistorical Image%3C/text%3E%3C/svg%3E`;
}

export function getPlaceholderThumbnail(title: string): string {
  return getPlaceholderImage(title, 400, 300);
}

