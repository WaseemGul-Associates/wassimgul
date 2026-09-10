import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/supabase/dal';
import { logActivity } from '@/lib/supabase/activity';
import imagekit from '@/lib/imagekit';

export const maxDuration = 60; // Allow sufficient time for large uploads
export const dynamic = 'force-dynamic';

const MAX_FILE_BYTES = 50 * 1024 * 1024; // 50MB

function sanitizeFileName(name) {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_');
}

export async function POST(request) {
  try {
    const profile = await requireAdmin();
    const formData = await request.formData();
    const caseId = String(formData.get('caseId') || '');
    const caseNumberFromForm = String(formData.get('caseNumber') || '').trim();
    const file = formData.get('file');

    if (!caseId || !(file instanceof File) || file.size === 0) {
      return NextResponse.json({ error: 'Please choose a PDF file to upload.' }, { status: 400 });
    }
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      return NextResponse.json({ error: 'Only PDF files can be uploaded.' }, { status: 400 });
    }
    if (file.size > MAX_FILE_BYTES) {
      return NextResponse.json({ error: 'File is too large (50MB max).' }, { status: 400 });
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
      return NextResponse.json({ error: uploadError?.message || 'Upload to ImageKit failed. Please try again.' }, { status: 500 });
    }

    if (!ikResult || !ikResult.url) {
      return NextResponse.json({ error: 'Upload failed. Please try again.' }, { status: 500 });
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
      return NextResponse.json({ error: 'Could not save the file record. Please try again.' }, { status: 500 });
    }

    let caseNumber = caseNumberFromForm;
    if (!caseNumber) {
      const { data } = await supabase.from('cases').select('case_number').eq('id', caseId).single();
      caseNumber = data?.case_number || 'a case';
    }

    await logActivity(supabase, {
      actorId: profile.id,
      action: 'file_uploaded',
      caseId,
      description: `${profile.fullName || profile.email} uploaded a file in ${caseNumber}`,
    });

    revalidatePath('/dashboard');
    revalidatePath('/dashboard/cases');
    revalidatePath(`/dashboard/cases/${caseId}`);
    revalidatePath('/dashboard/case-files');

    return NextResponse.json({ success: true, url: ikResult.url });
  } catch (err) {
    console.error('Upload API route error:', err);
    return NextResponse.json({ error: err?.message || 'Unauthorized or server error' }, { status: 500 });
  }
}
