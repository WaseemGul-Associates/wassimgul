import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireAuth } from '@/lib/supabase/dal';
import { createClient } from '@/lib/supabase/server';
import { deleteCaseFile } from '../actions';
import ConfirmButton from '@/app/dashboard/_components/ConfirmButton';
import AddUpdateForm from '@/app/dashboard/_components/AddUpdateForm';
import UpdateItem from '@/app/dashboard/_components/UpdateItem';
import UploadFileForm from './UploadFileForm';

function formatBytes(bytes) {
  if (!bytes) return '';
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(0)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

export default async function CaseDetailPage({ params }) {
  const { id } = await params;
  const profile = await requireAuth();
  const isAdmin = profile.role === 'admin';
  const supabase = await createClient();

  const { data: caseRow } = await supabase
    .from('cases')
    .select('id, case_number, title, court, client_name, status, description, updated_at')
    .eq('id', id)
    .single();

  if (!caseRow) notFound();

  const [{ data: files }, { data: updates }] = await Promise.all([
    supabase
      .from('case_files')
      .select('id, file_name, storage_path, file_size, created_at')
      .eq('case_id', id)
      .order('created_at', { ascending: false }),
    supabase
      .from('case_updates')
      .select('id, type, content, entry_date, created_at, profiles(full_name)')
      .eq('case_id', id)
      .order('entry_date', { ascending: false })
      .order('created_at', { ascending: false }),
  ]);

  const filesWithUrls = await Promise.all(
    (files || []).map(async (f) => {
      let fileUrl = null;
      if (f.storage_path) {
        if (f.storage_path.startsWith('{')) {
          try {
            const parsed = JSON.parse(f.storage_path);
            fileUrl = parsed.url;
          } catch (_) {}
        } else if (f.storage_path.startsWith('http://') || f.storage_path.startsWith('https://')) {
          fileUrl = f.storage_path;
        } else {
          try {
            const { data: signed } = await supabase.storage
              .from('case-files')
              .createSignedUrl(f.storage_path, 600);
            fileUrl = signed?.signedUrl;
          } catch (_) {}
        }
      }
      return { ...f, url: fileUrl };
    })
  );

  return (
    <>
      <Link href="/dashboard/cases" className="dash-crumb">← All Cases</Link>

      <div className="dash-header">
        <div>
          <h1>{caseRow.case_number}{caseRow.title ? ` — ${caseRow.title}` : ''}</h1>
          <p>{caseRow.client_name}</p>
        </div>
        {isAdmin && (
          <div style={{ display: 'flex', gap: 10 }}>
            <Link href={`/dashboard/cases/${caseRow.id}/edit`} className="btn btn-outline btn-sm">Edit Case</Link>
          </div>
        )}
      </div>

      <div className="dash-card">
        <dl className="dash-detail-grid">
          <div>
            <dt>Status</dt>
            <dd><span className={`badge badge-${caseRow.status}`}>{caseRow.status}</span></dd>
          </div>
          <div>
            <dt>Last Updated</dt>
            <dd>{new Date(caseRow.updated_at).toLocaleDateString('en-GB')}</dd>
          </div>
          {caseRow.court && (
            <div>
              <dt>Court</dt>
              <dd>{caseRow.court}</dd>
            </div>
          )}
        </dl>
        {caseRow.description && (
          <div style={{ marginTop: 18 }}>
            <p style={{ fontSize: '.68rem', textTransform: 'uppercase', letterSpacing: '.04em', color: 'var(--muted)' }}>Description</p>
            <p style={{ marginTop: 6, color: 'var(--ink)', lineHeight: 1.7 }}>{caseRow.description}</p>
          </div>
        )}
      </div>

      <div className="dash-card">
        <div className="dash-card-head">
          <h2>Case Files</h2>
        </div>

        {filesWithUrls.length === 0 && <p style={{ color: 'var(--muted)', fontSize: '.9rem' }}>No files uploaded yet.</p>}

        {filesWithUrls.length > 0 && (
          <div className="file-list">
            {filesWithUrls.map((f) => (
              <div className="file-item" key={f.id}>
                <div className="file-item-main">
                  <div className="file-ico">PDF</div>
                  <div>
                    <div className="file-name">{f.file_name}</div>
                    <div className="file-meta">
                      {formatBytes(f.file_size)} · {new Date(f.created_at).toLocaleDateString('en-GB')}
                    </div>
                  </div>
                </div>
                <div className="file-actions">
                  {f.url && (
                    <a href={f.url} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">View</a>
                  )}
                  {isAdmin && (
                    <form action={deleteCaseFile}>
                      <input type="hidden" name="fileId" value={f.id} />
                      <input type="hidden" name="storagePath" value={f.storage_path} />
                      <input type="hidden" name="caseId" value={caseRow.id} />
                      <input type="hidden" name="caseNumber" value={caseRow.case_number} />
                      <ConfirmButton confirmText={`"${f.file_name}" will be permanently deleted.`} className="btn btn-danger btn-sm">Delete</ConfirmButton>
                    </form>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {isAdmin && <UploadFileForm caseId={caseRow.id} caseNumber={caseRow.case_number} />}
      </div>

      <div className="dash-card">
        <div className="dash-card-head">
          <h2>Daily Orders &amp; Notes</h2>
        </div>

        <AddUpdateForm caseId={caseRow.id} caseNumber={caseRow.case_number} />

        <div className="timeline" style={{ marginTop: 22 }}>
          {(!updates || updates.length === 0) && (
            <p style={{ color: 'var(--muted)', fontSize: '.9rem' }}>No entries yet.</p>
          )}
          {(updates || []).map((u) => (
            <UpdateItem
              key={u.id}
              item={u}
              caseId={caseRow.id}
              caseNumber={caseRow.case_number}
              canManage={isAdmin}
              authorName={u.profiles?.full_name}
            />
          ))}
        </div>
      </div>
    </>
  );
}
