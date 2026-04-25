'use client';

import { useState, useCallback } from 'react';
import { Search } from 'lucide-react';

export interface SearchInputProps {
  onSearch: (query: string) => void | (() => void);
  placeholder?: string;
}

export default function SearchInput({
  onSearch,
  placeholder = 'Search...',
}: SearchInputProps) {
  const [query, setQuery] = useState('');

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setQuery(value);
      onSearch(value);
    },
    [onSearch]
  );

  return (
    <div className="relative">
      <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        aria-label="Search users"
      />
    </div>
  );
}
