'use client';

import { useRouter } from 'next/navigation';

export default function CaseSelectFilter({ basePath = '/dashboard/orders', currentCase = '', cases = [] }) {
  const router = useRouter();

  function handleChange(e) {
    const val = e.target.value;
    if (val) {
      router.push(`${basePath}?case=${encodeURIComponent(val)}`);
    } else {
      router.push(basePath);
    }
  }

  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
      <select
        value={currentCase}
        onChange={handleChange}
        className="dash-select"
        aria-label="Filter by case"
      >
        <option value="">All Cases</option>
        {(cases || []).map((c) => (
          <option key={c.id} value={c.id}>
            {c.case_number}{c.title ? ` - ${c.title}` : ''}
          </option>
        ))}
      </select>
    </div>
  );
}
