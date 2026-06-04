import { NextRequest, NextResponse } from 'next/server';
import { analyzeImageFromUrl } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const { imageUrl, locale = 'en' } = await request.json();

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Image URL is required' },
        { status: 400 }
      );
    }

    // Check if API key is configured
    if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      );
    }

    const analysis = await analyzeImageFromUrl(imageUrl, locale);

    return NextResponse.json({ success: true, data: analysis });
  } catch (error: any) {
    console.error('Error in analyze-image API:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to analyze image' },
      { status: 500 }
    );
  }
}

