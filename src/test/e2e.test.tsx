import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchPage } from '../components/SearchPage';
import * as apiModule from '../services/api';

// Mock the API module
vi.mock('../services/api');
const mockSearchArticles = vi.mocked(apiModule.searchArticles);

describe('End-to-End Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('complete search flow works correctly', async () => {
    const user = userEvent.setup();

    mockSearchArticles.mockResolvedValue({
      data: [
        { id: 1, title: 'React Testing Guide', summary: 'Learn how to test React applications effectively' },
        { id: 2, title: 'TypeScript Best Practices', summary: 'Essential patterns for TypeScript development' }
      ],
      page: 1,
      pageSize: 10,
      total: 2
    });

    render(<SearchPage />);

    // Initial state - page loads correctly
    expect(screen.getByText('Articles')).toBeInTheDocument();
    expect(screen.getByText('Knowledge base')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search articles...')).toBeInTheDocument();

    // User types in search box
    const searchInput = screen.getByPlaceholderText('Search articles...');
    await user.type(searchInput, 'React');

    // Wait for search results (with debouncing)
    await waitFor(() => {
      expect(screen.getByText('React Testing Guide')).toBeInTheDocument();
    }, { timeout: 3000 });

    // Verify search results are displayed
    expect(screen.getByText('TypeScript Best Practices')).toBeInTheDocument();
    expect(screen.getByText('Learn how to test React applications effectively')).toBeInTheDocument();
    expect(screen.getByText('2 results')).toBeInTheDocument();
    expect(screen.getByText('for "React"')).toBeInTheDocument();

    // Verify API was called correctly
    expect(mockSearchArticles).toHaveBeenCalledWith('React', 1);

    // Clear search
    const clearButton = screen.getByLabelText('Clear search');
    await user.click(clearButton);

    expect(searchInput).toHaveValue('');
    expect(screen.queryByText('React Testing Guide')).not.toBeInTheDocument();
  });

  it('handles error states correctly', async () => {
    const user = userEvent.setup();

    mockSearchArticles.mockRejectedValue(new Error('Network error'));

    render(<SearchPage />);

    const searchInput = screen.getByPlaceholderText('Search articles...');
    await user.type(searchInput, 'error');

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    }, { timeout: 3000 });

    // Should show retry option
    expect(screen.getByText(/try again/i)).toBeInTheDocument();
  });

  it('handles empty search results', async () => {
    const user = userEvent.setup();

    mockSearchArticles.mockResolvedValue({
      data: [],
      page: 1,
      pageSize: 10,
      total: 0
    });

    render(<SearchPage />);

    const searchInput = screen.getByPlaceholderText('Search articles...');
    await user.type(searchInput, 'xyz123');
    // Press Enter to trigger immediate search without debounce
    await user.keyboard('{Enter}');

    await waitFor(() => {
      expect(screen.getByText(/no results found/i)).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('keyboard interactions work correctly', async () => {
    const user = userEvent.setup();

    mockSearchArticles.mockResolvedValue({
      data: [{ id: 1, title: 'Test Article', summary: 'Test summary' }],
      page: 1,
      pageSize: 10,
      total: 1
    });

    render(<SearchPage />);

    const searchInput = screen.getByPlaceholderText('Search articles...');

    // Type and then use Escape to clear
    await user.type(searchInput, 'test');
    expect(searchInput).toHaveValue('test');

    await user.keyboard('{Escape}');
    expect(searchInput).toHaveValue('');
  });

  it('load more functionality works', async () => {
    const user = userEvent.setup();

    mockSearchArticles
      .mockResolvedValueOnce({
        data: [{ id: 1, title: 'Article 1', summary: 'Summary 1' }],
        page: 1,
        pageSize: 10,
        total: 20
      })
      .mockResolvedValueOnce({
        data: [{ id: 2, title: 'Article 2', summary: 'Summary 2' }],
        page: 2,
        pageSize: 10,
        total: 20
      });

    render(<SearchPage />);

    const searchInput = screen.getByPlaceholderText('Search articles...');
    await user.type(searchInput, 'test');

    // Wait for initial results
    await waitFor(() => {
      expect(screen.getByText('Article 1')).toBeInTheDocument();
    }, { timeout: 3000 });

    // Load more
    const loadMoreButton = screen.getByText(/load more/i);
    await user.click(loadMoreButton);

    // Wait for additional results
    await waitFor(() => {
      expect(screen.getByText('Article 2')).toBeInTheDocument();
    }, { timeout: 3000 });

    // Both articles should be visible
    expect(screen.getByText('Article 1')).toBeInTheDocument();
    expect(screen.getByText('Article 2')).toBeInTheDocument();
  });

  it('search input validation and edge cases', async () => {
    const user = userEvent.setup();

    render(<SearchPage />);

    const searchInput = screen.getByPlaceholderText('Search articles...');

    // Test with special characters
    await user.type(searchInput, '!@#$%^&*()');
    expect(searchInput).toHaveValue('!@#$%^&*()');

    // Clear and test with numbers
    await user.clear(searchInput);
    await user.type(searchInput, '12345');
    expect(searchInput).toHaveValue('12345');

    // Clear and test with Unicode
    await user.clear(searchInput);
    await user.type(searchInput, 'café 🚀 测试');
    expect(searchInput).toHaveValue('café 🚀 测试');
  });

  it('UI responsiveness and accessibility', async () => {
    const user = userEvent.setup();
    render(<SearchPage />);

    // Check for semantic HTML structure
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();

    // Check search icon is present
    expect(screen.getByTestId('search-icon')).toBeInTheDocument();

    // Type something to make clear button appear, then check for ARIA labels
    const searchInput = screen.getByPlaceholderText('Search articles...');
    await user.type(searchInput, 'test');
    expect(screen.getByLabelText(/clear search/i)).toBeInTheDocument();
  });
});