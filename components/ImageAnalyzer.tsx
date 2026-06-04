'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { ImageAnalysis } from '@/lib/gemini';

interface ImageAnalyzerProps {
  imageUrl: string;
  onAnalysisComplete?: (analysis: ImageAnalysis) => void;
}

export function ImageAnalyzer({ imageUrl, onAnalysisComplete }: ImageAnalyzerProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ImageAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const locale = useLocale();
  const t = useTranslations('ai');
  const tImage = useTranslations('image');

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setError(null);

    try {
      const response = await fetch('/api/analyze-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageUrl, locale }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze image');
      }

      setAnalysis(data.data);
      if (onAnalysisComplete) {
        onAnalysisComplete(data.data);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="card-vintage space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-vintage text-xl font-bold text-vintage-dark">
          {t('title')}
        </h3>
        <button
          onClick={handleAnalyze}
          disabled={isAnalyzing}
          className="btn-vintage disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAnalyzing ? t('analyzing') : t('analyze')}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border-2 border-red-600 p-4 text-red-800 font-serif space-y-2">
          <p className="font-bold">Error: {error}</p>
          {error.includes('API key') && (
            <div className="mt-2 text-sm space-y-1">
              <p>To fix this:</p>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li>Create a <code className="bg-red-200 px-1">.env.local</code> file in the project root</li>
                <li>Add: <code className="bg-red-200 px-1">NEXT_PUBLIC_GEMINI_API_KEY=your_key_here</code></li>
                <li>Get API key from: <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Google AI Studio</a></li>
                <li>Restart the dev server</li>
              </ol>
              <p className="mt-2 text-xs">See SETUP_API_KEY.md for detailed instructions.</p>
            </div>
          )}
        </div>
      )}

      {analysis && (
        <div className="space-y-4 mt-4">
          <div>
            <h4 className="font-serif font-bold text-vintage-dark mb-2">{tImage('title')}:</h4>
            <p className="font-serif text-vintage-dark/90">{analysis.title}</p>
          </div>

          <div>
            <h4 className="font-serif font-bold text-vintage-dark mb-2">{tImage('description')}:</h4>
            <p className="font-serif text-vintage-dark/90">{analysis.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {analysis.year && (
              <div>
                <h4 className="font-serif font-bold text-vintage-dark mb-1">{tImage('year')}:</h4>
                <p className="font-serif text-vintage-dark/90">{analysis.year}</p>
              </div>
            )}
            {analysis.decade && (
              <div>
                <h4 className="font-serif font-bold text-vintage-dark mb-1">{tImage('decade')}:</h4>
                <p className="font-serif text-vintage-dark/90">{analysis.decade}</p>
              </div>
            )}
            {analysis.era && (
              <div>
                <h4 className="font-serif font-bold text-vintage-dark mb-1">{tImage('era')}:</h4>
                <p className="font-serif text-vintage-dark/90">{analysis.era}</p>
              </div>
            )}
            {analysis.location && (
              <div>
                <h4 className="font-serif font-bold text-vintage-dark mb-1">{tImage('location')}:</h4>
                <p className="font-serif text-vintage-dark/90">{analysis.location}</p>
              </div>
            )}
            {analysis.category && (
              <div>
                <h4 className="font-serif font-bold text-vintage-dark mb-1">{tImage('category')}:</h4>
                <p className="font-serif text-vintage-dark/90">{analysis.category}</p>
              </div>
            )}
          </div>

          {analysis.tags && analysis.tags.length > 0 && (
            <div>
              <h4 className="font-serif font-bold text-vintage-dark mb-2">{t('tags')}:</h4>
              <div className="flex flex-wrap gap-2">
                {analysis.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-vintage-sepia text-vintage-dark font-serif border border-vintage-dark"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {analysis.historicalContext && (
            <div>
              <h4 className="font-serif font-bold text-vintage-dark mb-2">{tImage('historicalContext')}:</h4>
              <p className="font-serif text-vintage-dark/90 leading-relaxed">
                {analysis.historicalContext}
              </p>
            </div>
          )}

          {onAnalysisComplete && (
            <button
              onClick={() => onAnalysisComplete(analysis)}
              className="btn-vintage-secondary w-full"
            >
              {t('useAnalysis')}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

