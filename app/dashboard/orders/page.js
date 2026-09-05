import { requireAuth } from '@/lib/supabase/dal';
import { createClient } from '@/lib/supabase/server';
import AddUpdateForm from '@/app/dashboard/_components/AddUpdateForm';
import UpdateItem from '@/app/dashboard/_components/UpdateItem';

export const metadata = { title: 'Daily Orders | WassimGul Portal' };

export default async function OrdersPage({ searchParams }) {
  const profile = await requireAuth();
  const params = await searchParams;
  const caseFilter = params?.case || '';
  const supabase = await createClient();

  const { data: casesForSelect } = await supabase
    .from('cases')
    .select('id, case_number, title')
    .order('case_number');

  let query = supabase
    .from('case_updates')
    .select('id, type, content, entry_date, created_by, case_id, cases(case_number), profiles(full_name)')
    .eq('type', 'order')
    .order('entry_date', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(100);

  if (caseFilter) query = query.eq('case_id', caseFilter);

  const { data: orders } = await query;

  return (
    <>
      <div className="dash-header">
        <div>
          <h1>Daily Orders</h1>
          <p>All daily orders across every case.</p>
        </div>
      </div>

      <div className="dash-card">
        <h2>Add Daily Order</h2>
        <AddUpdateForm cases={casesForSelect} fixedType="order" submitLabel="Add Daily Order" />
      </div>

      <div className="dash-card">
        <div className="dash-card-head">
          <h2>All Entries</h2>
          <form method="GET" style={{ display: 'flex', gap: 10 }}>
            <select name="case" defaultValue={caseFilter} className="dash-select">
              <option value="">All Cases</option>
              {(casesForSelect || []).map((c) => (
                <option key={c.id} value={c.id}>{c.case_number}{c.title ? ` - ${c.title}` : ''}</option>
              ))}
            </select>
            <button type="submit" className="btn btn-outline btn-sm">Filter</button>
          </form>
        </div>

        <div className="timeline">
          {(!orders || orders.length === 0) && (
            <p style={{ color: 'var(--muted)', fontSize: '.9rem' }}>No daily orders yet.</p>
          )}
          {(orders || []).map((item) => (
            <UpdateItem
              key={item.id}
              item={item}
              caseId={item.case_id}
              caseNumber={item.cases?.case_number}
              canManage={profile.role === 'admin'}
              authorName={item.profiles?.full_name}
              caseLabel={item.cases?.case_number}
            />
          ))}
        </div>
      </div>
    </>
  );
}
