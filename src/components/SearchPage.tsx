import React from 'react';
import { SearchInput } from './SearchInput';
import { ArticleList } from './ArticleList';
import { useSearch } from '../hooks/useSearch';
import { clsx } from 'clsx';
import { Sparkles, BookOpen } from 'lucide-react';

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
      search(query, 0); // Immediate search for retry
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5" />
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Article Search
              </h1>
              <Sparkles className="h-6 w-6 text-purple-500" />
            </div>

            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Discover amazing articles with our powerful real-time search.
              Find exactly what you're looking for in our extensive knowledge base.
            </p>

            {/* Search Input */}
            <div className="max-w-2xl mx-auto">
              <SearchInput
                onSearch={search}
                onClear={clearSearch}
                loading={loading && articles.length === 0}
                placeholder="Search for articles, topics, or keywords..."
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
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
      </main>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-600">
              Built with React, TypeScript, and Tailwind CSS
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Real-time search with debouncing and optimistic loading states
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};