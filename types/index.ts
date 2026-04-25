export interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
  bio: string;
  profilePicture: string;
  followerCount: number;
  followingCount: number;
  createdAt: string;
}

export interface PublicUser {
  id: string;
  username: string;
  displayName: string;
  bio: string;
  profilePicture: string;
  followerCount: number;
}

export interface Post {
  id: string;
  authorId: string;
  author: PublicUser;
  text: string;
  image?: string;
  likes: number;
  liked: boolean;
  comments: number;
  createdAt: string;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  author: PublicUser;
  text: string;
  createdAt: string;
}

export interface FollowRequest {
  id: string;
  fromUserId: string;
  fromUser: PublicUser;
  toUserId: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
}

export type FollowStatus = 'none' | 'requested' | 'accepted' | 'blocked';
