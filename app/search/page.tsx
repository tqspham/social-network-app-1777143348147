'use client';

import { useState, useCallback, useEffect } from 'react';
import FeedLayout from '@/components/FeedLayout';
import SearchInput from '@/components/SearchInput';
import UserCard from '@/components/UserCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import EmptyState from '@/components/EmptyState';
import { PublicUser } from '@/types';

const DEBOUNCE_DELAY = 300;

export default function SearchPage() {
  const [users, setUsers] = useState<PublicUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch('/api/users/me');
      if (response.ok) {
        const data = await response.json();
        setCurrentUserId(data.user.id);
      }
    } catch (err) {
      // Silently fail
    }
  };

  const searchUsers = useCallback(
    async (searchQuery: string) => {
      if (searchQuery.trim().length === 0) {
        setUsers([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/users/search?q=${encodeURIComponent(searchQuery)}`
        );
        if (!response.ok) throw new Error('Search failed');
        const data = await response.json();
        setUsers(data.users);
      } catch (err) {
        setUsers([]);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    const timeoutId = setTimeout(() => {
      searchUsers(searchQuery);
    }, DEBOUNCE_DELAY);
    return () => clearTimeout(timeoutId);
  };

  const handleFollowChange = () => {
    searchUsers(query);
  };

  return (
    <FeedLayout>
      <div className="max-w-2xl mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">Search Users</h1>
        <SearchInput onSearch={handleSearch} placeholder="Search by username or display name..." />

        {isLoading ? (
          <div className="mt-8">
            <LoadingSpinner />
          </div>
        ) : query.trim().length === 0 ? (
          <div className="mt-8">
            <EmptyState message="Enter a username to search" />
          </div>
        ) : users.length === 0 ? (
          <div className="mt-8">
            <EmptyState message="No users found" />
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {users.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                currentUserId={currentUserId || ''}
                onFollowChange={handleFollowChange}
              />
            ))}
          </div>
        )}
      </div>
    </FeedLayout>
  );
}
