import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ArticleList } from '../ArticleList';
import type { Article } from '../../types';

describe('ArticleList', () => {
  const mockArticles: Article[] = [
    { id: 1, title: 'First Article', summary: 'This is the first article summary' },
    { id: 2, title: 'Second Article', summary: 'This is the second article summary' }
  ];

  const defaultProps = {
    articles: mockArticles,
    loading: false,
    error: null,
    hasMore: false,
    total: 2,
    query: 'test',
    onLoadMore: vi.fn(),
    onRetry: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders articles correctly', () => {
    render(<ArticleList {...defaultProps} />);

    expect(screen.getByText('First Article')).toBeInTheDocument();
    expect(screen.getByText('Second Article')).toBeInTheDocument();
    expect(screen.getByText('This is the first article summary')).toBeInTheDocument();
    expect(screen.getByText('This is the second article summary')).toBeInTheDocument();
  });

  it('shows results count', () => {
    render(<ArticleList {...defaultProps} />);

    expect(screen.getByText('2 results')).toBeInTheDocument();
    expect(screen.getByText('for "test"')).toBeInTheDocument();
  });

  it('shows load more button when hasMore is true', () => {
    render(<ArticleList {...defaultProps} hasMore={true} />);

    expect(screen.getByText(/load more/i)).toBeInTheDocument();
  });

  it('does not show load more button when hasMore is false', () => {
    render(<ArticleList {...defaultProps} hasMore={false} />);

    expect(screen.queryByText(/load more/i)).not.toBeInTheDocument();
  });

  it('calls onLoadMore when load more button is clicked', async () => {
    const user = userEvent.setup();
    const mockOnLoadMore = vi.fn();

    render(<ArticleList {...defaultProps} hasMore={true} onLoadMore={mockOnLoadMore} />);

    const loadMoreButton = screen.getByText(/load more/i);
    await user.click(loadMoreButton);

    expect(mockOnLoadMore).toHaveBeenCalledTimes(1);
  });

  it('shows loading state correctly', () => {
    render(<ArticleList {...defaultProps} loading={true} />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('shows error state with retry button', () => {
    render(<ArticleList {...defaultProps} error="Network error occurred" />);

    expect(screen.getByText(/error/i)).toBeInTheDocument();
    expect(screen.getByText('Network error occurred')).toBeInTheDocument();
    expect(screen.getByText(/try again/i)).toBeInTheDocument();
  });

  it('calls onRetry when retry button is clicked', async () => {
    const user = userEvent.setup();
    const mockOnRetry = vi.fn();

    render(<ArticleList {...defaultProps} error="Network error" onRetry={mockOnRetry} />);

    const retryButton = screen.getByText(/try again/i);
    await user.click(retryButton);

    expect(mockOnRetry).toHaveBeenCalledTimes(1);
  });

  it('shows empty state when no articles and no error', () => {
    render(<ArticleList {...defaultProps} articles={[]} total={0} />);

    expect(screen.getByText(/no results found/i)).toBeInTheDocument();
  });

  it('shows empty state with query when search returns no results', () => {
    render(<ArticleList {...defaultProps} articles={[]} total={0} query="nonexistent" />);

    expect(screen.getByText(/no results found/i)).toBeInTheDocument();
    expect(screen.getByText((content, element) => {
      return element && element.textContent === 'No articles match "nonexistent". Try different keywords or check your spelling.';
    })).toBeInTheDocument();
  });

  it('handles articles without summaries gracefully', () => {
    const articlesWithoutSummary: Article[] = [
      { id: 1, title: 'Article Without Summary', summary: '' }
    ];

    render(<ArticleList {...defaultProps} articles={articlesWithoutSummary} total={1} />);

    expect(screen.getByText('Article Without Summary')).toBeInTheDocument();
  });

  it('shows loading cards when loading more', () => {
    render(<ArticleList {...defaultProps} loading={true} hasMore={true} />);

    // Should show existing articles plus loading indicators
    expect(screen.getByText('First Article')).toBeInTheDocument();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('handles very long article titles and summaries', () => {
    const longArticles: Article[] = [
      {
        id: 1,
        title: 'This is a very long article title that might wrap to multiple lines and test how our UI handles long content gracefully',
        summary: 'This is a very long summary that contains a lot of text and should wrap properly in the UI without breaking the layout or causing any visual issues. It should be truncated or handled appropriately based on the design requirements.'
      }
    ];

    render(<ArticleList {...defaultProps} articles={longArticles} total={1} />);

    expect(screen.getByText(/This is a very long article title/)).toBeInTheDocument();
    expect(screen.getByText(/This is a very long summary/)).toBeInTheDocument();
  });

  it('handles large numbers of articles efficiently', () => {
    const manyArticles: Article[] = Array.from({ length: 100 }, (_, i) => ({
      id: i + 1,
      title: `Article ${i + 1}`,
      summary: `Summary for article ${i + 1}`
    }));

    render(<ArticleList {...defaultProps} articles={manyArticles} total={100} />);

    expect(screen.getByText('100 results')).toBeInTheDocument();
    expect(screen.getByText('for "test"')).toBeInTheDocument();
    expect(screen.getByText('Article 1')).toBeInTheDocument();
    expect(screen.getByText('Article 100')).toBeInTheDocument();
  });

  it('updates results count when articles change', () => {
    const { rerender } = render(<ArticleList {...defaultProps} />);

    expect(screen.getByText('2 results')).toBeInTheDocument();
    expect(screen.getByText('for "test"')).toBeInTheDocument();

    const newArticles = [mockArticles[0]];
    rerender(<ArticleList {...defaultProps} articles={newArticles} total={1} />);

    expect(screen.getByText('1 result')).toBeInTheDocument();
    expect(screen.getByText('for "test"')).toBeInTheDocument();
  });

  it('handles special characters in query', () => {
    render(<ArticleList {...defaultProps} query="test & query" />);

    expect(screen.getByText('2 results')).toBeInTheDocument();
    expect(screen.getByText('for "test & query"')).toBeInTheDocument();
  });

  it('shows correct singular/plural for results count', () => {
    const { rerender } = render(<ArticleList {...defaultProps} total={1} />);

    expect(screen.getByText('1 result')).toBeInTheDocument();
    expect(screen.getByText('for "test"')).toBeInTheDocument();

    rerender(<ArticleList {...defaultProps} total={2} />);

    expect(screen.getByText('2 results')).toBeInTheDocument();
    expect(screen.getByText('for "test"')).toBeInTheDocument();
  });

  it('handles empty query gracefully', () => {
    render(<ArticleList {...defaultProps} query="" />);

    // When query is empty, header should not be shown
    expect(screen.queryByText('2 results')).not.toBeInTheDocument();
    // But articles should still be displayed
    expect(screen.getByText('First Article')).toBeInTheDocument();
    expect(screen.getByText('Second Article')).toBeInTheDocument();
  });
});