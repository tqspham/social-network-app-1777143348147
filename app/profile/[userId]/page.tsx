'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import FeedLayout from '@/components/FeedLayout';
import ProfileHeader from '@/components/ProfileHeader';
import PostList from '@/components/PostList';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorAlert from '@/components/ErrorAlert';
import { PublicUser, Post } from '@/types';

export default function UserProfilePage() {
  const params = useParams();
  const userId = typeof params.userId === 'string' ? params.userId : '';
  const [user, setUser] = useState<PublicUser | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [followStatus, setFollowStatus] = useState(false);

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchProfile();
      fetchPosts();
    }
  }, [userId]);

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch('/api/users/me');
      if (response.ok) {
        const data = await response.json();
        setCurrentUserId(data.user.id);
      }
    } catch (err) {
      // Silently fail for current user fetch
    }
  };

  const fetchProfile = async () => {
    try {
      const response = await fetch(`/api/users/${userId}`);
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
      const response = await fetch(`/api/posts/user/${userId}`);
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

  const handleFollowChange = () => {
    setFollowStatus(!followStatus);
    fetchProfile();
  };

  const isOwnProfile = currentUserId === userId;

  return (
    <FeedLayout>
      <div className="max-w-2xl mx-auto py-6">
        {user && (
          <ProfileHeader
            user={user}
            isOwnProfile={isOwnProfile}
            onFollowChange={handleFollowChange}
          />
        )}

        {error && (
          <div className="mt-6">
            <ErrorAlert message={error} onRetry={fetchPosts} />
          </div>
        )}

        <PostList
          posts={posts}
          currentUserId={currentUserId || ''}
          isLoading={isLoading}
        />
      </div>
    </FeedLayout>
  );
}
