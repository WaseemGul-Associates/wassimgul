'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/supabase/dal';
import { createClient } from '@/lib/supabase/server';
import { logActivity } from '@/lib/supabase/activity';

export async function updateSiteSettings(prevState, formData) {
  const profile = await requireAdmin();

  const phone = String(formData.get('phone') || '').trim();
  const email = String(formData.get('email') || '').trim();
  const address = String(formData.get('address') || '').trim();
  const social_links = {
    facebook: String(formData.get('facebook') || '').trim(),
    twitter: String(formData.get('twitter') || '').trim(),
    instagram: String(formData.get('instagram') || '').trim(),
    linkedin: String(formData.get('linkedin') || '').trim(),
  };

  const supabase = await createClient();
  const { error } = await supabase
    .from('site_settings')
    .update({ phone, email, address, social_links, updated_at: new Date().toISOString() })
    .eq('id', 1);

  if (error) {
    return { error: 'Could not save firm information. Please try again.' };
  }

  await logActivity(supabase, {
    actorId: profile.id,
    action: 'settings_updated',
    description: `${profile.fullName || profile.email} updated firm information`,
  });

  revalidatePath('/dashboard/settings');
  return { success: true };
}

export async function changePassword(prevState, formData) {
  await requireAdmin();

  const password = String(formData.get('password') || '');
  const confirmPassword = String(formData.get('confirmPassword') || '');

  if (password.length < 6) {
    return { error: 'Password must be at least 6 characters.' };
  }
  if (password !== confirmPassword) {
    return { error: 'Passwords do not match.' };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return { error: 'Could not update your password. Please try again.' };
  }

  return { success: true };
}
