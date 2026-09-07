"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  // Close menu automatically on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Close menu when window resizes beyond mobile breakpoint
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 860) {
        setMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <header className="nav">
      <div className="nav-in">
        <Link href="/" className="logo" onClick={closeMenu} style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
          <img src="/wassim-gul-logo.png" alt="WassimGul Logo" className="brand-img" />
          <span className="brand-txt">WassimGul<span style={{ color: 'var(--gold)' }}>.</span></span>
        </Link>
        <nav>
          <ul className={`nav-menu ${menuOpen ? 'open' : ''}`} id="menu">
            <li>
              <Link href={pathname === '/' ? '#top' : '/'} onClick={closeMenu} className={pathname === '/' ? 'here' : ''}>
                Home
              </Link>
            </li>
            <li>
              <Link href="/about" onClick={closeMenu} className={pathname === '/about' ? 'here' : ''}>
                About
              </Link>
            </li>
            <li>
              <Link href={pathname === '/' ? '#stories' : '/#stories'} onClick={closeMenu}>
                Case Study
              </Link>
            </li>
            <li>
              <Link href={pathname === '/' ? '#services' : '/#services'} onClick={closeMenu}>
                Services
              </Link>
            </li>
            <li>
              <Link href="/contact" onClick={closeMenu} className={`btn btn-solid ${pathname === '/contact' ? 'here' : ''}`}>
                Contact Us
              </Link>
            </li>
          </ul>
        </nav>
        <button
          className="burger"
          id="burger"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="menu"
          onClick={toggleMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  );
}
