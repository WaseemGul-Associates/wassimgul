import { PageHeaderSkeleton, TimelineSkeleton } from '@/app/dashboard/_components/Skeletons';

export default function LeadsLoading() {
  return (
    <>
      <PageHeaderSkeleton titleWidth="140px" subtitleWidth="280px" />
      <TimelineSkeleton items={4} showForm={false} />
    </>
  );
}
