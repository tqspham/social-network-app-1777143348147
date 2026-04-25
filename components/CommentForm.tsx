'use client';

import { useState } from 'react';
import ErrorAlert from '@/components/ErrorAlert';
import SuccessAlert from '@/components/SuccessAlert';

export interface CommentFormProps {
  postId: string;
  onSuccess?: () => void;
}

export default function CommentForm({ postId, onSuccess }: CommentFormProps) {
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [textError, setTextError] = useState<string | null>(null);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setText(value);
    if (value.length === 0) {
      setTextError('Comment text is required');
    } else if (value.length > 300) {
      setTextError('Comment must be 300 characters or less');
    } else {
      setTextError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (text.trim().length === 0) {
      setTextError('Comment text is required');
      return;
    }

    if (text.length > 300) {
      setTextError('Comment must be 300 characters or less');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to create comment');
        return;
      }

      setSuccess('Comment posted!');
      setText('');
      if (onSuccess) {
        setTimeout(onSuccess, 500);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label htmlFor="comment-text" className="block text-sm font-medium text-gray-700 mb-2">
          Add a comment
        </label>
        <textarea
          id="comment-text"
          value={text}
          onChange={handleTextChange}
          placeholder="Share your thoughts..."
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          aria-label="Comment text"
        />
        {textError && <p className="text-red-500 text-sm mt-1">{textError}</p>}
        <p className="text-xs text-gray-500 mt-1">{text.length}/300</p>
      </div>

      {error && <ErrorAlert message={error} />}
      {success && <SuccessAlert message={success} />}

      <button
        type="submit"
        disabled={isLoading || text.trim().length === 0}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-3 rounded-lg transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        {isLoading ? 'Posting...' : 'Comment'}
      </button>
    </form>
  );
}
