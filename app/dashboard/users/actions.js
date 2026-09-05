'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/supabase/dal';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { logActivity } from '@/lib/supabase/activity';

export async function createUser(prevState, formData) {
  const profile = await requireAdmin();

  const email = String(formData.get('email') || '').trim();
  const fullName = String(formData.get('fullName') || '').trim();
  const role = String(formData.get('role') || 'junior');
  const password = String(formData.get('password') || '');

  if (!email || !fullName || !password) {
    return { error: 'Name, email and a temporary password are required.' };
  }
  if (password.length < 6) {
    return { error: 'Password must be at least 6 characters.' };
  }
  if (!['admin', 'junior'].includes(role)) {
    return { error: 'Invalid role.' };
  }

  const adminClient = createAdminClient();
  const { error } = await adminClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName, role },
  });

  if (error) {
    if (String(error.message || '').toLowerCase().includes('already')) {
      return { error: 'A user with that email already exists.' };
    }
    return { error: 'Could not create the account. Please try again.' };
  }

  const supabase = await createClient();
  await logActivity(supabase, {
    actorId: profile.id,
    action: 'user_created',
    description: `${profile.fullName || profile.email} created a new ${role} account (${email})`,
  });

  revalidatePath('/dashboard/users');
  revalidatePath('/dashboard/activity');
  return { success: true };
}
