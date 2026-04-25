'use client';

import { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Comment } from '@/types';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorAlert from '@/components/ErrorAlert';

export interface CommentListProps {
  postId: string;
  currentUserId: string;
  onCommentDeleted?: () => void;
}

export default function CommentList({
  postId,
  currentUserId,
  onCommentDeleted,
}: CommentListProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/posts/${postId}/comments`);
      if (!response.ok) throw new Error('Failed to load comments');
      const data = await response.json();
      setComments(data.comments);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load comments';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm('Delete this comment?')) return;

    try {
      const response = await fetch(`/api/posts/${postId}/comments/${commentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete comment');

      setComments(comments.filter((c) => c.id !== commentId));
      if (onCommentDeleted) {
        onCommentDeleted();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete comment';
      setError(errorMessage);
    }
  };

  if (isLoading) return <LoadingSpinner size="small" />;

  if (error) return <ErrorAlert message={error} />;

  if (comments.length === 0) {
    return <p className="text-gray-500 text-sm">No comments yet</p>;
  }

  return (
    <div
      className="space-y-4"
      role="region"
      aria-live="polite"
      aria-label="Comments section"
    >
      {comments.map((comment) => (
        <div key={comment.id} className="flex gap-3">
          <img
            src={comment.author.profilePicture}
            alt={`${comment.author.displayName}'s profile picture`}
            className="w-8 h-8 rounded-full object-cover shrink-0"
          />
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold text-sm text-gray-900">
                  {comment.author.displayName}
                </p>
                <p className="text-xs text-gray-500">@{comment.author.username}</p>
              </div>
              {comment.authorId === currentUserId && (
                <button
                  onClick={() => handleDelete(comment.id)}
                  className="text-gray-500 hover:text-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
                  aria-label="Delete comment"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
            <p className="text-sm text-gray-700 mt-1">{comment.text}</p>
            <p className="text-xs text-gray-400 mt-1">
              {new Date(comment.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
