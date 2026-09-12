'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

export default function TopSearch() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      router.push(`/dashboard/cases?q=${encodeURIComponent(trimmed)}`);
    } else {
      router.push('/dashboard/cases');
    }
  }

  return (
    <form className="top-search-wrap" onSubmit={handleSubmit} role="search">
      <SearchIcon />
      <input
        type="text"
        name="q"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => router.prefetch('/dashboard/cases')}
        className="top-search-input"
        placeholder="Search cases…"
        aria-label="Search cases"
      />
    </form>
  );
}
