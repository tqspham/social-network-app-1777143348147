'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Trash2, MessageCircle } from 'lucide-react';
import { Post } from '@/types';
import LikeButton from '@/components/LikeButton';
import CommentList from '@/components/CommentList';
import CommentForm from '@/components/CommentForm';
import ErrorAlert from '@/components/ErrorAlert';

export interface PostCardProps {
  post: Post;
  currentUserId: string;
  onDelete?: () => void;
  onCommentAdded?: () => void;
}

export default function PostCard({
  post,
  currentUserId,
  onDelete,
  onCommentAdded,
}: PostCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isOwnPost = post.authorId === currentUserId;

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    setIsDeleting(true);
    setError(null);

    try {
      const response = await fetch(`/api/posts/${post.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete post');

      if (onDelete) {
        onDelete();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete post';
      setError(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  const createdAt = new Date(post.createdAt);
  const timeAgo = getTimeAgo(createdAt);

  return (
    <div
      className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden"
      role="article"
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <Link href={`/profile/${post.author.id}`} className="flex items-center gap-3">
            <img
              src={post.author.profilePicture}
              alt={`${post.author.displayName}'s profile picture`}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <p className="font-semibold text-gray-900 hover:underline">
                {post.author.displayName}
              </p>
              <p className="text-sm text-gray-500">@{post.author.username}</p>
            </div>
          </Link>

          {isOwnPost && (
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="text-gray-500 hover:text-red-600 disabled:text-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
              aria-label="Delete post"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
        </div>

        <p className="text-sm text-gray-500 mb-3">{timeAgo}</p>

        <p className="text-gray-900 mb-4 leading-relaxed">{post.text}</p>

        {post.image && (
          <img
            src={post.image}
            alt="Post image"
            className="w-full rounded-lg mb-4 max-h-96 object-cover"
          />
        )}

        {error && <ErrorAlert message={error} />}

        <div className="flex items-center gap-6 pt-4 border-t border-gray-200">
          <LikeButton
            postId={post.id}
            liked={post.liked}
            count={post.likes}
            ariaLabel={post.liked ? 'Unlike post' : 'Like post'}
          />

          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
            aria-label={`Comments: ${post.comments}`}
          >
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm font-medium">{post.comments}</span>
          </button>
        </div>
      </div>

      {showComments && (
        <div className="border-t border-gray-200 bg-gray-50 p-6 space-y-4">
          <CommentForm postId={post.id} onSuccess={onCommentAdded} />
          <CommentList postId={post.id} currentUserId={currentUserId} />
        </div>
      )}
    </div>
  );
}

function getTimeAgo(date: Date): string {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return date.toLocaleDateString();
}
