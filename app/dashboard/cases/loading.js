import { PageHeaderSkeleton, TableSkeleton } from '@/app/dashboard/_components/Skeletons';

export default function CasesLoading() {
  return (
    <>
      <PageHeaderSkeleton titleWidth="180px" subtitleWidth="220px" showButton />
      <TableSkeleton rows={7} columns={5} showToolbar />
    </>
  );
}
