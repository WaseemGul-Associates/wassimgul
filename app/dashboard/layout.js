import Link from 'next/link';
import { requireAuth } from '@/lib/supabase/dal';
import { createClient } from '@/lib/supabase/server';
import { logout } from '@/app/login/actions';
import DashNav from './_components/DashNav';
import TopSearch from './_components/TopSearch';
import './dashboard.css';

export const metadata = {
  title: 'Dashboard | WassimGul Portal',
};

// SVG Icons
const HomeIcon = () => <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>;
const FolderIcon = () => <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/></svg>;
const DocIcon = () => <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>;
const NotesIcon = () => <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>;
const UsersIcon = () => <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>;
const ClockIcon = () => <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>;
const SettingsIcon = () => <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.06-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.73,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.06,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.43-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.49-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/></svg>;
const MailIcon = () => <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>;


export default async function DashboardLayout({ children }) {
  const profile = await requireAuth();

  const roleName = profile.role === 'admin' ? 'Administrator' : 'Junior';
  const displayName = profile.fullName || profile.email || 'User';
  const initial = displayName.trim().charAt(0).toUpperCase();

  let newLeadsCount = 0;
  if (profile.role === 'admin') {
    const supabase = await createClient();
    const { count } = await supabase
      .from('contact_submissions')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'new');
    newLeadsCount = count || 0;
  }

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: <HomeIcon /> },
    { href: '/dashboard/cases', label: 'Cases', icon: <FolderIcon /> },
    { href: '/dashboard/orders', label: 'Daily Orders', icon: <DocIcon /> },
    { href: '/dashboard/notes', label: 'Notes', icon: <NotesIcon /> },
    ...(profile.role === 'admin'
      ? [
          { href: '/dashboard/leads', label: 'Leads', icon: <MailIcon />, badge: newLeadsCount || undefined },
          { href: '/dashboard/case-files', label: 'Case Files', icon: <FolderIcon /> },
          { href: '/dashboard/users', label: 'Team / Users', icon: <UsersIcon /> },
          { href: '/dashboard/activity', label: 'Activity Log', icon: <ClockIcon /> },
          { href: '/dashboard/settings', label: 'Settings', icon: <SettingsIcon /> },
        ]
      : []),
  ];

  return (
    <div className="dash">
      <input type="checkbox" id="dash-nav-toggle" className="dash-nav-toggle-input" />

      <aside className="dash-side">
        <div className="dash-side-top">
          <Link href="/dashboard" prefetch className="logo">
            <img src="/wassim-gul-logo.png" alt="WassimGul Logo" className="dash-side-brand-img" />
            <span className="dash-side-brand-txt">WassimGul<span style={{ color: 'var(--gold)' }}>.</span></span>
          </Link>
          <p className="dash-side-tag">Law Firm</p>
        </div>

        <DashNav items={navItems} />

        <div className="dash-side-quote">
          <p className="dash-side-quote-text">"Justice<br/>Through Dedication"</p>
        </div>
      </aside>

      <label htmlFor="dash-nav-toggle" className="dash-overlay" aria-hidden="true"></label>

      <div className="dash-main">
        <header className="dash-topbar">
          <div className="dash-topbar-left">
            <label htmlFor="dash-nav-toggle" className="dash-burger" aria-label="Toggle menu">☰</label>
            <TopSearch />
          </div>


          <div className="dash-topbar-right">
            <form action={logout} title="Click to log out">
              <button type="submit" className="top-user" style={{ background: 'none', border: 'none', padding: 0, font: 'inherit', cursor: 'pointer', outline: 'none' }}>
                <div className="top-user-info" style={{ textAlign: 'right' }}>
                  <span className="top-user-name">{displayName}</span>
                  <span className="top-user-role">{roleName}</span>
                </div>
                <div className="top-user-avatar" style={{ background: 'var(--gold)', color: 'var(--brown-deep)', fontWeight: 700, fontSize: '.85rem' }}>{initial}</div>
                <span className="top-user-chevron">▼</span>
              </button>
            </form>
          </div>
        </header>

        <div className="dash-content">{children}</div>
      </div>
    </div>
  );
}
