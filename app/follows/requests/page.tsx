'use client';

import { useEffect, useState } from 'react';
import FeedLayout from '@/components/FeedLayout';
import FollowRequestList from '@/components/FollowRequestList';
import LoadingSpinner from '@/components/LoadingSpinner';
import EmptyState from '@/components/EmptyState';
import ErrorAlert from '@/components/ErrorAlert';
import { FollowRequest } from '@/types';

export default function FollowRequestsPage() {
  const [requests, setRequests] = useState<FollowRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    fetchCurrentUser();
    fetchRequests();
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

  const fetchRequests = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/follows/requests');
      if (!response.ok) throw new Error('Failed to load follow requests');
      const data = await response.json();
      setRequests(data.requests);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to load follow requests';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FeedLayout>
      <div className="max-w-2xl mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">Follow Requests</h1>

        {error && <ErrorAlert message={error} onRetry={fetchRequests} />}

        {isLoading ? (
          <LoadingSpinner />
        ) : requests.length === 0 ? (
          <EmptyState message="No pending follow requests" />
        ) : (
          <FollowRequestList
            requests={requests}
            currentUserId={currentUserId || ''}
            onRequestResolved={fetchRequests}
          />
        )}
      </div>
    </FeedLayout>
  );
}
