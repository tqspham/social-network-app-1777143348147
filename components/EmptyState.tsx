'use client';

import { InboxIcon } from 'lucide-react';

export interface EmptyStateProps {
  message: string;
  icon?: React.ReactNode;
}

export default function EmptyState({ message, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      {icon || <InboxIcon className="w-16 h-16 text-gray-300 mb-4" />}
      <p className="text-gray-500 text-lg">{message}</p>
    </div>
  );
}
