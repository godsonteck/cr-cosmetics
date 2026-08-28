'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '@/types';
import { searchProducts } from '@/services/productService';

interface SearchContextType {
  isOpen: boolean;
  query: string;
  results: Product[];
  recentSearches: string[];
  setQuery: (q: string) => void;
  openSearch: (initialQuery?: string) => void;
  closeSearch: () => void;
  saveRecentSearch: (searchTerm: string) => void;
  clearRecentSearches: () => void;
}

const SearchContext = createContext<SearchContextType | null>(null);
const RECENT_SEARCHES_KEY = 'cr_recent_searches_v1';

export function SearchProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<Product[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (saved) {
        setRecentSearches(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Could not read recent searches from localStorage', e);
    }
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const timer = setTimeout(() => {
      const hits = searchProducts(query);
      setResults(hits);
    }, 150);

    return () => clearTimeout(timer);
  }, [query]);

  const openSearch = (initialQuery = '') => {
    if (initialQuery) setQuery(initialQuery);
    setIsOpen(true);
  };

  const closeSearch = () => {
    setIsOpen(false);
  };

  const saveRecentSearch = (searchTerm: string) => {
    if (!searchTerm || !searchTerm.trim()) return;
    const term = searchTerm.trim();
    setRecentSearches((prev) => {
      const filtered = prev.filter((s) => s.toLowerCase() !== term.toLowerCase());
      const updated = [term, ...filtered].slice(0, 6);
      try {
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn(e);
      }
      return updated;
    });
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    try {
      localStorage.removeItem(RECENT_SEARCHES_KEY);
    } catch (e) {
      console.warn(e);
    }
  };

  return (
    <SearchContext.Provider
      value={{
        isOpen,
        query,
        results,
        recentSearches,
        setQuery,
        openSearch,
        closeSearch,
        saveRecentSearch,
        clearRecentSearches,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}
