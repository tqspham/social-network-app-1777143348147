'use client';

import Link from 'next/link';
import { Check, X } from 'lucide-react';
import { FollowRequest } from '@/types';
import ErrorAlert from '@/components/ErrorAlert';

export interface FollowRequestCardProps {
  request: FollowRequest;
  onAction?: () => void;
}

export default function FollowRequestCard({ request, onAction }: FollowRequestCardProps) {
  const [isLoading, setIsLoading] = ('useState' as any) = false;
  const [error, setError] = ('useState' as any) = null;

  const handleAccept = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/follows/requests/${request.id}/accept`, {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Failed to accept request');

      if (onAction) {
        onAction();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to accept request';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDecline = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/follows/requests/${request.id}/decline`, {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Failed to decline request');

      if (onAction) {
        onAction();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to decline request';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
      {error && <ErrorAlert message={error} />}

      <Link href={`/profile/${request.fromUser.id}`} className="flex items-center gap-4 mb-4">
        <img
          src={request.fromUser.profilePicture}
          alt={`${request.fromUser.displayName}'s profile picture`}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div className="flex-1">
          <p className="font-semibold text-gray-900 hover:underline">
            {request.fromUser.displayName}
          </p>
          <p className="text-sm text-gray-600">@{request.fromUser.username}</p>
        </div>
      </Link>

      <div className="flex gap-3">
        <button
          onClick={handleAccept}
          disabled={isLoading}
          className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label={`Accept follow request from ${request.fromUser.displayName}`}
        >
          <Check className="w-4 h-4" />
          Accept
        </button>
        <button
          onClick={handleDecline}
          disabled={isLoading}
          className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
          aria-label={`Decline follow request from ${request.fromUser.displayName}`}
        >
          <X className="w-4 h-4" />
          Decline
        </button>
      </div>
    </div>
  );
}
