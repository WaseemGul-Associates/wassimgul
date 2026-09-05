import Link from 'next/link';

function StatusBadge({ status }) {
  if (!status) return null;
  const normalized = status.toLowerCase();
  const display = status.charAt(0).toUpperCase() + status.slice(1);
  return <span className={`badge badge-${normalized}`}>{display}</span>;
}

// Icons for stats
const FolderIcon = () => <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>;
const ScaleIcon = () => <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 14h18M5 14v4a2 2 0 0 0 4 0v-4M15 14v4a2 2 0 0 0 4 0v-4M12 3v18M9 6h6"></path></svg>;
const CheckDocIcon = () => <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><polyline points="9 15 11 17 15 13"></polyline></svg>;
const ClockIcon = () => <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>;

// Icons for activity
const UploadIcon = () => <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>;
const FileTextIcon = () => <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>;
const FolderActivityIcon = () => <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>;
const MailIcon = () => <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>;

const ACTIVITY_ICON = {
  file_uploaded: [UploadIcon, 'blue'],
  file_deleted: [UploadIcon, 'blue'],
  order_added: [FileTextIcon, 'yellow'],
  order_updated: [FileTextIcon, 'yellow'],
  order_deleted: [FileTextIcon, 'yellow'],
  note_added: [FileTextIcon, 'green'],
  note_updated: [FileTextIcon, 'green'],
  note_deleted: [FileTextIcon, 'green'],
  lead_submitted: [MailIcon, 'red'],
};

function timeAgo(dateStr) {
  return new Date(dateStr).toLocaleString('en-GB', {
    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
  });
}

function SideList({ items }) {
  if (!items || items.length === 0) {
    return <p style={{ color: 'var(--muted)', fontSize: '.88rem' }}>No entries yet.</p>;
  }
  return (
    <div className="side-list">
      {items.map((item) => {
        const d = new Date(item.entry_date);
        return (
          <div className="side-item" key={item.id}>
            <div className="side-date-box">
              <span className="side-date-d">{d.toLocaleDateString('en-GB', { day: '2-digit' })}</span>
              <span className="side-date-m">{d.toLocaleDateString('en-GB', { month: 'short' })}</span>
            </div>
            <div className="side-item-content">
              <div className="side-item-title">{item.content.length > 60 ? `${item.content.slice(0, 60)}…` : item.content}</div>
              <div className="side-item-sub">
                <span>{item.cases?.case_number || '—'}</span>
                <span>By {item.profiles?.full_name || 'Unknown'}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function AdminDashboard({ profile, stats, cases, activity, orders, notes }) {
  const displayName = profile.fullName || profile.email || 'Admin';
  const today = new Date();
  const dateStr = today.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <>
      <div className="dash-header" style={{ alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem' }}>Welcome Back, {displayName}</h1>
          <p>Here's an overview of your firm's cases and activities.</p>
        </div>
        <div className="dash-header-actions">
          <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end' }}>
               <ClockIcon /> {dateStr}
            </div>
          </div>
          <Link href="/dashboard/cases/new" className="btn btn-solid" style={{ background: 'var(--gold)', color: '#fff', border: 'none' }}>+ Add New Case</Link>
        </div>
      </div>

      <div className="stats-row">
        <div className="stat-card-new">
          <div className="stat-icon-wrap stat-icon-blue"><FolderIcon /></div>
          <div className="stat-info">
            <span className="stat-label">Total Cases</span>
            <span className="stat-value">{stats.total}</span>
          </div>
        </div>
        <div className="stat-card-new">
          <div className="stat-icon-wrap stat-icon-blue"><ScaleIcon /></div>
          <div className="stat-info">
            <span className="stat-label">Active Cases</span>
            <span className="stat-value">{stats.active}</span>
          </div>
        </div>
        <div className="stat-card-new">
          <div className="stat-icon-wrap stat-icon-green"><CheckDocIcon /></div>
          <div className="stat-info">
            <span className="stat-label">Closed Cases</span>
            <span className="stat-value">{stats.closed}</span>
          </div>
        </div>
        <div className="stat-card-new">
          <div className="stat-icon-wrap stat-icon-red"><ClockIcon /></div>
          <div className="stat-info">
            <span className="stat-label">Pending Cases</span>
            <span className="stat-value">{stats.pending}</span>
          </div>
        </div>
      </div>

      <div className="dash-layout-grid">
        {/* LEFT COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

          {/* Recent Cases */}
          <div className="dash-card" style={{ padding: '24px 20px', margin: 0 }}>
            <div className="card-title-row">
              <h2>Recent Cases</h2>
              <Link href="/dashboard/cases" className="card-view-all">View All</Link>
            </div>

            {(!cases || cases.length === 0) && (
              <div className="dash-empty" style={{ padding: '30px' }}>No cases yet — <Link href="/dashboard/cases/new">create the first one</Link>.</div>
            )}

            {cases && cases.length > 0 && (
              <div className="dash-table-wrap" style={{ border: 'none' }}>
                <table className="dash-table">
                  <thead>
                    <tr>
                      <th>Case Number</th>
                      <th>Client Name</th>
                      <th>Case Title</th>
                      <th>Status</th>
                      <th>Last Updated</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {cases.map((c) => (
                      <tr key={c.id}>
                        <td><Link href={`/dashboard/cases/${c.id}`} className="row-link">{c.case_number}</Link></td>
                        <td>{c.client_name}</td>
                        <td>{c.title || '—'}</td>
                        <td><StatusBadge status={c.status} /></td>
                        <td>{new Date(c.updated_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                        <td><Link href={`/dashboard/cases/${c.id}/edit`} className="btn btn-outline btn-sm">Edit</Link></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div className="dash-card" style={{ padding: '24px 20px', margin: 0 }}>
            <div className="card-title-row">
              <h2>Recent Activity</h2>
              <Link href="/dashboard/activity" className="card-view-all">View All</Link>
            </div>
            {(!activity || activity.length === 0) && (
              <p style={{ color: 'var(--muted)', fontSize: '.88rem' }}>No activity recorded yet.</p>
            )}
            {activity && activity.length > 0 && (
              <div className="activity-list">
                {activity.map((a) => {
                  const [Icon, color] = ACTIVITY_ICON[a.action] || [FolderActivityIcon, 'blue'];
                  return (
                    <div className="activity-item" key={a.id}>
                      <div className={`activity-icon ${color}`}><Icon /></div>
                      <div className="activity-desc">{a.description}</div>
                      <div className="activity-time">{timeAgo(a.created_at)}</div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

          {/* Recent Daily Orders */}
          <div className="dash-card" style={{ padding: '24px 20px', margin: 0 }}>
            <div className="card-title-row">
              <h2>Recent Daily Orders</h2>
              <Link href="/dashboard/orders" className="card-view-all">View All</Link>
            </div>
            <SideList items={orders} />
          </div>

          {/* Recent Notes */}
          <div className="dash-card" style={{ padding: '24px 20px', margin: 0 }}>
            <div className="card-title-row">
              <h2>Recent Notes</h2>
              <Link href="/dashboard/notes" className="card-view-all">View All</Link>
            </div>
            <SideList items={notes} />
          </div>

          {/* Promo Banner */}
          <div className="promo-banner">
            <h3 className="promo-title">Commitment.<br/>Clarity. Justice.</h3>
            <span className="promo-logo">WassimGul Law Firm</span>
          </div>

        </div>
      </div>
    </>
  );
}
