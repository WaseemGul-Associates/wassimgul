'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function DashboardError({ error, reset }) {
  useEffect(() => {
    console.error('Dashboard error:', error);
  }, [error]);

  return (
    <div className="dash-card" style={{ textAlign: 'center', padding: '48px 24px' }}>
      <div style={{ fontSize: '2.5rem', marginBottom: 16 }}>⚠️</div>
      <h2 style={{ fontSize: '1.4rem', fontWeight: 600, marginBottom: 8, color: 'var(--ink)' }}>
        Something went wrong
      </h2>
      <p style={{ color: 'var(--muted)', fontSize: '0.95rem', maxWidth: 460, margin: '0 auto 24px', lineHeight: 1.6 }}>
        {error?.message || 'We encountered an error loading this section. You can try refreshing the page or navigating back.'}
      </p>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
        <button
          type="button"
          onClick={() => reset()}
          className="btn btn-solid btn-sm"
        >
          Try Again
        </button>
        <Link href="/dashboard" className="btn btn-outline btn-sm">
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}
