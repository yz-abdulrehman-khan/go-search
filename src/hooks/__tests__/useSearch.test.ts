import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSearch } from '../useSearch';
import * as apiModule from '../../services/api';

// Mock the API module
vi.mock('../../services/api');
const mockSearchArticles = vi.mocked(apiModule.searchArticles);

describe('useSearch Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.clearAllTimers();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('initializes with default state', () => {
    const { result } = renderHook(() => useSearch());

    expect(result.current.articles).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.hasMore).toBe(false);
    expect(result.current.currentPage).toBe(0);
    expect(result.current.query).toBe('');
    expect(result.current.total).toBe(0);
  });

  it('performs search with debouncing', async () => {
    mockSearchArticles.mockResolvedValue({
      data: [{ id: 1, title: 'Test Article', summary: 'Test summary' }],
      page: 1,
      pageSize: 10,
      total: 1
    });

    const { result } = renderHook(() => useSearch());

    act(() => {
      result.current.search('test query');
    });

    expect(result.current.loading).toBe(false); // Not loading immediately due to debounce

    // Fast-forward past debounce delay and wait for the promise to resolve
    await act(async () => {
      vi.advanceTimersByTime(300);
      await vi.runAllTimersAsync();
    });

    expect(mockSearchArticles).toHaveBeenCalledWith('test query', 1);
    expect(result.current.articles).toHaveLength(1);
    expect(result.current.query).toBe('test query');
    expect(result.current.loading).toBe(false);
  });

  it('clears search when empty query is provided', async () => {
    const { result } = renderHook(() => useSearch());

    act(() => {
      result.current.search('');
    });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(mockSearchArticles).not.toHaveBeenCalled();
    expect(result.current.articles).toEqual([]);
    expect(result.current.query).toBe('');
  });

  it('handles search errors gracefully', async () => {
    mockSearchArticles.mockRejectedValue(new Error('API Error'));

    const { result } = renderHook(() => useSearch());

    act(() => {
      result.current.search('test');
    });

    await act(async () => {
      vi.advanceTimersByTime(300);
      await vi.runAllTimersAsync();
    });

    expect(result.current.error).toBe('API Error');
    expect(result.current.articles).toEqual([]);
    expect(result.current.loading).toBe(false);
  });

  it('cancels previous requests when new search is initiated', async () => {
    const { result } = renderHook(() => useSearch());

    // Start first search
    act(() => {
      result.current.search('first');
    });

    // Start second search before first completes
    act(() => {
      result.current.search('second');
    });

    await act(async () => {
      vi.advanceTimersByTime(300);
      await vi.runAllTimersAsync();
    });

    // Only the second search should be called
    expect(mockSearchArticles).toHaveBeenCalledTimes(1);
    expect(mockSearchArticles).toHaveBeenCalledWith('second', 1);
  });

  it('loads more articles correctly', async () => {
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

    const { result } = renderHook(() => useSearch());

    // Initial search
    act(() => {
      result.current.search('test');
    });

    await act(async () => {
      vi.advanceTimersByTime(300);
      await vi.runAllTimersAsync();
    });

    expect(result.current.articles).toHaveLength(1);
    expect(result.current.hasMore).toBe(true);

    // Load more
    await act(async () => {
      await result.current.loadMore();
    });

    expect(result.current.articles).toHaveLength(2);
    expect(result.current.currentPage).toBe(2);
    expect(mockSearchArticles).toHaveBeenCalledWith('test', 2);
  });

  it('prevents loading more when already loading', async () => {
    const { result } = renderHook(() => useSearch());

    // First, set up state with some articles and hasMore = true
    mockSearchArticles.mockResolvedValueOnce({
      data: [{ id: 1, title: 'Article 1', summary: 'Summary 1' }],
      page: 1,
      pageSize: 10,
      total: 20
    });

    act(() => {
      result.current.search('test');
    });

    await act(async () => {
      vi.advanceTimersByTime(300);
      await vi.runAllTimersAsync();
    });

    expect(result.current.hasMore).toBe(true);

    // Now mock loadMore to never resolve
    mockSearchArticles.mockImplementation(() => new Promise(() => {}));

    // Start loadMore (will be loading)
    act(() => {
      result.current.loadMore();
    });

    expect(result.current.loading).toBe(true);

    // Try to load more again while already loading
    await act(async () => {
      await result.current.loadMore();
    });

    // Should only have been called twice (once for search, once for first loadMore)
    expect(mockSearchArticles).toHaveBeenCalledTimes(2);
  });

  it('prevents loading more when no more articles available', async () => {
    mockSearchArticles.mockResolvedValue({
      data: [{ id: 1, title: 'Article 1', summary: 'Summary 1' }],
      page: 1,
      pageSize: 10,
      total: 1
    });

    const { result } = renderHook(() => useSearch());

    act(() => {
      result.current.search('test');
    });

    await act(async () => {
      vi.advanceTimersByTime(300);
      await vi.runAllTimersAsync();
    });

    expect(result.current.hasMore).toBe(false);

    await act(async () => {
      await result.current.loadMore();
    });

    // Should only have been called once (for initial search)
    expect(mockSearchArticles).toHaveBeenCalledTimes(1);
  });

  it('handles load more errors', async () => {
    mockSearchArticles
      .mockResolvedValueOnce({
        data: [{ id: 1, title: 'Article 1', summary: 'Summary 1' }],
        page: 1,
        pageSize: 10,
        total: 20
      })
      .mockRejectedValueOnce(new Error('Load more error'));

    const { result } = renderHook(() => useSearch());

    // Initial search
    act(() => {
      result.current.search('test');
    });

    await act(async () => {
      vi.advanceTimersByTime(300);
      await vi.runAllTimersAsync();
    });

    expect(result.current.articles).toHaveLength(1);

    // Load more with error
    await act(async () => {
      await result.current.loadMore();
    });

    expect(result.current.error).toBe('Load more error');
    expect(result.current.loading).toBe(false);
  });

  it('clears search state correctly', async () => {
    mockSearchArticles.mockResolvedValue({
      data: [{ id: 1, title: 'Article 1', summary: 'Summary 1' }],
      page: 1,
      pageSize: 10,
      total: 1
    });

    const { result } = renderHook(() => useSearch());

    // Perform search
    act(() => {
      result.current.search('test');
    });

    await act(async () => {
      vi.advanceTimersByTime(300);
      await vi.runAllTimersAsync();
    });

    expect(result.current.articles).toHaveLength(1);

    // Clear search
    act(() => {
      result.current.clearSearch();
    });

    expect(result.current.articles).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.hasMore).toBe(false);
    expect(result.current.currentPage).toBe(0);
    expect(result.current.query).toBe('');
    expect(result.current.total).toBe(0);
  });

  it('cleans up timers and requests on unmount', () => {
    const { unmount } = renderHook(() => useSearch());

    // This should not throw any errors
    unmount();
  });

  it('handles AbortError gracefully', async () => {
    const abortError = new Error('Request aborted');
    abortError.name = 'AbortError';
    mockSearchArticles.mockRejectedValue(abortError);

    const { result } = renderHook(() => useSearch());

    act(() => {
      result.current.search('test');
    });

    await act(async () => {
      vi.advanceTimersByTime(300);
      await vi.runAllTimersAsync();
    });

    // Should not set error state for AbortError
    expect(result.current.error).toBe(null);
    // Loading state should be true since the SEARCH_START was dispatched but SEARCH_SUCCESS was not called due to abort
    expect(result.current.loading).toBe(true);
  });
});