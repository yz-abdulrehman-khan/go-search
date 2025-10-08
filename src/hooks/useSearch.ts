import { useReducer, useCallback, useRef, useEffect } from 'react';
import type { SearchState, SearchAction } from '../types/index';
import { searchArticles } from '../services/api';

const initialState: SearchState = {
  articles: [],
  loading: false,
  error: null,
  hasMore: false,
  currentPage: 0,
  query: '',
  total: 0,
};

const searchReducer = (state: SearchState, action: SearchAction): SearchState => {
  switch (action.type) {
    case 'SEARCH_START':
      return {
        ...state,
        loading: true,
        error: null,
        query: action.payload.query,
        currentPage: action.payload.isNewSearch ? 1 : state.currentPage,
        articles: action.payload.isNewSearch ? [] : state.articles,
      };

    case 'SEARCH_SUCCESS':
      return {
        ...state,
        loading: false,
        articles: action.payload.data,
        currentPage: action.payload.page,
        total: action.payload.total,
        hasMore: action.payload.page * action.payload.pageSize < action.payload.total,
        error: null,
      };

    case 'SEARCH_ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case 'LOAD_MORE_START':
      return {
        ...state,
        loading: true,
        error: null,
      };

    case 'LOAD_MORE_SUCCESS':
      return {
        ...state,
        loading: false,
        articles: [...state.articles, ...action.payload.data],
        currentPage: action.payload.page,
        hasMore: action.payload.page * action.payload.pageSize < action.payload.total,
        error: null,
      };

    case 'LOAD_MORE_ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case 'CLEAR_SEARCH':
      return initialState;

    default:
      return state;
  }
};

export const useSearch = () => {
  const [state, dispatch] = useReducer(searchReducer, initialState);
  const debounceTimerRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const currentRequestRef = useRef<AbortController | null>(null);

  const search = useCallback(async (query: string, debounceMs: number = 300) => {
    // Clear previous debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Cancel previous request
    if (currentRequestRef.current) {
      currentRequestRef.current.abort();
    }

    if (!query.trim()) {
      dispatch({ type: 'CLEAR_SEARCH' });
      return;
    }

    debounceTimerRef.current = setTimeout(async () => {
      try {
        dispatch({ type: 'SEARCH_START', payload: { query, isNewSearch: true } });

        const abortController = new AbortController();
        currentRequestRef.current = abortController;

        const response = await searchArticles(query, 1);

        if (!abortController.signal.aborted) {
          dispatch({ type: 'SEARCH_SUCCESS', payload: response });
        }
      } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
          dispatch({ type: 'SEARCH_ERROR', payload: error.message });
        }
      }
    }, debounceMs);
  }, []);

  const loadMore = useCallback(async () => {
    if (state.loading || !state.hasMore) return;

    try {
      dispatch({ type: 'LOAD_MORE_START' });

      const response = await searchArticles(state.query, state.currentPage + 1);
      dispatch({ type: 'LOAD_MORE_SUCCESS', payload: response });
    } catch (error) {
      dispatch({
        type: 'LOAD_MORE_ERROR',
        payload: error instanceof Error ? error.message : 'Failed to load more articles'
      });
    }
  }, [state.loading, state.hasMore, state.query, state.currentPage]);

  const clearSearch = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    if (currentRequestRef.current) {
      currentRequestRef.current.abort();
    }
    dispatch({ type: 'CLEAR_SEARCH' });
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      if (currentRequestRef.current) {
        currentRequestRef.current.abort();
      }
    };
  }, []);

  return {
    ...state,
    search,
    loadMore,
    clearSearch,
  };
};