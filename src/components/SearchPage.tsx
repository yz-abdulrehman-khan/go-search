import React from 'react';
import { SearchInput } from './SearchInput';
import { ArticleList } from './ArticleList';
import { useSearch } from '../hooks/useSearch';

export const SearchPage: React.FC = () => {
  const {
    articles,
    loading,
    error,
    hasMore,
    total,
    query,
    search,
    loadMore,
    clearSearch,
  } = useSearch();

  const handleRetry = () => {
    if (query) {
      search(query, 0);
    }
  };

  const hasContent = articles.length > 0 || loading || error || query;

  return (
    <div className="search-page">
      <header className="search-header">
        <div className="search-header-content">
          <div className="search-brand">
            <h1 className="search-brand-title">Articles</h1>
            <p className="search-brand-subtitle">Knowledge base</p>
          </div>

          <div className="search-input-wrapper">
            <SearchInput
              onSearch={search}
              onClear={clearSearch}
              loading={loading && articles.length === 0}
              placeholder="Search articles..."
            />
          </div>
        </div>
      </header>

      <main className="search-main">
        <div className="search-content">
          {hasContent ? (
            <ArticleList
              articles={articles}
              loading={loading}
              error={error}
              hasMore={hasMore}
              total={total}
              query={query}
              onLoadMore={loadMore}
              onRetry={handleRetry}
            />
          ) : (
            <div className="search-empty-state">
              <div className="search-empty-content">
                <div className="search-empty-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="11" cy="11" r="8"/>
                    <path d="21 21-4.35-4.35"/>
                  </svg>
                </div>
                <h3 className="search-empty-title">Start searching</h3>
                <p className="search-empty-description">
                  Type in the search box above to find articles, guides, and resources
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};