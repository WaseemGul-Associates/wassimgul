import { PageHeaderSkeleton } from '@/app/dashboard/_components/Skeletons';

export default function ActivityLoading() {
  return (
    <>
      <PageHeaderSkeleton titleWidth="160px" subtitleWidth="360px" />
      <div className="dash-card">
        <div className="activity-list">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="activity-item" style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 0', borderBottom: '1px solid var(--line)' }}>
              <div className="skeleton" style={{ width: '10px', height: '10px', borderRadius: '50%' }} />
              <div style={{ flex: 1 }}>
                <div className="skeleton" style={{ width: `${60 + (i % 4) * 10}%`, height: '15px' }} />
              </div>
              <div className="skeleton" style={{ width: '110px', height: '12px' }} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
