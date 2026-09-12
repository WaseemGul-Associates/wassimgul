export function PageHeaderSkeleton({ titleWidth = '200px', subtitleWidth = '300px', showButton = false }) {
  return (
    <div className="dash-header">
      <div>
        <div className="skeleton" style={{ width: titleWidth, height: '28px', marginBottom: '8px' }} />
        <div className="skeleton" style={{ width: subtitleWidth, height: '14px' }} />
      </div>
      {showButton && <div className="skeleton skeleton-btn" />}
    </div>
  );
}

export function TableSkeleton({ rows = 5, columns = 4, showToolbar = true }) {
  return (
    <div>
      {showToolbar && (
        <div className="dash-toolbar" style={{ marginBottom: '16px' }}>
          <div className="skeleton" style={{ height: '40px', width: '220px', borderRadius: '6px' }} />
          <div className="skeleton" style={{ height: '40px', width: '150px', borderRadius: '6px' }} />
        </div>
      )}
      <div className="dash-table-wrap">
        <table className="dash-table">
          <thead>
            <tr>
              {Array.from({ length: columns }).map((_, i) => (
                <th key={i}>
                  <div className="skeleton" style={{ width: '70px', height: '12px' }} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }).map((_, r) => (
              <tr key={r}>
                {Array.from({ length: columns }).map((_, c) => (
                  <td key={c}>
                    <div
                      className="skeleton"
                      style={{
                        width: c === 0 ? '120px' : c === columns - 1 ? '60px' : '90px',
                        height: '14px',
                      }}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function TimelineSkeleton({ items = 4, showForm = true }) {
  return (
    <div>
      {showForm && (
        <div className="dash-card" style={{ marginBottom: '24px' }}>
          <div className="skeleton" style={{ width: '160px', height: '20px', marginBottom: '16px' }} />
          <div className="skeleton" style={{ width: '100%', height: '80px', marginBottom: '12px', borderRadius: '6px' }} />
          <div className="skeleton skeleton-btn" />
        </div>
      )}
      <div className="dash-card">
        <div className="skeleton" style={{ width: '140px', height: '20px', marginBottom: '20px' }} />
        <div className="timeline">
          {Array.from({ length: items }).map((_, i) => (
            <div key={i} className="skeleton-timeline-item">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="skeleton" style={{ width: '60px', height: '18px', borderRadius: '100px' }} />
                <div className="skeleton" style={{ width: '100px', height: '12px' }} />
              </div>
              <div className="skeleton" style={{ width: '80%', height: '16px' }} />
              <div className="skeleton" style={{ width: '50%', height: '12px' }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function DashboardOverviewSkeleton() {
  return (
    <div>
      <PageHeaderSkeleton titleWidth="260px" subtitleWidth="340px" showButton />
      <div className="stats-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '18px', marginBottom: '28px' }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="skeleton-stat-card">
            <div className="skeleton skeleton-circle" />
            <div style={{ flex: 1 }}>
              <div className="skeleton" style={{ width: '70px', height: '12px', marginBottom: '8px' }} />
              <div className="skeleton" style={{ width: '40px', height: '24px' }} />
            </div>
          </div>
        ))}
      </div>
      <div className="dash-layout-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        <div className="dash-card">
          <div className="skeleton" style={{ width: '140px', height: '20px', marginBottom: '18px' }} />
          <div className="skeleton skeleton-row" />
          <div className="skeleton skeleton-row" />
          <div className="skeleton skeleton-row" />
        </div>
        <div className="dash-card">
          <div className="skeleton" style={{ width: '120px', height: '20px', marginBottom: '18px' }} />
          <div className="skeleton skeleton-row" />
          <div className="skeleton skeleton-row" />
        </div>
      </div>
    </div>
  );
}

export function CardFormSkeleton({ cards = 2 }) {
  return (
    <div>
      <PageHeaderSkeleton titleWidth="180px" subtitleWidth="260px" />
      {Array.from({ length: cards }).map((_, i) => (
        <div key={i} className="dash-card">
          <div className="skeleton" style={{ width: '180px', height: '22px', marginBottom: '12px' }} />
          <div className="skeleton" style={{ width: '280px', height: '14px', marginBottom: '20px' }} />
          <div className="skeleton" style={{ width: '100%', height: '42px', marginBottom: '16px', borderRadius: '6px' }} />
          <div className="skeleton" style={{ width: '100%', height: '42px', marginBottom: '20px', borderRadius: '6px' }} />
          <div className="skeleton skeleton-btn" />
        </div>
      ))}
    </div>
  );
}

export function DetailPageSkeleton() {
  return (
    <div>
      <div className="skeleton" style={{ width: '90px', height: '14px', marginBottom: '12px' }} />
      <PageHeaderSkeleton titleWidth="280px" subtitleWidth="160px" showButton />
      <div className="dash-card">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '18px' }}>
          <div className="skeleton" style={{ height: '36px' }} />
          <div className="skeleton" style={{ height: '36px' }} />
          <div className="skeleton" style={{ height: '36px' }} />
        </div>
        <div className="skeleton" style={{ width: '100%', height: '60px' }} />
      </div>
      <div className="dash-card">
        <div className="skeleton" style={{ width: '140px', height: '20px', marginBottom: '16px' }} />
        <div className="skeleton skeleton-row" />
        <div className="skeleton skeleton-row" />
      </div>
    </div>
  );
}
