import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2 } from 'lucide-react';

interface SearchInputProps {
  onSearch: (query: string) => void;
  onClear: () => void;
  loading?: boolean;
  placeholder?: string;
  className?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  onSearch,
  onClear,
  loading = false,
  placeholder = "Search articles...",
  className,
}) => {
  const [value, setValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    onSearch(value);
  }, [value, onSearch]);

  const handleClear = () => {
    setValue('');
    onClear();
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClear();
    }

    // Focus management for accessibility
    if (e.key === 'Enter') {
      e.preventDefault();
      // Trigger search immediately without waiting for debounce
      onSearch(value);
    }
  };

  return (
    <div className={`search-input-container ${className || ''}`} data-testid="search-input-container">
      <div className="search-icon">
        {loading ? (
          <Loader2 className="animate-spin" data-testid="loading-spinner" />
        ) : (
          <Search data-testid="search-icon" />
        )}
      </div>

      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="search-input"
      />

      {value && (
        <button
          onClick={handleClear}
          className="search-clear-btn"
          aria-label="Clear search"
        >
          <X style={{ width: '1rem', height: '1rem' }} />
        </button>
      )}

    </div>
  );
};