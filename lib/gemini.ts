import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

export interface ImageAnalysis {
  title: string;
  description: string;
  year?: number;
  decade?: string;
  era?: string;
  location?: string;
  category: string;
  tags: string[];
  historicalContext?: string;
}

/**
 * Get language name for Gemini prompt
 */
function getLanguageName(locale: string): string {
  const languageMap: Record<string, string> = {
    'my': 'Myanmar (Burmese)',
    'en': 'English',
    'zh': 'Chinese (Simplified)',
    'de': 'German',
  };
  return languageMap[locale] || 'English';
}

/**
 * Analyze an image using Gemini 2.5 Flash and extract information
 */
export async function analyzeImageWithGemini(
  imagePath: string,
  imageBuffer?: Buffer | ArrayBuffer,
  locale: string = 'en'
): Promise<ImageAnalysis> {
  try {
    // Use Gemini 2.5 Flash
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash' // Gemini 2.5 Flash
    });

    // Prepare image data
    let imageData;
    if (imageBuffer) {
      // Convert ArrayBuffer or Buffer to base64
      let base64Data: string;
      if (imageBuffer instanceof ArrayBuffer) {
        const buffer = Buffer.from(imageBuffer);
        base64Data = buffer.toString('base64');
      } else if (Buffer.isBuffer(imageBuffer)) {
        base64Data = imageBuffer.toString('base64');
      } else {
        base64Data = Buffer.from(imageBuffer as any).toString('base64');
      }

      imageData = {
        inlineData: {
          data: base64Data,
          mimeType: 'image/jpeg',
        },
      };
    } else {
      // For local file paths, we'll need to read the file
      // This is a placeholder - in production, you'd read the actual file
      throw new Error('Image buffer required for analysis');
    }

    const languageName = getLanguageName(locale);
    
    const prompt = `Analyze this historical image from Myanmar and provide detailed information in ${languageName} language. Respond in the following JSON format:

{
  "title": "A descriptive title for the image in ${languageName}",
  "description": "A detailed description of what is shown in the image in ${languageName}",
  "year": estimated year (number, if visible or can be inferred),
  "decade": "decade like 1950s, 1960s, etc. in ${languageName}",
  "era": "one of: Pre-Colonial, Colonial Era, Post-Independence, Socialist Era, Modern Era (translate to ${languageName} if needed)",
  "location": "location name if visible (e.g., Yangon, Mandalay, Bagan) in ${languageName}",
  "category": "one of: Urban Life, Rural Life, Fashion, Commerce, Transportation, Architecture, Entertainment, Education, Religion, Other (translate to ${languageName})",
  "tags": ["array", "of", "relevant", "tags", "in", "${languageName}"],
  "historicalContext": "Detailed historical context and significance of this image in ${languageName}"
}

IMPORTANT: All text fields (title, description, era, location, category, tags, historicalContext) must be in ${languageName} language.

Focus on:
- What is shown in the image (people, buildings, objects, activities)
- Time period indicators (clothing, vehicles, architecture style, technology)
- Location indicators (signs, architecture, landscape)
- Historical significance
- Cultural context

Respond ONLY with valid JSON, no additional text. All text content must be in ${languageName}.`;

    const result = await model.generateContent([prompt, imageData]);
    const response = await result.response;
    const text = response.text();

    // Parse JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }

    const analysis = JSON.parse(jsonMatch[0]) as ImageAnalysis;

    // Validate and set defaults
    return {
      title: analysis.title || 'Untitled Image',
      description: analysis.description || '',
      year: analysis.year,
      decade: analysis.decade || getDecadeFromYear(analysis.year),
      era: analysis.era || 'Post-Independence',
      location: analysis.location,
      category: analysis.category || 'Other',
      tags: analysis.tags || [],
      historicalContext: analysis.historicalContext,
    };
  } catch (error) {
    console.error('Error analyzing image with Gemini:', error);
    throw error;
  }
}

/**
 * Analyze image from URL (for client-side usage)
 */
export async function analyzeImageFromUrl(imageUrl: string, locale: string = 'en'): Promise<ImageAnalysis> {
  try {
    let arrayBuffer: ArrayBuffer;

    // Check if it's a relative URL (starts with /)
    if (imageUrl.startsWith('/')) {
      // Server-side: Read from filesystem
      const fs = await import('fs');
      const path = await import('path');
      
      // Remove leading slash and construct full path
      const imagePath = imageUrl.replace(/^\//, '');
      const fullPath = path.join(process.cwd(), 'public', imagePath);
      
      // Check if file exists
      if (!fs.existsSync(fullPath)) {
        throw new Error(`Image file not found: ${fullPath}`);
      }
      
      // Read file from filesystem
      const fileBuffer = fs.readFileSync(fullPath);
      arrayBuffer = fileBuffer.buffer;
    } else {
      // Absolute URL: Fetch from network
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`);
      }
      arrayBuffer = await response.arrayBuffer();
    }
    
    return await analyzeImageWithGemini(imageUrl, arrayBuffer, locale);
  } catch (error) {
    console.error('Error fetching image for analysis:', error);
    throw error;
  }
}

/**
 * Helper function to get decade from year
 */
function getDecadeFromYear(year?: number): string {
  if (!year) return 'Unknown';
  const decade = Math.floor(year / 10) * 10;
  return `${decade}s`;
}

