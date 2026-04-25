'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import FeedLayout from '@/components/FeedLayout';
import PostForm from '@/components/PostForm';
import PostCard from '@/components/PostCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import EmptyState from '@/components/EmptyState';
import ErrorAlert from '@/components/ErrorAlert';
import { Post } from '@/types';

export default function FeedPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    fetchFeed();
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch('/api/users/me');
      if (!response.ok) throw new Error('Failed to fetch user');
      const data = await response.json();
      setCurrentUserId(data.user.id);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch user';
      setError(errorMessage);
    }
  };

  const fetchFeed = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/posts/feed');
      if (!response.ok) throw new Error('Failed to load feed');
      const data = await response.json();
      setPosts(data.posts);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load feed';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    document.cookie = 'sessionToken=; Max-Age=0';
    router.push('/auth/login');
  };

  const handlePostSuccess = () => {
    fetchFeed();
  };

  const handlePostDelete = () => {
    fetchFeed();
  };

  return (
    <FeedLayout onLogout={handleLogout}>
      <div className="max-w-2xl mx-auto py-6">
        <PostForm onSuccess={handlePostSuccess} />

        {error && (
          <div className="mb-6">
            <ErrorAlert message={error} onRetry={fetchFeed} />
          </div>
        )}

        {isLoading ? (
          <LoadingSpinner />
        ) : posts.length === 0 ? (
          <EmptyState message="No posts yet. Follow some users to see their posts!" />
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                currentUserId={currentUserId || ''}
                onDelete={handlePostDelete}
                onCommentAdded={fetchFeed}
              />
            ))}
          </div>
        )}
      </div>
    </FeedLayout>
  );
}
