'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function CasesFilterBar({ action = '/dashboard/cases', q = '', status = '', court = '', courts = [] }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState(q);
  const [selectedStatus, setSelectedStatus] = useState(status);
  const [selectedCourt, setSelectedCourt] = useState(court);

  function handleSubmit(e) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set('q', searchQuery.trim());
    if (selectedStatus) params.set('status', selectedStatus);
    if (selectedCourt) params.set('court', selectedCourt);

    const queryStr = params.toString();
    router.push(`${action}${queryStr ? `?${queryStr}` : ''}`);
  }

  return (
    <form className="dash-toolbar" onSubmit={handleSubmit}>
      <input
        type="text"
        name="q"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search by case number, title or client…"
        className="dash-search"
        aria-label="Filter cases"
      />
      <select
        name="status"
        value={selectedStatus}
        onChange={(e) => setSelectedStatus(e.target.value)}
        className="dash-select"
        aria-label="Filter by status"
      >
        <option value="">All Status</option>
        <option value="active">Active</option>
        <option value="pending">Pending</option>
        <option value="closed">Closed</option>
      </select>
      {courts.length > 0 && (
        <select
          name="court"
          value={selectedCourt}
          onChange={(e) => setSelectedCourt(e.target.value)}
          className="dash-select"
          aria-label="Filter by court"
        >
          <option value="">All Courts</option>
          {courts.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      )}
      <button type="submit" className="btn btn-outline btn-sm">Filter</button>
    </form>
  );
}

