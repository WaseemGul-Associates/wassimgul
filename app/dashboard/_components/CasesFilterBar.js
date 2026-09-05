export default function CasesFilterBar({ action = '/dashboard/cases', q = '', status = '', court = '', courts = [] }) {
  return (
    <form className="dash-toolbar" method="GET" action={action}>
      <input
        type="text"
        name="q"
        defaultValue={q}
        placeholder="Search by case number, title or client…"
        className="dash-search"
      />
      <select name="status" defaultValue={status} className="dash-select">
        <option value="">All Status</option>
        <option value="active">Active</option>
        <option value="pending">Pending</option>
        <option value="closed">Closed</option>
      </select>
      {courts.length > 0 && (
        <select name="court" defaultValue={court} className="dash-select">
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
