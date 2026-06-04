import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Comment } from '@/lib/types';

interface CommentState {
  /** Comments grouped by image id. */
  commentsByImage: Record<string, Comment[]>;
  getComments: (imageId: string) => Comment[];
  addComment: (imageId: string, author: string, content: string) => void;
}

export const EMPTY_COMMENTS: Comment[] = [];

/**
 * Visitor memories ("comments") persisted to localStorage via Zustand's
 * persist middleware. This replaces the ad-hoc localStorage reads/writes that
 * previously lived inside the comment component.
 */
export const useCommentStore = create<CommentState>()(
  persist(
    (set, get) => ({
      commentsByImage: {},
      getComments: (imageId) => get().commentsByImage[imageId] ?? EMPTY_COMMENTS,
      addComment: (imageId, author, content) =>
        set((state) => {
          const newComment: Comment = {
            id: Date.now().toString(),
            imageId,
            author: author.trim(),
            content: content.trim(),
            timestamp: new Date(),
          };
          const existing = state.commentsByImage[imageId] ?? [];
          return {
            commentsByImage: {
              ...state.commentsByImage,
              [imageId]: [newComment, ...existing],
            },
          };
        }),
    }),
    {
      name: 'eoy-comments',
    }
  )
);
