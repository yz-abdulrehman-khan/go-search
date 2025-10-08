import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';

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
  };

  return (
    <div className={clsx(
      "relative group",
      className
    )}>
      <div className={clsx(
        "relative flex items-center transition-all duration-200 ease-in-out",
        "border rounded-xl shadow-sm bg-white/80 backdrop-blur-sm",
        "hover:shadow-md hover:bg-white/90",
        isFocused
          ? "ring-2 ring-blue-500/20 border-blue-300 shadow-lg bg-white/95"
          : "border-gray-200 hover:border-gray-300"
      )}>
        <div className="absolute left-4 flex items-center pointer-events-none">
          {loading ? (
            <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
          ) : (
            <Search className={clsx(
              "h-5 w-5 transition-colors duration-200",
              isFocused ? "text-blue-500" : "text-gray-400"
            )} />
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
          className={clsx(
            "w-full pl-12 pr-12 py-4 text-gray-900 placeholder-gray-500",
            "bg-transparent border-0 outline-none",
            "text-lg font-medium",
            "selection:bg-blue-100"
          )}
        />

        {value && (
          <button
            onClick={handleClear}
            className={clsx(
              "absolute right-4 p-1 rounded-full",
              "text-gray-400 hover:text-gray-600 hover:bg-gray-100",
              "transition-all duration-200 ease-in-out",
              "group-hover:opacity-100",
              value ? "opacity-70" : "opacity-0"
            )}
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Search suggestions hint */}
      <div className={clsx(
        "absolute top-full left-0 right-0 mt-1 px-4 py-2 text-sm text-gray-500",
        "transition-all duration-200 ease-in-out",
        isFocused && !value ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1 pointer-events-none"
      )}>
        <div className="flex items-center gap-2">
          <span>💡</span>
          <span>Try searching for "React", "TypeScript", or "API"</span>
        </div>
      </div>
    </div>
  );
};