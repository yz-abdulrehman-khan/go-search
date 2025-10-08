import React from 'react';
import { clsx } from 'clsx';

interface LoadingCardProps {
  index: number;
}

export const LoadingCard: React.FC<LoadingCardProps> = ({ index }) => {
  return (
    <div
      className={clsx(
        "bg-white rounded-xl border border-gray-100 shadow-sm",
        "animate-fade-in"
      )}
      style={{
        animationDelay: `${index * 100}ms`,
        animationFillMode: 'both'
      }}
    >
      <div className="p-6">
        {/* Header skeleton */}
        <div className="flex items-start gap-3 mb-4">
          <div className="flex-shrink-0 p-2 bg-gray-100 rounded-lg shimmer">
            <div className="h-5 w-5 bg-gray-200 rounded" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="space-y-2">
              <div className="h-5 bg-gray-200 rounded shimmer" style={{ width: '85%' }} />
              <div className="h-4 bg-gray-100 rounded shimmer" style={{ width: '60%' }} />
            </div>
          </div>
        </div>

        {/* Content skeleton */}
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-gray-100 rounded shimmer" />
          <div className="h-4 bg-gray-100 rounded shimmer" style={{ width: '90%' }} />
          <div className="h-4 bg-gray-100 rounded shimmer" style={{ width: '75%' }} />
        </div>

        {/* Footer skeleton */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 bg-gray-200 rounded-full shimmer" />
            <div className="h-3 w-16 bg-gray-100 rounded shimmer" />
          </div>

          <div className="h-4 w-20 bg-gray-100 rounded shimmer" />
        </div>
      </div>
    </div>
  );
};