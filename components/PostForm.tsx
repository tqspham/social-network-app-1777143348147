'use client';

import { useState } from 'react';
import { ImagePlus } from 'lucide-react';
import SuccessAlert from '@/components/SuccessAlert';
import ErrorAlert from '@/components/ErrorAlert';

export interface PostFormProps {
  onSuccess?: () => void;
}

export default function PostForm({ onSuccess }: PostFormProps) {
  const [text, setText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [textError, setTextError] = useState<string | null>(null);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setText(value);
    if (value.length === 0) {
      setTextError('Post text is required');
    } else if (value.length > 500) {
      setTextError('Post must be 500 characters or less');
    } else {
      setTextError(null);
    }
  };

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (text.trim().length === 0) {
      setTextError('Post text is required');
      return;
    }

    if (text.length > 500) {
      setTextError('Post must be 500 characters or less');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: text.trim(),
          image: imageUrl.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to create post');
        return;
      }

      setSuccess('Post created successfully!');
      setText('');
      setImageUrl('');
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
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-200"
    >
      <div className="space-y-4">
        <div>
          <label htmlFor="post-text" className="block text-sm font-medium text-gray-700 mb-2">
            What's on your mind?
          </label>
          <textarea
            id="post-text"
            value={text}
            onChange={handleTextChange}
            placeholder="Share your thoughts..."
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            aria-label="Post text content"
          />
          {textError && <p className="text-red-500 text-sm mt-1">{textError}</p>}
          <p className="text-xs text-gray-500 mt-1">{text.length}/500</p>
        </div>

        <div>
          <label htmlFor="image-url" className="block text-sm font-medium text-gray-700 mb-2">
            <ImagePlus className="inline-block w-4 h-4 mr-2" />
            Image URL (optional)
          </label>
          <input
            id="image-url"
            type="url"
            value={imageUrl}
            onChange={handleImageUrlChange}
            placeholder="https://example.com/image.jpg"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            aria-label="Image URL for post"
          />
        </div>
      </div>

      {error && <ErrorAlert message={error} />}
      {success && <SuccessAlert message={success} />}

      <button
        type="submit"
        disabled={isLoading || text.trim().length === 0}
        className="w-full mt-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        {isLoading ? 'Posting...' : 'Post'}
      </button>
    </form>
  );
}
