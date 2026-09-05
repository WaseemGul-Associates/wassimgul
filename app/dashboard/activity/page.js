import { requireAdmin } from '@/lib/supabase/dal';
import { createClient } from '@/lib/supabase/server';

export const metadata = { title: 'Activity Log | WassimGul Portal' };

const ACTIVITY_COLOR = {
  file_uploaded: 'blue', file_deleted: 'blue',
  order_added: 'yellow', order_updated: 'yellow', order_deleted: 'yellow',
  note_added: 'green', note_updated: 'green', note_deleted: 'green',
  lead_submitted: 'red',
};

export default async function ActivityLogPage() {
  await requireAdmin();
  const supabase = await createClient();

  const { data: activity } = await supabase
    .from('activity_log')
    .select('id, action, description, created_at')
    .order('created_at', { ascending: false })
    .limit(100);

  return (
    <>
      <div className="dash-header">
        <div>
          <h1>Activity Log</h1>
          <p>Every case, file, daily order/note and website lead across the portal.</p>
        </div>
      </div>

      <div className="dash-card">
        {(!activity || activity.length === 0) && (
          <p style={{ color: 'var(--muted)', fontSize: '.9rem' }}>No activity recorded yet.</p>
        )}
        {activity && activity.length > 0 && (
          <div className="activity-list">
            {activity.map((a) => (
              <div className="activity-item" key={a.id}>
                <div className={`activity-icon ${ACTIVITY_COLOR[a.action] || 'blue'}`}>•</div>
                <div className="activity-desc">{a.description}</div>
                <div className="activity-time">
                  {new Date(a.created_at).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
