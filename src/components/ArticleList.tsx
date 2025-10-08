import React from 'react';
import type { Article } from '../types/index';
import { ArticleCard } from './ArticleCard';
import { LoadingCard } from './LoadingCard';
import { clsx } from 'clsx';
import { AlertCircle, Loader2, ChevronDown, Search } from 'lucide-react';

interface ArticleListProps {
  articles: Article[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  total: number;
  query: string;
  onLoadMore: () => void;
  onRetry?: () => void;
}

export const ArticleList: React.FC<ArticleListProps> = ({
  articles,
  loading,
  error,
  hasMore,
  total,
  query,
  onLoadMore,
  onRetry,
}) => {
  const isInitialLoad = loading && articles.length === 0;
  const isLoadingMore = loading && articles.length > 0;

  // Empty state when no query
  if (!query && articles.length === 0 && !loading) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <Search className="h-10 w-10 text-blue-500" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Discover Amazing Articles
        </h3>
        <p className="text-gray-600 max-w-md mx-auto">
          Start typing in the search box above to find articles that match your interests.
          Our collection includes thousands of articles on various topics.
        </p>
      </div>
    );
  }

  // No results for search query
  if (query && articles.length === 0 && !loading && !error) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 bg-gradient-to-br from-amber-50 to-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <Search className="h-10 w-10 text-amber-500" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No articles found
        </h3>
        <p className="text-gray-600 max-w-md mx-auto mb-4">
          No articles match your search for <span className="font-medium text-gray-900">"{query}"</span>.
          Try adjusting your search terms or browse our other content.
        </p>
        <div className="text-sm text-gray-500">
          💡 Try searching for "React", "TypeScript", or "API"
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Results header */}
      {(articles.length > 0 || loading) && query && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-gray-900">
              Search Results
            </h2>
            {total > 0 && (
              <span className="px-3 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-full">
                {total.toLocaleString()} articles
              </span>
            )}
          </div>
          {query && (
            <div className="text-sm text-gray-600">
              Showing results for <span className="font-medium text-gray-900">"{query}"</span>
            </div>
          )}
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-6 w-6 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-red-900 mb-1">
                Something went wrong
              </h3>
              <p className="text-red-700 mb-4">{error}</p>
              {onRetry && (
                <button
                  onClick={onRetry}
                  className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-900 font-medium rounded-lg transition-colors duration-200"
                >
                  Try again
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Articles grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article, index) => (
          <ArticleCard
            key={article.id}
            article={article}
            index={index}
          />
        ))}

        {/* Loading cards for initial load */}
        {isInitialLoad && (
          <>
            {Array.from({ length: 6 }).map((_, index) => (
              <LoadingCard key={`loading-${index}`} index={index} />
            ))}
          </>
        )}
      </div>

      {/* Load more section */}
      {(hasMore || isLoadingMore) && articles.length > 0 && !error && (
        <div className="flex justify-center pt-8">
          <button
            onClick={onLoadMore}
            disabled={isLoadingMore}
            className={clsx(
              "flex items-center gap-3 px-8 py-4 rounded-xl font-medium transition-all duration-200",
              "border border-gray-200 bg-white shadow-sm",
              isLoadingMore
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-700 hover:bg-gray-50 hover:shadow-md hover:border-gray-300 active:scale-95"
            )}
          >
            {isLoadingMore ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Loading more articles...</span>
              </>
            ) : (
              <>
                <ChevronDown className="h-5 w-5" />
                <span>Load more articles</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* End of results indicator */}
      {!hasMore && articles.length > 0 && !loading && (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gradient-to-br from-green-50 to-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
          </div>
          <p className="text-gray-600 font-medium">
            You've reached the end of the results
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Found {articles.length} of {total} articles
          </p>
        </div>
      )}
    </div>
  );
};