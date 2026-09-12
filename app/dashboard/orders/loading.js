import { PageHeaderSkeleton, TimelineSkeleton } from '@/app/dashboard/_components/Skeletons';

export default function OrdersLoading() {
  return (
    <>
      <PageHeaderSkeleton titleWidth="200px" subtitleWidth="260px" />
      <TimelineSkeleton items={5} showForm />
    </>
  );
}
