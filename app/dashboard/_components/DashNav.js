'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function DashNav({ items }) {
  const pathname = usePathname();

  return (
    <nav className="dash-nav">
      {items.map((item) => {
        const active = item.href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(item.href);
        return (
          <Link key={item.href} href={item.href} prefetch className={active ? 'active' : ''}>
            {item.icon}
            {item.label}
            {item.badge ? <span className="dash-nav-badge">{item.badge}</span> : null}
          </Link>
        );
      })}
    </nav>
  );
}
