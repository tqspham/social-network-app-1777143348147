'use client';

import { AlertCircle, X } from 'lucide-react';
import { useState } from 'react';

export interface ErrorAlertProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorAlert({ message, onRetry }: ErrorAlertProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div
      className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3 my-4"
      role="alert"
    >
      <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-red-800 font-medium">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="text-red-700 hover:text-red-900 font-semibold mt-2 focus:outline-none focus:underline"
          >
            Try again
          </button>
        )}
      </div>
      <button
        onClick={() => setIsVisible(false)}
        className="text-red-600 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
        aria-label="Close error message"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}
