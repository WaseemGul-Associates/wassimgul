import Link from 'next/link';
import { requireAuth } from '@/lib/supabase/dal';
import { createClient } from '@/lib/supabase/server';
import CasesTable from '@/app/dashboard/_components/CasesTable';
import CasesFilterBar from '@/app/dashboard/_components/CasesFilterBar';

export const metadata = { title: 'Cases | WassimGul Portal' };

export default async function AllCasesPage({ searchParams }) {
  const profile = await requireAuth();
  const params = await searchParams;
  const q = (params?.q || '').trim();
  const status = params?.status || '';
  const court = params?.court || '';

  const supabase = await createClient();

  let query = supabase
    .from('cases')
    .select('id, case_number, title, court, client_name, status, updated_at')
    .order('updated_at', { ascending: false });

  if (status) query = query.eq('status', status);
  if (court) query = query.eq('court', court);
  if (q) query = query.or(`case_number.ilike.%${q}%,client_name.ilike.%${q}%,title.ilike.%${q}%`);

  const [{ data: cases }, { data: courtRows }] = await Promise.all([
    query,
    supabase.from('cases').select('court').not('court', 'is', null),
  ]);

  const courts = [...new Set((courtRows || []).map((r) => r.court).filter(Boolean))].sort();

  return (
    <>
      <div className="dash-header">
        <div>
          <h1>All Cases</h1>
          <p>{cases?.length || 0} case{cases?.length === 1 ? '' : 's'} on file</p>
        </div>
        {profile.role === 'admin' && (
          <Link href="/dashboard/cases/new" className="btn btn-solid">+ New Case</Link>
        )}
      </div>

      <CasesFilterBar action="/dashboard/cases" q={q} status={status} court={court} courts={courts} />

      <CasesTable cases={cases} />
    </>
  );
}
