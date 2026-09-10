'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { requireAuth, requireAdmin } from '@/lib/supabase/dal';
import { logActivity } from '@/lib/supabase/activity';

import imagekit from '@/lib/imagekit';

const MAX_FILE_BYTES = 50 * 1024 * 1024; // 50MB, matches next.config.mjs bodySizeLimit

function sanitizeFileName(name) {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_');
}

// Data now surfaces in several places at once — revalidate them all together.
function revalidateDashboardPaths(caseId) {
  revalidatePath('/dashboard');
  revalidatePath('/dashboard/cases');
  revalidatePath('/dashboard/orders');
  revalidatePath('/dashboard/notes');
  revalidatePath('/dashboard/case-files');
  revalidatePath('/dashboard/activity');
  if (caseId) revalidatePath(`/dashboard/cases/${caseId}`);
}

// The forms that call these actions already know the case number (it's
// rendered on the page) — passing it through a hidden field avoids an extra
// DB round-trip on every single mutation just to build a log description.
async function resolveCaseNumber(supabase, formData, caseId) {
  const fromForm = String(formData.get('caseNumber') || '').trim();
  if (fromForm) return fromForm;
  const { data } = await supabase.from('cases').select('case_number').eq('id', caseId).single();
  return data?.case_number || 'a case';
}

// ---------- Cases ----------

export async function createCase(prevState, formData) {
  const profile = await requireAdmin();

  const caseNumber = String(formData.get('caseNumber') || '').trim();
  const title = String(formData.get('title') || '').trim() || null;
  const court = String(formData.get('court') || '').trim() || null;
  const clientName = String(formData.get('clientName') || '').trim();
  const status = String(formData.get('status') || 'active');
  const description = String(formData.get('description') || '').trim() || null;

  if (!caseNumber || !clientName) {
    return { error: 'Case number and client name are required.' };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('cases')
    .insert({ case_number: caseNumber, title, court, client_name: clientName, status, description, created_by: profile.id })
    .select('id')
    .single();

  if (error) {
    if (error.code === '23505') {
      return { error: 'A case with that case number already exists.' };
    }
    return { error: 'Could not create the case. Please try again.' };
  }

  await logActivity(supabase, {
    actorId: profile.id,
    action: 'case_created',
    caseId: data.id,
    description: `${profile.fullName || profile.email} created case ${caseNumber}`,
  });

  revalidateDashboardPaths(data.id);
  redirect(`/dashboard/cases/${data.id}`);
}

export async function updateCase(prevState, formData) {
  const profile = await requireAdmin();

  const id = String(formData.get('id') || '');
  const caseNumber = String(formData.get('caseNumber') || '').trim();
  const title = String(formData.get('title') || '').trim() || null;
  const court = String(formData.get('court') || '').trim() || null;
  const clientName = String(formData.get('clientName') || '').trim();
  const status = String(formData.get('status') || 'active');
  const description = String(formData.get('description') || '').trim() || null;

  if (!id || !caseNumber || !clientName) {
    return { error: 'Case number and client name are required.' };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from('cases')
    .update({ case_number: caseNumber, title, court, client_name: clientName, status, description, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) {
    if (error.code === '23505') {
      return { error: 'A case with that case number already exists.' };
    }
    return { error: 'Could not save changes. Please try again.' };
  }

  await logActivity(supabase, {
    actorId: profile.id,
    action: 'case_updated',
    caseId: id,
    description: `${profile.fullName || profile.email} updated case ${caseNumber}`,
  });

  revalidateDashboardPaths(id);
  redirect(`/dashboard/cases/${id}`);
}

export async function deleteCase(formData) {
  const profile = await requireAdmin();
  const id = String(formData.get('id') || '');
  if (!id) return;

  const supabase = await createClient();
  const caseNumber = await resolveCaseNumber(supabase, formData, id);

  // Clean up any files on ImageKit
  try {
    const { data: caseFiles } = await supabase.from('case_files').select('storage_path').eq('case_id', id);
    if (caseFiles?.length) {
      for (const f of caseFiles) {
        if (f.storage_path && f.storage_path.startsWith('{')) {
          try {
            const parsed = JSON.parse(f.storage_path);
            if (parsed.fileId) {
              await imagekit.deleteFile(parsed.fileId);
            }
          } catch (e) {
            console.error('Error deleting ImageKit file during case deletion:', e);
          }
        }
      }
    }
    await imagekit.deleteFolder(`/cases/${id}`);
  } catch (err) {
    console.error('ImageKit folder cleanup error:', err);
  }

  // Legacy Supabase storage cleanup if present
  try {
    const { data: files } = await supabase.storage.from('case-files').list(id);
    if (files?.length) {
      await supabase.storage.from('case-files').remove(files.map((f) => `${id}/${f.name}`));
    }
  } catch (_) {}

  await supabase.from('cases').delete().eq('id', id);

  await logActivity(supabase, {
    actorId: profile.id,
    action: 'case_deleted',
    caseId: null,
    description: `${profile.fullName || profile.email} deleted case ${caseNumber}`,
  });

  revalidateDashboardPaths();
  redirect('/dashboard');
}

// ---------- Case files ----------

export async function uploadCaseFile(prevState, formData) {
  const profile = await requireAdmin();
  const caseId = String(formData.get('caseId') || '');
  const file = formData.get('file');

  if (!caseId || !(file instanceof File) || file.size === 0) {
    return { error: 'Please choose a PDF file to upload.' };
  }
  if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
    return { error: 'Only PDF files can be uploaded.' };
  }
  if (file.size > MAX_FILE_BYTES) {
    return { error: 'File is too large (50MB max).' };
  }

  const cleanFileName = sanitizeFileName(file.name);
  const fileBuffer = Buffer.from(await file.arrayBuffer());

  let ikResult;
  try {
    ikResult = await imagekit.upload({
      file: fileBuffer,
      fileName: cleanFileName,
      folder: `/cases/${caseId}`,
      useUniqueFileName: true,
    });
  } catch (uploadError) {
    console.error('ImageKit upload error:', uploadError);
    return { error: uploadError?.message || 'Upload to ImageKit failed. Please try again.' };
  }

  if (!ikResult || !ikResult.url) {
    return { error: 'Upload failed. Please try again.' };
  }

  const storagePayload = JSON.stringify({
    fileId: ikResult.fileId,
    url: ikResult.url,
    filePath: ikResult.filePath,
  });

  const supabase = await createClient();
  const { error: insertError } = await supabase.from('case_files').insert({
    case_id: caseId,
    file_name: file.name,
    storage_path: storagePayload,
    file_size: file.size,
    uploaded_by: profile.id,
  });

  if (insertError) {
    console.error('DB insert error:', insertError);
    try {
      if (ikResult.fileId) await imagekit.deleteFile(ikResult.fileId);
    } catch (_) {}
    return { error: 'Could not save the file record. Please try again.' };
  }

  const caseNumber = await resolveCaseNumber(supabase, formData, caseId);
  await logActivity(supabase, {
    actorId: profile.id,
    action: 'file_uploaded',
    caseId,
    description: `${profile.fullName || profile.email} uploaded a file in ${caseNumber}`,
  });

  revalidateDashboardPaths(caseId);
  return { success: true };
}

export async function deleteCaseFile(formData) {
  const profile = await requireAdmin();
  const fileId = String(formData.get('fileId') || '');
  const storagePath = String(formData.get('storagePath') || '');
  const caseId = String(formData.get('caseId') || '');
  if (!fileId) return;

  if (storagePath) {
    if (storagePath.startsWith('{')) {
      try {
        const parsed = JSON.parse(storagePath);
        if (parsed.fileId) {
          await imagekit.deleteFile(parsed.fileId);
        }
      } catch (err) {
        console.error('Error deleting ImageKit file:', err);
      }
    } else if (!storagePath.startsWith('http')) {
      // Legacy Supabase storage fallback
      try {
        const supabase = await createClient();
        await supabase.storage.from('case-files').remove([storagePath]);
      } catch (_) {}
    }
  }

  const supabase = await createClient();
  await supabase.from('case_files').delete().eq('id', fileId);

  const caseNumber = await resolveCaseNumber(supabase, formData, caseId);
  await logActivity(supabase, {
    actorId: profile.id,
    action: 'file_deleted',
    caseId,
    description: `${profile.fullName || profile.email} deleted a file in ${caseNumber}`,
  });

  revalidateDashboardPaths(caseId);
}

// ---------- Daily Orders & Notes (unified timeline) ----------

export async function addCaseUpdate(prevState, formData) {
  const profile = await requireAuth();

  const caseId = String(formData.get('caseId') || '');
  const type = String(formData.get('type') || 'note');
  const content = String(formData.get('content') || '').trim();
  const entryDate = String(formData.get('entryDate') || '') || undefined;

  if (!caseId || !content || !['order', 'note'].includes(type)) {
    return { error: 'Please choose a case and type, and enter some content.' };
  }

  const supabase = await createClient();
  const { error } = await supabase.from('case_updates').insert({
    case_id: caseId,
    type,
    content,
    entry_date: entryDate,
    created_by: profile.id,
  });

  if (error) {
    return { error: 'Could not save that entry. Please try again.' };
  }

  const caseNumber = await resolveCaseNumber(supabase, formData,caseId);
  await logActivity(supabase, {
    actorId: profile.id,
    action: type === 'order' ? 'order_added' : 'note_added',
    caseId,
    description: `${profile.fullName || profile.email} added a ${type === 'order' ? 'daily order' : 'note'} in ${caseNumber}`,
  });

  revalidateDashboardPaths(caseId);
  return { success: true };
}

export async function updateCaseUpdate(prevState, formData) {
  const profile = await requireAdmin();

  const id = String(formData.get('id') || '');
  const caseId = String(formData.get('caseId') || '');
  const type = String(formData.get('type') || 'note');
  const content = String(formData.get('content') || '').trim();
  const entryDate = String(formData.get('entryDate') || '') || undefined;

  if (!id || !content) {
    return { error: 'Content cannot be empty.' };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from('case_updates')
    .update({ type, content, entry_date: entryDate, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) {
    return { error: 'Could not save changes. Please try again.' };
  }

  const caseNumber = await resolveCaseNumber(supabase, formData,caseId);
  await logActivity(supabase, {
    actorId: profile.id,
    action: type === 'order' ? 'order_updated' : 'note_updated',
    caseId,
    description: `${profile.fullName || profile.email} updated a ${type === 'order' ? 'daily order' : 'note'} in ${caseNumber}`,
  });

  revalidateDashboardPaths(caseId);
  return { success: true };
}

export async function deleteCaseUpdate(formData) {
  const profile = await requireAdmin();
  const id = String(formData.get('id') || '');
  const caseId = String(formData.get('caseId') || '');
  const type = String(formData.get('type') || 'note');
  if (!id) return;

  const supabase = await createClient();
  await supabase.from('case_updates').delete().eq('id', id);

  const caseNumber = await resolveCaseNumber(supabase, formData,caseId);
  await logActivity(supabase, {
    actorId: profile.id,
    action: type === 'order' ? 'order_deleted' : 'note_deleted',
    caseId,
    description: `${profile.fullName || profile.email} deleted a ${type === 'order' ? 'daily order' : 'note'} in ${caseNumber}`,
  });

  revalidateDashboardPaths(caseId);
}
