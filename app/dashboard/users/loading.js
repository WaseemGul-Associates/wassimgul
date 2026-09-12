import { PageHeaderSkeleton, TableSkeleton } from '@/app/dashboard/_components/Skeletons';

export default function UsersLoading() {
  return (
    <>
      <PageHeaderSkeleton titleWidth="180px" subtitleWidth="280px" />
      <div className="dash-card" style={{ marginBottom: '24px' }}>
        <div className="skeleton" style={{ width: '160px', height: '22px', marginBottom: '16px' }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '16px' }}>
          <div className="skeleton" style={{ height: '42px', borderRadius: '6px' }} />
          <div className="skeleton" style={{ height: '42px', borderRadius: '6px' }} />
          <div className="skeleton" style={{ height: '42px', borderRadius: '6px' }} />
        </div>
        <div className="skeleton skeleton-btn" />
      </div>
      <div className="dash-card">
        <div className="skeleton" style={{ width: '120px', height: '20px', marginBottom: '16px' }} />
        <TableSkeleton rows={4} columns={4} showToolbar={false} />
      </div>
    </>
  );
}
