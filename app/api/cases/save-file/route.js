import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/supabase/dal';
import { logActivity } from '@/lib/supabase/activity';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const profile = await requireAdmin();
    const body = await request.json();
    const { caseId, caseNumber: caseNumberFromClient, fileId, url, filePath, fileName, fileSize, storagePayload: directPayload, providers, primary } = body;

    if (!caseId || (!url && !directPayload) || !fileName) {
      return NextResponse.json({ error: 'Missing required file information.' }, { status: 400 });
    }

    let finalPayload = directPayload;
    if (!finalPayload) {
      if (providers) {
        finalPayload = JSON.stringify({
          version: 2,
          primary: primary || (providers.cloudinary ? 'cloudinary' : 'imagekit'),
          url: url || providers.cloudinary?.url || providers.imagekit?.url,
          fileId: fileId || providers.cloudinary?.fileId || providers.imagekit?.fileId,
          providers,
        });
      } else {
        finalPayload = JSON.stringify({
          fileId: fileId || '',
          url,
          filePath: filePath || '',
        });
      }
    }

    const supabase = await createClient();
    const { error: insertError } = await supabase.from('case_files').insert({
      case_id: caseId,
      file_name: fileName,
      storage_path: finalPayload,
      file_size: fileSize || 0,
      uploaded_by: profile.id,
    });

    if (insertError) {
      console.error('Database insert error:', insertError);
      return NextResponse.json({ error: 'Could not save file record in database.' }, { status: 500 });
    }

    let caseNumber = caseNumberFromClient;
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

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Save file error:', err);
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 });
  }
}

