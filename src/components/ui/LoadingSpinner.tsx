'use client';

import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fullPage?: boolean;
  text?: string;
}

export function LoadingSpinner({
  className,
  size = 'md',
  fullPage = false,
  text,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
    xl: 'w-16 h-16 border-5',
  };

  if (fullPage) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <div className="flex flex-col items-center space-y-4">
          <div
            className={cn(
              'spinner animate-spin rounded-full border-primary-600 border-t-transparent',
              sizeClasses[size],
              className
            )}
          ></div>
          {text && (
            <p className="text-gray-600 dark:text-gray-300 font-medium">{text}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center">
      <div
        className={cn(
          'spinner animate-spin rounded-full border-primary-600 border-t-transparent',
          sizeClasses[size],
          className
        )}
      ></div>
      {text && (
        <span className="ml-3 text-gray-600 dark:text-gray-300">{text}</span>
      )}
    </div>
  );
}

export default LoadingSpinner;