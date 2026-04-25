'use client';

import { useEffect, useState } from 'react';
import { UserPlus, UserCheck, Loader } from 'lucide-react';
import { FollowStatus } from '@/types';

export interface FollowButtonProps {
  userId: string;
  onStatusChange?: (newStatus: FollowStatus) => void;
}

export default function FollowButton({
  userId,
  onStatusChange,
}: FollowButtonProps) {
  const [status, setStatus] = useState<FollowStatus>('none');
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);

  useEffect(() => {
    fetchStatus();
  }, [userId]);

  const fetchStatus = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/follows/status?targetUserId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setStatus(data.status);
      }
    } catch (err) {
      // Silently fail
    } finally {
      setIsLoading(false);
    }
  };

  const handleFollowClick = async () => {
    setIsActionLoading(true);

    try {
      const response = await fetch('/api/follows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId: userId }),
      });

      if (response.ok) {
        const data = await response.json();
        setStatus(data.status);
        if (onStatusChange) {
          onStatusChange(data.status);
        }
      }
    } catch (err) {
      // Silently fail
    } finally {
      setIsActionLoading(false);
    }
  };

  if (isLoading) {
    return (
      <button
        disabled
        className="px-6 py-2 bg-gray-400 text-white font-semibold rounded-lg cursor-not-allowed"
      >
        Loading...
      </button>
    );
  }

  const getButtonText = () => {
    switch (status) {
      case 'accepted':
        return 'Following';
      case 'requested':
        return 'Request Sent';
      default:
        return 'Follow';
    }
  };

  const getButtonIcon = () => {
    if (isActionLoading) {
      return <Loader className="w-4 h-4 animate-spin" />;
    }
    return status === 'accepted' ? (
      <UserCheck className="w-4 h-4" />
    ) : (
      <UserPlus className="w-4 h-4" />
    );
  };

  return (
    <button
      onClick={handleFollowClick}
      disabled={isActionLoading}
      className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      aria-label={`${getButtonText()} ${userId}`}
    >
      {getButtonIcon()}
      {getButtonText()}
    </button>
  );
}
