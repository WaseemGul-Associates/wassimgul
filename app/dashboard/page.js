import { requireAuth } from '@/lib/supabase/dal';
import { createClient } from '@/lib/supabase/server';
import AdminDashboard from './_components/AdminDashboard';
import StaffDashboard from './_components/StaffDashboard';

export const metadata = { title: 'Dashboard | WassimGul Portal' };

async function getStats(supabase) {
  const base = () => supabase.from('cases').select('id', { count: 'exact', head: true });
  const [total, active, pending, closed] = await Promise.all([
    base(),
    base().eq('status', 'active'),
    base().eq('status', 'pending'),
    base().eq('status', 'closed'),
  ]);
  return {
    total: total.count || 0,
    active: active.count || 0,
    pending: pending.count || 0,
    closed: closed.count || 0,
  };
}

async function getRecentUpdates(supabase, type, limit = 4) {
  const { data } = await supabase
    .from('case_updates')
    .select('id, type, content, entry_date, created_by, cases(id, case_number), profiles(full_name)')
    .eq('type', type)
    .order('created_at', { ascending: false })
    .limit(limit);
  return data || [];
}

export default async function DashboardPage({ searchParams }) {
  const profile = await requireAuth();
  const supabase = await createClient();
  const stats = await getStats(supabase);

  if (profile.role === 'admin') {
    const [{ data: cases }, { data: activity }, orders, notes] = await Promise.all([
      supabase
        .from('cases')
        .select('id, case_number, title, client_name, status, updated_at')
        .order('updated_at', { ascending: false })
        .limit(6),
      supabase
        .from('activity_log')
        .select('id, action, description, created_at')
        .order('created_at', { ascending: false })
        .limit(5),
      getRecentUpdates(supabase, 'order'),
      getRecentUpdates(supabase, 'note'),
    ]);

    return <AdminDashboard profile={profile} stats={stats} cases={cases} activity={activity} orders={orders} notes={notes} />;
  }

  // Junior / staff view
  const params = await searchParams;
  const q = (params?.q || '').trim();
  const status = params?.status || '';
  const court = params?.court || '';

  let casesQuery = supabase
    .from('cases')
    .select('id, case_number, title, court, client_name, status, updated_at')
    .order('updated_at', { ascending: false });

  if (status) casesQuery = casesQuery.eq('status', status);
  if (court) casesQuery = casesQuery.eq('court', court);
  if (q) casesQuery = casesQuery.or(`case_number.ilike.%${q}%,client_name.ilike.%${q}%,title.ilike.%${q}%`);

  const [{ data: cases }, { data: courtRows }, { data: casesForSelect }, orders, notes] = await Promise.all([
    casesQuery,
    supabase.from('cases').select('court').not('court', 'is', null),
    supabase.from('cases').select('id, case_number, title').order('case_number'),
    getRecentUpdates(supabase, 'order'),
    getRecentUpdates(supabase, 'note'),
  ]);

  const courts = [...new Set((courtRows || []).map((r) => r.court).filter(Boolean))].sort();

  return (
    <StaffDashboard
      profile={profile}
      stats={stats}
      cases={cases}
      courts={courts}
      filters={{ q, status, court }}
      casesForSelect={casesForSelect}
      orders={orders}
      notes={notes}
    />
  );
}
