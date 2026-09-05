import Link from 'next/link';

function StatusBadge({ status }) {
  if (!status) return null;
  return <span className={`badge badge-${status}`}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>;
}

export default function CasesTable({ cases, emptyMessage = 'No cases match your filters yet.' }) {
  if (!cases || cases.length === 0) {
    return <div className="dash-empty">{emptyMessage}</div>;
  }

  return (
    <div className="dash-table-wrap">
      <table className="dash-table">
        <thead>
          <tr>
            <th>Case Number</th>
            <th>Title</th>
            <th>Client</th>
            <th>Court</th>
            <th>Status</th>
            <th>Last Updated</th>
          </tr>
        </thead>
        <tbody>
          {cases.map((c) => (
            <tr key={c.id}>
              <td><Link href={`/dashboard/cases/${c.id}`} className="row-link">{c.case_number}</Link></td>
              <td>{c.title || '—'}</td>
              <td>{c.client_name}</td>
              <td>{c.court || '—'}</td>
              <td><StatusBadge status={c.status} /></td>
              <td>{new Date(c.updated_at).toLocaleDateString('en-GB')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
