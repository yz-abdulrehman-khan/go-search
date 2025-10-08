export interface Article {
  id: number;
  title: string;
  summary: string;
}

export interface SearchResponse {
  data: Article[];
  page: number;
  pageSize: number;
  total: number;
}

export interface SearchState {
  articles: Article[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  currentPage: number;
  query: string;
  total: number;
}

export type SearchAction =
  | { type: 'SEARCH_START'; payload: { query: string; isNewSearch: boolean } }
  | { type: 'SEARCH_SUCCESS'; payload: SearchResponse }
  | { type: 'SEARCH_ERROR'; payload: string }
  | { type: 'LOAD_MORE_START' }
  | { type: 'LOAD_MORE_SUCCESS'; payload: SearchResponse }
  | { type: 'LOAD_MORE_ERROR'; payload: string }
  | { type: 'CLEAR_SEARCH' };