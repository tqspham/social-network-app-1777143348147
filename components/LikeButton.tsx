'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';

export interface LikeButtonProps {
  postId: string;
  liked: boolean;
  count: number;
  onToggle?: () => void;
  ariaLabel: string;
}

export default function LikeButton({
  postId,
  liked: initialLiked,
  count: initialCount,
  onToggle,
  ariaLabel,
}: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [isLoading, setIsLoading] = useState(false);

  const handleLike = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(`/api/posts/${postId}/likes`, {
        method: 'POST',
      });

      if (response.ok) {
        const data = await response.json();
        setLiked(data.liked);
        setCount(data.liked ? count + 1 : count - 1);
        if (onToggle) {
          onToggle();
        }
      }
    } catch (err) {
      // Silently fail
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={isLoading}
      className="flex items-center gap-2 text-gray-500 hover:text-red-600 disabled:text-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
      aria-label={ariaLabel}
      aria-pressed={liked}
    >
      <Heart className={`w-5 h-5 ${liked ? 'fill-current text-red-600' : ''}`} />
      <span className="text-sm font-medium">{count}</span>
    </button>
  );
}
