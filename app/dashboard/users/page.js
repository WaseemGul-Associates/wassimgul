import { requireAdmin } from '@/lib/supabase/dal';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import NewUserForm from './NewUserForm';

export const metadata = { title: 'Manage Users | WassimGul Portal' };

export default async function UsersPage() {
  const profile = await requireAdmin();
  const supabase = await createClient();

  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, full_name, role, created_at')
    .order('created_at', { ascending: true });

  // Emails live on auth.users, not profiles — pull them with the admin client.
  const adminClient = createAdminClient();
  const { data: authList } = await adminClient.auth.admin.listUsers();
  const emailById = new Map((authList?.users || []).map((u) => [u.id, u.email]));

  return (
    <>
      <div className="dash-header">
        <div>
          <h1>Manage Users</h1>
          <p>Admin and Junior accounts with portal access.</p>
        </div>
      </div>

      <div className="dash-card">
        <h2>New Account</h2>
        <NewUserForm />
      </div>

      <div className="dash-card">
        <div className="dash-card-head">
          <h2>All Users</h2>
        </div>
        <div className="dash-table-wrap">
          <table className="dash-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {(profiles || []).map((p) => (
                <tr key={p.id}>
                  <td>{p.full_name || '—'}{p.id === profile.id ? ' (you)' : ''}</td>
                  <td>{emailById.get(p.id) || '—'}</td>
                  <td><span className={`badge badge-${p.role}`}>{p.role}</span></td>
                  <td>{new Date(p.created_at).toLocaleDateString('en-GB')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
