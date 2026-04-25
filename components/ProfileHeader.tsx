'use client';

import Link from 'next/link';
import { Users } from 'lucide-react';
import { PublicUser } from '@/types';
import FollowButton from '@/components/FollowButton';

export interface ProfileHeaderProps {
  user: PublicUser;
  isOwnProfile: boolean;
  onFollowChange?: () => void;
}

export default function ProfileHeader({
  user,
  isOwnProfile,
  onFollowChange,
}: ProfileHeaderProps) {
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-6">
      <div className="flex items-start gap-6">
        <img
          src={user.profilePicture}
          alt={`${user.displayName}'s profile picture`}
          className="w-24 h-24 rounded-full object-cover"
        />

        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">{user.displayName}</h1>
          <p className="text-gray-600 mb-2">@{user.username}</p>
          {user.bio && <p className="text-gray-700 mb-4">{user.bio}</p>}

          <div className="flex gap-6 mb-4">
            <div>
              <p className="text-sm text-gray-600">Followers</p>
              <p className="text-2xl font-bold text-gray-900 flex items-center gap-1">
                <Users className="w-6 h-6" />
                {user.followerCount}
              </p>
            </div>
          </div>

          {!isOwnProfile && <FollowButton userId={user.id} onStatusChange={onFollowChange} />}
        </div>
      </div>
    </div>
  );
}
