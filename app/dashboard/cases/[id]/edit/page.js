import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireAdmin } from '@/lib/supabase/dal';
import { createClient } from '@/lib/supabase/server';
import { deleteCase } from '../../actions';
import ConfirmButton from '@/app/dashboard/_components/ConfirmButton';
import EditCaseForm from './EditCaseForm';

export default async function EditCasePage({ params }) {
  const { id } = await params;
  await requireAdmin();
  const supabase = await createClient();

  const { data: caseRow } = await supabase
    .from('cases')
    .select('id, case_number, title, court, client_name, status, description')
    .eq('id', id)
    .single();

  if (!caseRow) notFound();

  return (
    <>
      <Link href={`/dashboard/cases/${caseRow.id}`} className="dash-crumb">← {caseRow.case_number}</Link>
      <div className="dash-header">
        <div>
          <h1>Edit Case</h1>
          <p>Update case details or remove this case entirely.</p>
        </div>
      </div>

      <div className="dash-card">
        <EditCaseForm caseRow={caseRow} />
      </div>

      <div className="dash-card" style={{ borderColor: 'rgba(178,58,42,.3)' }}>
        <h2 style={{ color: '#8a2e1f' }}>Danger Zone</h2>
        <p style={{ color: 'var(--muted)', fontSize: '.9rem', margin: '8px 0 16px' }}>
          Deleting a case permanently removes its files, orders and notes. This cannot be undone.
        </p>
        <form action={deleteCase}>
          <input type="hidden" name="id" value={caseRow.id} />
          <input type="hidden" name="caseNumber" value={caseRow.case_number} />
          <ConfirmButton
            title="Delete Case"
            confirmText={`Case ${caseRow.case_number} and all its files, orders and notes will be permanently deleted.`}
            confirmLabel="Delete Case"
            className="btn btn-danger"
          >
            Delete This Case
          </ConfirmButton>
        </form>
      </div>
    </>
  );
}
