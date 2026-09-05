'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { logActivity } from '@/lib/supabase/activity';

export async function submitContactForm(prevState, formData) {
  const firstName = String(formData.get('firstName') || '').trim();
  const lastName = String(formData.get('lastName') || '').trim();
  const email = String(formData.get('email') || '').trim();
  const phone = String(formData.get('phone') || '').trim() || null;
  const service = String(formData.get('service') || '').trim() || null;
  const preferredDate = String(formData.get('date') || '').trim() || null;
  const message = String(formData.get('message') || '').trim() || null;

  if (!firstName || !lastName || !email) {
    return { error: 'Please fill in your first name, last name and email address.' };
  }

  const supabase = await createClient();
  const { error } = await supabase.from('contact_submissions').insert({
    first_name: firstName,
    last_name: lastName,
    email,
    phone,
    service,
    preferred_date: preferredDate,
    message,
  });

  if (error) {
    return { error: 'Something went wrong sending your request. Please try again or call us directly.' };
  }

  // Best-effort: surface it in the admin's Recent Activity feed too. This is an
  // anonymous public submission, so it can't satisfy the activity_log RLS insert
  // policy (authenticated users only) — use the service-role client for just this
  // write; the contact_submissions insert above still goes through the public,
  // RLS-restricted client.
  await logActivity(createAdminClient(), {
    actorId: null,
    action: 'lead_submitted',
    description: `New consultation request from ${firstName} ${lastName}${service ? ` (${service})` : ''}`,
  });

  return { success: true };
}
