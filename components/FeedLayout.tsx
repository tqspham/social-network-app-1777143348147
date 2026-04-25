'use client';

import Link from 'next/link';
import { LogOut, Home, Search, Bell } from 'lucide-react';
import { useRouter } from 'next/navigation';

export interface FeedLayoutProps {
  children: React.ReactNode;
  onLogout?: () => void;
}

export default function FeedLayout({ children, onLogout }: FeedLayoutProps) {
  const router = useRouter();

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      document.cookie = 'sessionToken=; Max-Age=0';
      router.push('/auth/login');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            Social Media
          </Link>

          <div className="flex items-center gap-6">
            <Link
              href="/feed"
              className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
              aria-label="Home"
            >
              <Home className="w-5 h-5" />
              <span className="hidden sm:inline">Home</span>
            </Link>

            <Link
              href="/search"
              className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
              <span className="hidden sm:inline">Search</span>
            </Link>

            <Link
              href="/follows/requests"
              className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
              aria-label="Follow Requests"
            >
              <Bell className="w-5 h-5" />
              <span className="hidden sm:inline">Requests</span>
            </Link>

            <Link
              href="/profile/me"
              className="text-gray-700 hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded font-medium"
              aria-label="My Profile"
            >
              Profile
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4">{children}</main>
    </div>
  );
}
