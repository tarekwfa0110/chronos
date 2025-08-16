import React, { useState, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';
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
  category?: string;
  brand?: string;
}

export const AdvancedSearchBar: React.FC<AdvancedSearchBarProps> = ({
  products,
  value,
  onChange,
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
            className="pl-10 pr-4 py-3 rounded-xl border-2 border-border bg-background text-foreground placeholder-muted-foreground focus:border-red-500 focus:ring-4 focus:ring-red-500/20 transition-all"
            autoComplete="off"
          />
          {showSuggestions && filteredSuggestions.length > 0 && (
            <div 
              className="absolute left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-lg z-20"
              role="listbox"
              aria-label="Search suggestions"
            >
              {filteredSuggestions.map((p) => (
                <div
                  key={p.id}
                  className="px-4 py-2 cursor-pointer hover:bg-muted"
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

      </div>
      {/* Search history */}
      {searchHistory.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {searchHistory.map((term, idx) => (
            <button
              key={term + idx}
              className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs hover:bg-red-500 hover:text-white transition-colors"
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