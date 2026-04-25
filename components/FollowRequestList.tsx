'use client';

import { FollowRequest } from '@/types';
import FollowRequestCard from '@/components/FollowRequestCard';

export interface FollowRequestListProps {
  requests: FollowRequest[];
  currentUserId: string;
  onRequestResolved?: () => void;
}

export default function FollowRequestList({
  requests,
  currentUserId,
  onRequestResolved,
}: FollowRequestListProps) {
  return (
    <div
      className="space-y-4"
      role="region"
      aria-live="polite"
      aria-label="Follow requests"
    >
      {requests.map((request) => (
        <FollowRequestCard
          key={request.id}
          request={request}
          onAction={onRequestResolved}
        />
      ))}
    </div>
  );
}
