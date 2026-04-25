'use client';

import Link from 'next/link';
import { PublicUser } from '@/types';
import FollowButton from '@/components/FollowButton';

export interface UserCardProps {
  user: PublicUser;
  currentUserId: string;
  onFollowChange?: () => void;
}

export default function UserCard({
  user,
  currentUserId,
  onFollowChange,
}: UserCardProps) {
  const isOwnProfile = user.id === currentUserId;

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 flex items-center justify-between">
      <Link href={`/profile/${user.id}`} className="flex-1 flex items-center gap-4">
        <img
          src={user.profilePicture}
          alt={`${user.displayName}'s profile picture`}
          className="w-16 h-16 rounded-full object-cover"
        />
        <div className="flex-1">
          <p className="font-semibold text-gray-900 hover:underline">{user.displayName}</p>
          <p className="text-sm text-gray-600">@{user.username}</p>
          {user.bio && <p className="text-sm text-gray-700 mt-1 line-clamp-2">{user.bio}</p>}
          <p className="text-xs text-gray-500 mt-1">{user.followerCount} followers</p>
        </div>
      </Link>

      {!isOwnProfile && (
        <FollowButton userId={user.id} onStatusChange={onFollowChange} />
      )}
    </div>
  );
}
