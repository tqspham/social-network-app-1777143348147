'use client';

import { CheckCircle, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export interface SuccessAlertProps {
  message: string;
  duration?: number;
}

export default function SuccessAlert({ message, duration = 3000 }: SuccessAlertProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  if (!isVisible) return null;

  return (
    <div
      className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3 my-4"
      role="status"
      aria-live="polite"
    >
      <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
      <p className="text-green-800 font-medium flex-1">{message}</p>
      <button
        onClick={() => setIsVisible(false)}
        className="text-green-600 hover:text-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 rounded"
        aria-label="Close success message"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}
