import { PageHeaderSkeleton } from '@/app/dashboard/_components/Skeletons';

export default function CaseFilesLoading() {
  return (
    <>
      <PageHeaderSkeleton titleWidth="160px" subtitleWidth="260px" />
      <div className="dash-card">
        <div className="file-list">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="file-item" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid var(--line)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1 }}>
                <div className="skeleton" style={{ width: '42px', height: '42px', borderRadius: '6px' }} />
                <div style={{ flex: 1 }}>
                  <div className="skeleton" style={{ width: '220px', height: '16px', marginBottom: '8px' }} />
                  <div className="skeleton" style={{ width: '340px', height: '12px' }} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <div className="skeleton" style={{ width: '60px', height: '32px', borderRadius: '4px' }} />
                <div className="skeleton" style={{ width: '60px', height: '32px', borderRadius: '4px' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
