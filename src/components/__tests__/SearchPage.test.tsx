import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchPage } from '../SearchPage';
import * as apiModule from '../../services/api';

// Mock the API module
vi.mock('../../services/api');
const mockSearchArticles = vi.mocked(apiModule.searchArticles);

describe('SearchPage Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders search page with title and input', () => {
    render(<SearchPage />);

    expect(screen.getByText('Articles')).toBeInTheDocument();
    expect(screen.getByText('Knowledge base')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search articles...')).toBeInTheDocument();
  });

  it('performs end-to-end search flow', async () => {
    const user = userEvent.setup();

    mockSearchArticles.mockResolvedValue({
      data: [
        { id: 1, title: 'React Article', summary: 'Learn about React hooks and components' },
        { id: 2, title: 'TypeScript Guide', summary: 'Complete guide to TypeScript' }
      ],
      page: 1,
      pageSize: 10,
      total: 2
    });

    render(<SearchPage />);

    const searchInput = screen.getByPlaceholderText('Search articles...');

    // Type in search input and press Enter to trigger immediate search
    await user.type(searchInput, 'React');
    await user.keyboard('{Enter}');

    // Wait for search results to appear
    await waitFor(() => {
      expect(screen.getByText('React Article')).toBeInTheDocument();
    });

    expect(screen.getByText('TypeScript Guide')).toBeInTheDocument();
    expect(screen.getByText('Learn about React hooks and components')).toBeInTheDocument();
    expect(mockSearchArticles).toHaveBeenCalledWith('React', 1);
  });

  it('shows loading state during search', async () => {
    const user = userEvent.setup();

    // Mock a response that never resolves to keep loading state
    mockSearchArticles.mockImplementation(() => new Promise(() => {}));

    render(<SearchPage />);

    const searchInput = screen.getByPlaceholderText('Search articles...');
    await user.type(searchInput, 'test');
    await user.keyboard('{Enter}');

    // Should show loading spinner in search input
    await waitFor(() => {
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });
  });

  it('shows error state when search fails', async () => {
    const user = userEvent.setup();

    mockSearchArticles.mockRejectedValue(new Error('Network error'));

    render(<SearchPage />);

    const searchInput = screen.getByPlaceholderText('Search articles...');
    await user.type(searchInput, 'test');

    await user.keyboard('{Enter}');

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });

  it('allows clearing search results', async () => {
    const user = userEvent.setup();

    mockSearchArticles.mockResolvedValue({
      data: [{ id: 1, title: 'Test Article', summary: 'Test summary' }],
      page: 1,
      pageSize: 10,
      total: 1
    });

    render(<SearchPage />);

    const searchInput = screen.getByPlaceholderText('Search articles...');

    // Perform search
    await user.type(searchInput, 'test');
    await user.keyboard('{Enter}');

    await waitFor(() => {
      expect(screen.getByText('Test Article')).toBeInTheDocument();
    });

    // Clear search
    const clearButton = screen.getByLabelText('Clear search');
    await user.click(clearButton);

    expect(searchInput).toHaveValue('');
    expect(screen.queryByText('Test Article')).not.toBeInTheDocument();
  });

  it('supports load more functionality', async () => {
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

    // Initial search
    await user.type(searchInput, 'test');
    await user.keyboard('{Enter}');

    await waitFor(() => {
      expect(screen.getByText('Article 1')).toBeInTheDocument();
    });

    // Load more
    const loadMoreButton = screen.getByText(/load more/i);
    await user.click(loadMoreButton);

    await waitFor(() => {
      expect(screen.getByText('Article 2')).toBeInTheDocument();
    });

    expect(screen.getByText('Article 1')).toBeInTheDocument();
    expect(mockSearchArticles).toHaveBeenCalledTimes(2);
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
    await user.type(searchInput, 'nonexistent');

    await user.keyboard('{Enter}');

    await waitFor(() => {
      expect(screen.getByText(/no results found/i)).toBeInTheDocument();
    });
  });

  it('supports keyboard navigation', async () => {
    const user = userEvent.setup();

    mockSearchArticles.mockResolvedValue({
      data: [{ id: 1, title: 'Test Article', summary: 'Test summary' }],
      page: 1,
      pageSize: 10,
      total: 1
    });

    render(<SearchPage />);

    const searchInput = screen.getByPlaceholderText('Search articles...');

    // Type and use Escape to clear
    await user.type(searchInput, 'test');
    await user.keyboard('{Enter}');

    await waitFor(() => {
      expect(screen.getByText('Test Article')).toBeInTheDocument();
    });

    await user.keyboard('{Escape}');
    expect(searchInput).toHaveValue('');
  });

  it('retries failed searches', async () => {
    const user = userEvent.setup();

    mockSearchArticles
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce({
        data: [{ id: 1, title: 'Test Article', summary: 'Test summary' }],
        page: 1,
        pageSize: 10,
        total: 1
      });

    render(<SearchPage />);

    const searchInput = screen.getByPlaceholderText('Search articles...');
    await user.type(searchInput, 'test');

    await user.keyboard('{Enter}');

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });

    // Retry the search
    const retryButton = screen.getByText(/try again/i);
    await user.click(retryButton);

    await waitFor(() => {
      expect(screen.getByText('Test Article')).toBeInTheDocument();
    });
  });

  it('maintains search state during interactions', async () => {
    const user = userEvent.setup();

    mockSearchArticles.mockResolvedValue({
      data: [{ id: 1, title: 'React Article', summary: 'About React' }],
      page: 1,
      pageSize: 10,
      total: 1
    });

    render(<SearchPage />);

    const searchInput = screen.getByPlaceholderText('Search articles...');

    // Perform search
    await user.type(searchInput, 'React');
    await user.keyboard('{Enter}');

    await waitFor(() => {
      expect(screen.getByText('React Article')).toBeInTheDocument();
    });

    // Input should maintain value
    expect(searchInput).toHaveValue('React');

    // Click somewhere else and back
    await user.click(document.body);
    await user.click(searchInput);

    expect(searchInput).toHaveValue('React');
  });

  it('handles rapid search changes correctly', async () => {
    const user = userEvent.setup();

    mockSearchArticles.mockResolvedValue({
      data: [{ id: 1, title: 'Final Article', summary: 'Final result' }],
      page: 1,
      pageSize: 10,
      total: 1
    });

    render(<SearchPage />);

    const searchInput = screen.getByPlaceholderText('Search articles...');

    // Type multiple queries rapidly
    await user.type(searchInput, 'first');
    await user.clear(searchInput);
    await user.type(searchInput, 'second');
    await user.clear(searchInput);
    await user.type(searchInput, 'final');

    // Press Enter to trigger search for the final query
    await user.keyboard('{Enter}');

    await waitFor(() => {
      expect(screen.getByText('Final Article')).toBeInTheDocument();
    });

    // Should only have been called once with the final query
    expect(mockSearchArticles).toHaveBeenCalledTimes(1);
    expect(mockSearchArticles).toHaveBeenCalledWith('final', 1);
  });
});