'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import {
  EMPTY_COMMENTS,
  useCommentStore,
} from '@/lib/stores/useCommentStore';
import { useHydrated } from '@/lib/stores/useHydrated';

interface CommentSectionProps {
  imageId: string;
}

export function CommentSection({ imageId }: CommentSectionProps) {
  const t = useTranslations('comments');
  const locale = useLocale();
  const hydrated = useHydrated();
  const comments = useCommentStore(
    (state) => state.commentsByImage[imageId] ?? EMPTY_COMMENTS
  );
  const addComment = useCommentStore((state) => state.addComment);
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !content.trim()) return;

    setIsSubmitting(true);
    addComment(imageId, author, content);
    setAuthor('');
    setContent('');
    setIsSubmitting(false);
  };

  const formatDate = (date: Date) => {
    try {
      return new Date(date).toLocaleDateString(locale === 'my' ? 'my-MM' : locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (e) {
      return new Date(date).toLocaleDateString('en-US');
    }
  };

  return (
    <div className="card-vintage">
      <h2 className="font-vintage text-3xl font-bold text-vintage-dark mb-6">
        {t('title')}
      </h2>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <div>
          <label className="block font-serif text-sm font-bold text-vintage-dark mb-2">
            {t('yourName')}
          </label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="input-vintage font-typewriter"
            placeholder={t('yourNamePlaceholder')}
            required
          />
        </div>
        <div>
          <label className="block font-serif text-sm font-bold text-vintage-dark mb-2">
            {t('yourMemory')}
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="input-vintage font-typewriter min-h-[120px] resize-y"
            placeholder={t('yourMemoryPlaceholder')}
            required
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-vintage disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? t('submitting') : t('shareMemory')}
        </button>
      </form>

      {/* Comments List */}
      <div className="space-y-6">
        {!hydrated ? null : comments.length === 0 ? (
          <p className="font-serif text-vintage-dark/60 text-center py-8">
            {t('noMemories')}
          </p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="border-l-4 border-vintage-brown pl-4 py-2 bg-vintage-sepia/30"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="font-typewriter font-bold text-vintage-dark">
                  {comment.author}
                </span>
                <span className="font-serif text-sm text-vintage-brown">
                  {formatDate(comment.timestamp)}
                </span>
              </div>
              <p className="font-typewriter text-vintage-dark/90 leading-relaxed whitespace-pre-wrap">
                {comment.content}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
