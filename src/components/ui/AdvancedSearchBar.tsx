import React, { useState, useRef, useEffect } from 'react';
import { Search, Mic } from 'lucide-react';
import { Input } from './input';

interface Product {
  id: string;
  name: string;
  price: number;
  brand?: string;
  category?: string;
}

interface AdvancedSearchBarProps {
  products: Product[];
  value: string;
  onChange: (value: string) => void;
  onCategoryChange?: (category: string) => void;
  onBrandChange?: (brand: string) => void;
  onPriceChange?: (min: number, max: number) => void;
  onVoiceSearch?: (value: string) => void;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
}

export const AdvancedSearchBar: React.FC<AdvancedSearchBarProps> = ({
  products,
  value,
  onChange,
  onCategoryChange,
  onBrandChange,
  onPriceChange,
  onVoiceSearch,
  category,
  brand,
  minPrice,
  maxPrice,
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    const history = localStorage.getItem('chronos_search_history');
    if (history) setSearchHistory(JSON.parse(history));
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    onChange(e.target.value);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    onChange(suggestion);
    setShowSuggestions(false);
    saveToHistory(suggestion);
  };

  const handleHistoryClick = (term: string) => {
    setInputValue(term);
    onChange(term);
    setShowSuggestions(false);
  };

  const saveToHistory = (term: string) => {
    let history = [...searchHistory];
    if (history.includes(term)) {
      history = history.filter((t) => t !== term);
    }
    history.unshift(term);
    if (history.length > 5) history = history.slice(0, 5);
    setSearchHistory(history);
    localStorage.setItem('chronos_search_history', JSON.stringify(history));
  };

  const filteredSuggestions = products
    .filter((p) =>
      p.name.toLowerCase().includes(inputValue.toLowerCase()) &&
      inputValue.trim() !== ''
    )
    .slice(0, 5);

  // Placeholder for voice search
  const handleVoiceSearch = () => {
    if (onVoiceSearch) onVoiceSearch(inputValue);
  };

  // Placeholder for advanced filters (UI only)
  // TODO: Wire up with real data and handlers
  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            ref={inputRef}
            type="text"
            placeholder="Search products..."
            value={inputValue}
            onChange={handleInputChange}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
            className="pl-10 pr-12 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white placeholder-gray-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/20 transition-all"
            autoComplete="off"
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
            onClick={handleVoiceSearch}
            tabIndex={-1}
            aria-label="Voice search"
          >
            <Mic className="w-5 h-5" />
          </button>
          {showSuggestions && filteredSuggestions.length > 0 && (
            <div 
              className="absolute left-0 right-0 mt-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-20"
              role="listbox"
              aria-label="Search suggestions"
            >
              {filteredSuggestions.map((p) => (
                <div
                  key={p.id}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                  onMouseDown={() => handleSuggestionClick(p.name)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleSuggestionClick(p.name);
                    }
                  }}
                  role="option"
                  tabIndex={0}
                  aria-selected="false"
                >
                  {p.name}
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Placeholder for price, brand, category filters */}
        <select
          className="px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white focus:border-red-500 focus:ring-4 focus:ring-red-500/20 transition-all"
          value={category || ''}
          onChange={(e) => onCategoryChange && onCategoryChange(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="men">Men</option>
          <option value="women">Women</option>
          <option value="sports">Sports</option>
        </select>
        <select
          className="px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white focus:border-red-500 focus:ring-4 focus:ring-red-500/20 transition-all"
          value={brand || ''}
          onChange={(e) => onBrandChange && onBrandChange(e.target.value)}
        >
          <option value="">All Brands</option>
          <option value="rolex">Rolex</option>
          <option value="omega">Omega</option>
          <option value="casio">Casio</option>
        </select>
        {/* Price filter placeholder */}
        <input
          type="number"
          placeholder="Min Price"
          className="w-24 px-2 py-2 rounded-xl border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white focus:border-red-500 focus:ring-4 focus:ring-red-500/20 transition-all"
          value={minPrice || ''}
          onChange={(e) => onPriceChange && onPriceChange(Number(e.target.value), maxPrice || 0)}
        />
        <input
          type="number"
          placeholder="Max Price"
          className="w-24 px-2 py-2 rounded-xl border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white focus:border-red-500 focus:ring-4 focus:ring-red-500/20 transition-all"
          value={maxPrice || ''}
          onChange={(e) => onPriceChange && onPriceChange(minPrice || 0, Number(e.target.value))}
        />
      </div>
      {/* Search history */}
      {searchHistory.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {searchHistory.map((term, idx) => (
            <button
              key={term + idx}
              className="px-3 py-1 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs hover:bg-red-500 hover:text-white transition-colors"
              onClick={() => handleHistoryClick(term)}
              type="button"
            >
              {term}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};