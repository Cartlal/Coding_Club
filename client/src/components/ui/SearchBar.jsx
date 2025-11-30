import { useState, useCallback } from 'react';

/**
 * SearchBar Component
 * Search input with optional icon, dropdown suggestions, and loading state
 * 
 * @component
 * @example
 * <SearchBar
 *   placeholder="Search events..."
 *   onSearch={(query) => console.log(query)}
 *   suggestions={['React', 'Node.js', 'Python']}
 * />
 * 
 * @param {string} placeholder - Placeholder text
 * @param {Function} onSearch - Callback when search value changes
 * @param {Function} onSubmit - Callback when form is submitted
 * @param {Array} suggestions - Array of suggested items to show
 * @param {boolean} isLoading - Show loading state
 * @param {boolean} clearable - Show clear button (default: true)
 * @param {string} size - 'sm' | 'md' | 'lg' (default: 'md')
 * @param {string} className - Additional CSS classes
 * @returns {JSX.Element}
 */
export default function SearchBar({
  placeholder = 'Search...',
  onSearch = () => {},
  onSubmit = () => {},
  suggestions = [],
  isLoading = false,
  clearable = true,
  size = 'md',
  className = '',
  ...props
}) {
  const [value, setValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleChange = useCallback(
    (e) => {
      const newValue = e.target.value;
      setValue(newValue);
      onSearch(newValue);
      setShowSuggestions(newValue.length > 0);
    },
    [onSearch]
  );

  const handleClear = useCallback(() => {
    setValue('');
    setShowSuggestions(false);
    onSearch('');
  }, [onSearch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(value);
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion) => {
    setValue(suggestion);
    setShowSuggestions(false);
    onSearch(suggestion);
    onSubmit(suggestion);
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-5 py-3 text-lg',
  };

  return (
    <form onSubmit={handleSubmit} className={`relative w-full ${className}`}>
      <div className="relative">
        {/* Search Icon */}
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          {isLoading ? (
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          )}
        </div>

        {/* Input */}
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          onFocus={() => value.length > 0 && setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          className={`${sizes[size]} pl-10 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed`}
          disabled={isLoading}
          {...props}
        />

        {/* Clear Button */}
        {clearable && value && !isLoading && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
            aria-label="Clear search"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
            </svg>
          </button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors duration-150 first:rounded-t-lg last:rounded-b-lg"
            >
              <span className="text-gray-700">{suggestion}</span>
            </button>
          ))}
        </div>
      )}
    </form>
  );
}
