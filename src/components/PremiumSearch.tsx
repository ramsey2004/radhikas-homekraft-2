'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Clock, TrendingUp, X } from 'lucide-react';


/**
 * Premium Search Component
 * Features: Autocomplete, recent searches, trending items, category filtering, keyboard navigation
 */

interface SearchSuggestion {
  id: string;
  title: string;
  category: string;
  price?: number;
  image?: string;
  type: 'product' | 'category' | 'trending' | 'recent';
}

interface PremiumSearchProps {
  onSearch?: (query: string) => void;
  suggestions?: SearchSuggestion[];
  className?: string;
}

// Sample data - replace with actual API calls
const SAMPLE_PRODUCTS = [
  { id: '1', title: 'Block Print Cotton Bedsheet', category: 'Bedsheets', price: 2499 },
  { id: '2', title: 'Handwoven Jaipur Rug', category: 'Rugs', price: 8999 },
  { id: '3', title: 'Wall Hanging Tapestry', category: 'Wall Art', price: 1599 },
  { id: '4', title: 'Embroidered Cushion Cover', category: 'Cushions', price: 899 },
  { id: '5', title: 'Hand-painted Ceramic Bowl', category: 'Tableware', price: 599 },
  { id: '6', title: 'Block Print Throw', category: 'Textiles', price: 1299 },
];

const CATEGORIES = [
  { id: 'bedsheets', name: 'Bedsheets' },
  { id: 'rugs', name: 'Rugs' },
  { id: 'wall-art', name: 'Wall Art' },
  { id: 'cushions', name: 'Cushions' },
  { id: 'tableware', name: 'Tableware' },
  { id: 'textiles', name: 'Textiles' },
];

const TRENDING = [
  { id: 'trend-1', title: 'Block Print Designs', category: 'Trending', type: 'trending' as const },
  { id: 'trend-2', title: 'Handwoven Rugs', category: 'Trending', type: 'trending' as const },
  { id: 'trend-3', title: 'Embroidered Collections', category: 'Trending', type: 'trending' as const },
];

export function PremiumSearch({ onSearch, className = '' }: PremiumSearchProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Filter and generate suggestions
  const generateSuggestions = useCallback((): SearchSuggestion[] => {
    const suggestions: SearchSuggestion[] = [];

    if (query.trim()) {
      // Add matching products
      const matchingProducts = SAMPLE_PRODUCTS.filter(
        (p) =>
          p.title.toLowerCase().includes(query.toLowerCase()) &&
          (!selectedCategory || p.category.toLowerCase() === selectedCategory.toLowerCase())
      ).map((p) => ({
        ...p,
        type: 'product' as const,
      }));

      suggestions.push(...matchingProducts.slice(0, 5));

      // Add matching categories
      const matchingCategories = CATEGORIES.filter((c) =>
        c.name.toLowerCase().includes(query.toLowerCase())
      ).map((c) => ({
        id: c.id,
        title: c.name,
        category: 'Category',
        type: 'category' as const,
      }));

      suggestions.push(...matchingCategories.slice(0, 3));
    } else {
      // Show trending and recent when no query
      if (recentSearches.length > 0) {
        suggestions.push(...recentSearches.slice(0, 3).map((search) => ({
          id: `recent-${search}`,
          title: search,
          category: 'Recent Searches',
          type: 'recent' as const,
        })));
      }

      suggestions.push(...TRENDING.slice(0, 3));
    }

    return suggestions;
  }, [query, selectedCategory, recentSearches]);

  const suggestions = generateSuggestions();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSuggestionClick(suggestions[selectedIndex]);
        } else if (query.trim()) {
          handleSearch(query);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
      default:
        break;
    }
  };

  const handleSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    // Add to recent searches
    const updated = [searchQuery, ...recentSearches.filter((s) => s !== searchQuery)].slice(0, 10);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));

    onSearch?.(searchQuery);
    setQuery('');
    setIsOpen(false);
    setSelectedIndex(-1);
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    if (suggestion.type === 'category') {
      setSelectedCategory(suggestion.id);
      setQuery('');
      setSelectedIndex(-1);
    } else if (suggestion.type === 'recent' || suggestion.type === 'trending') {
      handleSearch(suggestion.title);
    } else {
      // Product
      handleSearch(suggestion.title);
    }
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  return (
    <div
      ref={searchRef}
      className={`relative w-full ${className}`}
    >
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <input
          ref={inputRef}
          type="search"
          placeholder="Search bedsheets, rugs, cushions..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setSelectedIndex(-1);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm transition-all focus:border-primary-600 focus:bg-white focus:outline-none focus:shadow-sm"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setSelectedIndex(-1);
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Category Filter Pills */}
      {selectedCategory && (
        <motion.div
          initial={false}
          animate={false}
          className="mt-2 flex items-center gap-2"
        >
          <span className="text-xs text-gray-600">Filtered by:</span>
          <div className="inline-flex items-center gap-2 rounded-full bg-primary-100 px-3 py-1">
            <span className="text-xs font-medium text-primary-700">{selectedCategory}</span>
            <button
              onClick={() => setSelectedCategory('')}
              className="text-primary-600 hover:text-primary-700"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        </motion.div>
      )}

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full z-50 mt-2 w-full rounded-lg border border-gray-200 bg-white shadow-lg"
          >
            <div className="max-h-96 overflow-y-auto">
              {suggestions.map((suggestion, index) => (
                <motion.button
                  key={suggestion.id}
                  onClick={() => handleSuggestionClick(suggestion)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`w-full border-b border-gray-100 px-4 py-3 text-left transition-colors last:border-b-0 ${
                    index === selectedIndex
                      ? 'bg-primary-50'
                      : 'hover:bg-gray-50'
                  }`}
                  whileHover={{ paddingLeft: '1.25rem' }}
                  initial={false}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        {suggestion.type === 'recent' && <Clock className="h-4 w-4 text-gray-400" />}
                        {suggestion.type === 'trending' && <TrendingUp className="h-4 w-4 text-orange-500" />}
                        <p className="font-medium text-gray-900">{suggestion.title}</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        {suggestion.category}
                        {suggestion.price && ` • ₹${suggestion.price}`}
                      </p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Footer - Recent searches clear button */}
            {!query && recentSearches.length > 0 && (
              <div className="border-t border-gray-100 px-4 py-2">
                <button
                  onClick={clearRecentSearches}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  Clear recent searches
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* No results message */}
      {isOpen && query && suggestions.length === 0 && (
        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full z-50 mt-2 w-full rounded-lg border border-gray-200 bg-white px-4 py-8 text-center shadow-lg"
        >
          <p className="text-sm text-gray-500">No results found for &quot;{query}&quot;</p>
        </motion.div>
      )}
    </div>
  );
}
