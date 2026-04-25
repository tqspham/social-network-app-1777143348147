'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/users/me');
        if (!response.ok) {
          router.push('/auth/login');
        }
      } catch (err) {
        router.push('/auth/login');
      }
    };

    checkAuth();
  }, [router]);

  return <>{children}</>;
}
