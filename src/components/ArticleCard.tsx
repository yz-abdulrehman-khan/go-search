import React from 'react';
import { Article } from '../types';
import { clsx } from 'clsx';
import { FileText, Clock } from 'lucide-react';

interface ArticleCardProps {
  article: Article;
  index: number;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article, index }) => {
  return (
    <article
      className={clsx(
        "group relative bg-white rounded-xl border border-gray-100 shadow-sm",
        "hover:shadow-md hover:border-gray-200 transition-all duration-300 ease-out",
        "hover:-translate-y-1 cursor-pointer",
        "animate-slide-up"
      )}
      style={{
        animationDelay: `${index * 50}ms`,
        animationFillMode: 'both'
      }}
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-purple-50/0 group-hover:from-blue-50/30 group-hover:to-purple-50/30 rounded-xl transition-all duration-300" />

      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          <div className="flex-shrink-0 p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors duration-200">
            <FileText className="h-5 w-5 text-blue-600" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-900 transition-colors duration-200">
              {article.title}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <Clock className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-500">Article #{article.id}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4">
          {article.summary}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 bg-green-400 rounded-full"></div>
            <span className="text-xs text-gray-500 font-medium">Available</span>
          </div>

          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium hover:underline transition-colors duration-200">
            Read more →
          </button>
        </div>
      </div>

      {/* Subtle border highlight on hover */}
      <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/0 group-hover:ring-gray-900/5 transition-all duration-300 pointer-events-none" />
    </article>
  );
};