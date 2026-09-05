import Link from 'next/link';
import AddUpdateForm from './AddUpdateForm';

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

// Specific icons for staff view
const FileIcon = () => <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>;
const SearchIcon = () => <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
const AddNoteIcon = () => <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>;

function UpdatesTable({ items, kind, currentUserId }) {
  if (!items || items.length === 0) {
    return <p style={{ color: 'var(--muted)', fontSize: '.85rem', padding: '4px 0' }}>No {kind === 'order' ? 'daily orders' : 'notes'} yet.</p>;
  }
  return (
    <div className="dash-table-wrap" style={{ border: 'none', overflowX: 'auto' }}>
      <table className="dash-table small-table">
        <thead>
          <tr><th>Date</th><th>Case Number</th><th>{kind === 'order' ? 'Order' : 'Note'}</th><th>Added By</th></tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{new Date(item.entry_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
              <td>{item.cases?.case_number || '—'}</td>
              <td>{item.content.length > 40 ? `${item.content.slice(0, 40)}…` : item.content}</td>
              <td>{item.created_by === currentUserId ? 'You' : (item.profiles?.full_name || 'Unknown')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function StaffDashboard({ profile, stats, cases, courts, filters, casesForSelect, orders, notes }) {
  const displayName = profile.fullName ? profile.fullName.split(' ')[0] : 'Staff';
  const today = new Date();
  const dateStr = today.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <>
      <div className="dash-header" style={{ alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem' }}>Welcome, {displayName}!</h1>
          <p>Here's an overview of the firm's cases and your recent activity.</p>
        </div>
        <div className="dash-header-actions" style={{ gap: '32px' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
             <ClockIcon /> {dateStr}
          </div>
          <div style={{ fontStyle: 'italic', fontFamily: '"Playfair Display", serif', fontSize: '1.05rem', color: 'var(--muted)' }}>
            "Small notes make a big difference."
          </div>
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

      <div className="dash-layout-grid-staff">
        {/* LEFT COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* All Cases */}
          <div className="dash-card" style={{ padding: '24px 20px', margin: 0 }}>
            <div className="card-title-row" style={{ marginBottom: '16px' }}>
              <h2>All Cases</h2>
              <form className="staff-toolbar" method="GET" action="/dashboard">
                <div className="top-search-wrap" style={{ flex: 'none', width: '220px' }}>
                  <SearchIcon />
                  <input type="text" name="q" defaultValue={filters?.q} className="top-search-input" placeholder="Search cases..." style={{ padding: '8px 12px 8px 36px' }} />
                </div>
                <select name="status" defaultValue={filters?.status || ''} className="dash-select" style={{ padding: '8px 12px' }}>
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="closed">Closed</option>
                </select>
                <select name="court" defaultValue={filters?.court || ''} className="dash-select" style={{ padding: '8px 12px' }}>
                  <option value="">All Courts</option>
                  {(courts || []).map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <button type="submit" className="btn btn-outline btn-sm">Filter</button>
              </form>
            </div>

            {(!cases || cases.length === 0) && (
              <div className="dash-empty" style={{ padding: '30px' }}>No cases match your filters yet.</div>
            )}

            {cases && cases.length > 0 && (
              <div className="dash-table-wrap" style={{ border: 'none' }}>
                <table className="dash-table">
                  <thead>
                    <tr>
                      <th>Case Number</th>
                      <th>Client Name</th>
                      <th>Case Title</th>
                      <th>Court</th>
                      <th>Status</th>
                      <th>Last Updated</th>
                      <th style={{ textAlign: 'center' }}>View</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cases.map((c) => (
                      <tr key={c.id}>
                        <td>{c.case_number}</td>
                        <td>{c.client_name}</td>
                        <td>{c.title || '—'}</td>
                        <td>{c.court || '—'}</td>
                        <td><StatusBadge status={c.status} /></td>
                        <td>{new Date(c.updated_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                        <td style={{ textAlign: 'center' }}>
                          <Link href={`/dashboard/cases/${c.id}`} style={{ color: 'var(--muted)' }}><FileIcon /></Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Subgrid for Orders and Notes */}
          <div className="dash-subgrid-staff">

            <div className="dash-card" style={{ padding: '24px 20px', margin: 0 }}>
              <div className="card-title-row" style={{ marginBottom: '16px' }}>
                <h2>Recent Daily Orders</h2>
                <Link href="/dashboard/orders" className="card-view-all">View All</Link>
              </div>
              <UpdatesTable items={orders} kind="order" currentUserId={profile.id} />
            </div>

            <div className="dash-card" style={{ padding: '24px 20px', margin: 0 }}>
              <div className="card-title-row" style={{ marginBottom: '16px' }}>
                <h2>Recent Notes</h2>
                <Link href="/dashboard/notes" className="card-view-all">View All</Link>
              </div>
              <UpdatesTable items={notes} kind="note" currentUserId={profile.id} />
            </div>

          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          <div className="dash-card" style={{ padding: '24px', margin: 0 }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', fontSize: '1.1rem' }}>
              <CheckDocIcon /> Add Daily Order
            </h2>
            <AddUpdateForm cases={casesForSelect} fixedType="order" submitLabel="Add Daily Order" />
          </div>

          <div className="dash-card" style={{ padding: '24px', margin: 0 }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', fontSize: '1.1rem' }}>
              <AddNoteIcon /> Add Note
            </h2>
            <AddUpdateForm cases={casesForSelect} fixedType="note" submitLabel="Add Note" />
          </div>

        </div>
      </div>
    </>
  );
}
