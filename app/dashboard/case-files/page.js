import Link from 'next/link';
import { requireAdmin } from '@/lib/supabase/dal';
import { createClient } from '@/lib/supabase/server';
import { deleteCaseFile } from '@/app/dashboard/cases/actions';
import ConfirmButton from '@/app/dashboard/_components/ConfirmButton';

export const metadata = { title: 'Case Files | WassimGul Portal' };

function formatBytes(bytes) {
  if (!bytes) return '';
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(0)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

export default async function CaseFilesPage() {
  await requireAdmin();
  const supabase = await createClient();

  const { data: files } = await supabase
    .from('case_files')
    .select('id, file_name, storage_path, file_size, created_at, case_id, cases(case_number, client_name), profiles(full_name)')
    .order('created_at', { ascending: false });

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
            const { data: signed } = await supabase.storage.from('case-files').createSignedUrl(f.storage_path, 600);
            fileUrl = signed?.signedUrl;
          } catch (_) {}
        }
      }
      return { ...f, url: fileUrl };
    })
  );

  return (
    <>
      <div className="dash-header">
        <div>
          <h1>Case Files</h1>
          <p>{filesWithUrls.length} file{filesWithUrls.length === 1 ? '' : 's'} uploaded across all cases.</p>
        </div>
      </div>

      <div className="dash-card">
        {filesWithUrls.length === 0 && <p style={{ color: 'var(--muted)', fontSize: '.9rem' }}>No files uploaded yet. Upload PDFs from a case's detail page.</p>}

        {filesWithUrls.length > 0 && (
          <div className="file-list">
            {filesWithUrls.map((f) => (
              <div className="file-item" key={f.id}>
                <div className="file-item-main">
                  <div className="file-ico">PDF</div>
                  <div>
                    <div className="file-name">{f.file_name}</div>
                    <div className="file-meta">
                      <Link href={`/dashboard/cases/${f.case_id}`}>{f.cases?.case_number || 'Unknown case'}</Link>
                      {f.cases?.client_name ? ` · ${f.cases.client_name}` : ''}
                      {' · '}{formatBytes(f.file_size)} · {new Date(f.created_at).toLocaleDateString('en-GB')}
                      {f.profiles?.full_name ? ` · Uploaded by ${f.profiles.full_name}` : ''}
                    </div>
                  </div>
                </div>
                <div className="file-actions">
                  {f.url && (
                    <a href={f.url} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">View</a>
                  )}
                  <form action={deleteCaseFile}>
                    <input type="hidden" name="fileId" value={f.id} />
                    <input type="hidden" name="storagePath" value={f.storage_path} />
                    <input type="hidden" name="caseId" value={f.case_id} />
                    <input type="hidden" name="caseNumber" value={f.cases?.case_number || ''} />
                    <ConfirmButton confirmText={`"${f.file_name}" will be permanently deleted.`} className="btn btn-danger btn-sm">Delete</ConfirmButton>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
