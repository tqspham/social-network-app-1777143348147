'use client';

import { useEffect, useState } from 'react';
import { Post, PublicUser } from '@/types';
import PostCard from '@/components/PostCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import EmptyState from '@/components/EmptyState';

export interface PostListProps {
  posts: Post[];
  currentUserId: string;
  isLoading: boolean;
  onDelete?: () => void;
}

export default function PostList({
  posts,
  currentUserId,
  isLoading,
  onDelete,
}: PostListProps) {
  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (posts.length === 0) {
    return <EmptyState message="No posts yet" />;
  }

  return (
    <div className="space-y-6 mt-6">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          currentUserId={currentUserId}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
