import { PageHeaderSkeleton, TimelineSkeleton } from '@/app/dashboard/_components/Skeletons';

export default function NotesLoading() {
  return (
    <>
      <PageHeaderSkeleton titleWidth="140px" subtitleWidth="240px" />
      <TimelineSkeleton items={5} showForm />
    </>
  );
}
