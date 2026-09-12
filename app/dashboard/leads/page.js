import dynamic from 'next/dynamic';
import { requireAdmin } from '@/lib/supabase/dal';
import { createClient } from '@/lib/supabase/server';
import { deleteLead } from './actions';
import ConfirmButton from '@/app/dashboard/_components/ConfirmButton';

const StatusSelect = dynamic(() => import('./StatusSelect'));

export const metadata = { title: 'Leads | WassimGul Portal' };


export default async function LeadsPage() {
  await requireAdmin();
  const supabase = await createClient();

  const { data: leads } = await supabase
    .from('contact_submissions')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <>
      <div className="dash-header">
        <div>
          <h1>Leads</h1>
          <p>{leads?.length || 0} consultation request{leads?.length === 1 ? '' : 's'} from the website.</p>
        </div>
      </div>

      {(!leads || leads.length === 0) && (
        <div className="dash-empty">No consultation requests yet.</div>
      )}

      <div className="timeline">
        {(leads || []).map((lead) => (
          <div className="timeline-item" key={lead.id}>
            <div className="timeline-item-head">
              <span className={`badge badge-${lead.status}`}>{lead.status}</span>
              <span className="timeline-meta">
                {new Date(lead.created_at).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            <p className="timeline-content" style={{ fontWeight: 600 }}>
              {lead.first_name} {lead.last_name}
            </p>
            <p className="timeline-meta" style={{ marginTop: 4 }}>
              <a href={`mailto:${lead.email}`}>{lead.email}</a>
              {lead.phone ? ` · ${lead.phone}` : ''}
              {lead.service ? ` · ${lead.service}` : ''}
              {lead.preferred_date ? ` · Preferred: ${new Date(lead.preferred_date).toLocaleDateString('en-GB')}` : ''}
            </p>
            {lead.message && <p className="timeline-content" style={{ marginTop: 10 }}>{lead.message}</p>}

            <div className="timeline-actions" style={{ marginTop: 14, alignItems: 'center', gap: 14 }}>
              <StatusSelect id={lead.id} status={lead.status} />
              <form action={deleteLead}>
                <input type="hidden" name="id" value={lead.id} />
                <ConfirmButton
                  confirmText={`The request from ${lead.first_name} ${lead.last_name} will be permanently deleted.`}
                  className="btn btn-danger btn-sm"
                >
                  Delete
                </ConfirmButton>
              </form>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
