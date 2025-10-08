import React from 'react';
import type { Article } from '../types/index';
import { ArticleCard } from './ArticleCard';
import { LoadingCard } from './LoadingCard';
import { AlertCircle, Loader2, Plus } from 'lucide-react';

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

  // No results for search query
  if (query && articles.length === 0 && !loading && !error) {
    return (
      <div className="search-no-results">
        <div className="search-no-results-content">
          <div className="search-no-results-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="8"/>
              <path d="21 21-4.35-4.35"/>
              <line x1="9" y1="9" x2="13" y2="13"/>
              <line x1="13" y1="9" x2="9" y2="13"/>
            </svg>
          </div>
          <h3 className="search-no-results-title">No results found</h3>
          <p className="search-no-results-description">
            No articles match "<strong>{query}</strong>". Try different keywords or check your spelling.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="search-results">
      {/* Results header */}
      {(articles.length > 0 || loading) && query && (
        <div className="search-results-header">
          <div className="search-results-info">
            <h2 className="search-results-title">
              {total > 0 ? `${total.toLocaleString()} result${total !== 1 ? 's' : ''}` : 'Results'}
            </h2>
            {query && (
              <p className="search-results-query">
                for "{query}"
              </p>
            )}
          </div>
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
        <div className="load-more-section">
          <button
            onClick={onLoadMore}
            disabled={isLoadingMore}
            className="load-more-button"
          >
            {isLoadingMore ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <Plus size={16} />
                Load more
              </>
            )}
          </button>
          {hasMore && !isLoadingMore && (
            <p className="load-more-info">
              Showing {articles.length} of {total.toLocaleString()} articles
            </p>
          )}
        </div>
      )}

      {/* End of results indicator */}
      {!hasMore && articles.length > 0 && !loading && (
        <div className="search-end-indicator">
          <div className="search-end-content">
            <div className="search-end-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 6L9 17l-5-5"/>
              </svg>
            </div>
            <p className="search-end-text">
              All {total.toLocaleString()} articles loaded
            </p>
          </div>
        </div>
      )}
    </div>
  );
};