'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback } from 'react';

export default function DashNav({ items }) {
  const pathname = usePathname();
  const router = useRouter();

  const handlePrefetch = useCallback((href) => {
    if (href) {
      router.prefetch(href);
    }
  }, [router]);

  return (
    <nav className="dash-nav" aria-label="Sidebar Navigation">
      {items.map((item) => {
        const active = item.href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            prefetch={true}
            onMouseEnter={() => handlePrefetch(item.href)}
            onFocus={() => handlePrefetch(item.href)}
            onTouchStart={() => handlePrefetch(item.href)}
            className={active ? 'active' : ''}
          >
            {item.icon}
            <span>{item.label}</span>
            {item.badge ? <span className="dash-nav-badge">{item.badge}</span> : null}
          </Link>
        );
      })}
    </nav>
  );
}

