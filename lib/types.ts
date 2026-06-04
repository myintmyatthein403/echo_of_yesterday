export interface ImageItem {
  id: string;
  title: string | Record<string, string>; // Support both string and multi-language object
  description: string | Record<string, string>;
  year: number;
  decade: string;
  era: string;
  location?: string | Record<string, string>;
  category: string | Record<string, string>;
  tags: string[] | Record<string, string[]>;
  imageUrl: string;
  thumbnailUrl: string;
  historicalContext?: string | Record<string, string>;
  source?: string | Record<string, string>;
  beforeImageId?: string;
  afterImageId?: string;
}

export interface Comment {
  id: string;
  imageId: string;
  author: string;
  content: string;
  timestamp: Date;
}

export interface TimelineEntry {
  year: number;
  decade: string;
  images: ImageItem[];
}

export interface FilterOptions {
  era?: string;
  category?: string;
  location?: string;
  decade?: string;
  year?: number;
  tags?: string[];
}

export interface SubmissionForm {
  title: string;
  description: string;
  year: number;
  location?: string;
  category: string;
  tags: string[];
  image?: File;
  historicalContext?: string;
  source?: string;
  era?: string;
}

