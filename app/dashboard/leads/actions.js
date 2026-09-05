'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/supabase/dal';
import { createClient } from '@/lib/supabase/server';

export async function updateLeadStatus(formData) {
  await requireAdmin();
  const id = String(formData.get('id') || '');
  const status = String(formData.get('status') || '');
  if (!id || !['new', 'read', 'resolved'].includes(status)) return;

  const supabase = await createClient();
  await supabase.from('contact_submissions').update({ status }).eq('id', id);

  revalidatePath('/dashboard/leads');
  revalidatePath('/dashboard');
}

export async function deleteLead(formData) {
  await requireAdmin();
  const id = String(formData.get('id') || '');
  if (!id) return;

  const supabase = await createClient();
  await supabase.from('contact_submissions').delete().eq('id', id);

  revalidatePath('/dashboard/leads');
  revalidatePath('/dashboard');
}
