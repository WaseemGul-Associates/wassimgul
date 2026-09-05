import Link from 'next/link';
import { requireAdmin } from '@/lib/supabase/dal';
import NewCaseForm from './NewCaseForm';

export const metadata = { title: 'New Case | WassimGul Portal' };

export default async function NewCasePage() {
  await requireAdmin();

  return (
    <>
      <Link href="/dashboard/cases" className="dash-crumb">← All Cases</Link>
      <div className="dash-header">
        <div>
          <h1>New Case</h1>
          <p>Add a new matter to the portal.</p>
        </div>
      </div>

      <div className="dash-card">
        <NewCaseForm />
      </div>
    </>
  );
}
