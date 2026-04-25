'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import FeedLayout from '@/components/FeedLayout';
import ProfileHeader from '@/components/ProfileHeader';
import PostList from '@/components/PostList';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorAlert from '@/components/ErrorAlert';
import { User, Post } from '@/types';

export default function MyProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProfile();
    fetchPosts();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/users/me');
      if (!response.ok) throw new Error('Failed to fetch profile');
      const data = await response.json();
      setUser(data.user);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch profile';
      setError(errorMessage);
    }
  };

  const fetchPosts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/posts/user/me');
      if (!response.ok) throw new Error('Failed to fetch posts');
      const data = await response.json();
      setPosts(data.posts);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch posts';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    document.cookie = 'sessionToken=; Max-Age=0';
    router.push('/auth/login');
  };

  const handlePostDelete = () => {
    fetchPosts();
  };

  return (
    <FeedLayout onLogout={handleLogout}>
      <div className="max-w-2xl mx-auto py-6">
        {user && <ProfileHeader user={user} isOwnProfile={true} />}

        {error && (
          <div className="mt-6">
            <ErrorAlert message={error} onRetry={fetchPosts} />
          </div>
        )}

        <PostList
          posts={posts}
          currentUserId={user?.id || ''}
          isLoading={isLoading}
          onDelete={handlePostDelete}
        />
      </div>
    </FeedLayout>
  );
}
