'use client';

export interface LoadingSpinnerProps {
  size?: 'small' | 'large';
}

export default function LoadingSpinner({ size = 'large' }: LoadingSpinnerProps) {
  const containerSize = size === 'small' ? 'h-8 w-8' : 'h-16 w-16';
  const containerPadding = size === 'small' ? 'p-2' : 'p-4';

  return (
    <div className="flex items-center justify-center py-8">
      <div
        className={`${containerSize} border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin`}
        role="status"
        aria-label="Loading"
      />
    </div>
  );
}
