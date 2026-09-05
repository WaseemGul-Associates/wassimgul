// Data Access Layer — centralizes "who is this and are they allowed" checks.
// Every dashboard page and server action should go through here rather than
// re-implementing auth/role checks inline.
import 'server-only';
import { redirect } from 'next/navigation';
import { cache } from 'react';
import { createClient } from '@/lib/supabase/server';

// Fetches the current auth user + their profile (id, full_name, role).
// Cached per-request so calling it from a layout and a page doesn't double-query.
export const getProfile = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, full_name, role')
    .eq('id', user.id)
    .single();

  if (!profile) return null;

  return {
    id: user.id,
    email: user.email,
    fullName: profile.full_name,
    role: profile.role,
  };
});

// Redirects to /login if there is no authenticated user with a profile.
export async function requireAuth() {
  const profile = await getProfile();
  if (!profile) {
    redirect('/login');
  }
  return profile;
}

// Redirects non-admins to the dashboard home. Use in admin-only pages.
export async function requireAdmin() {
  const profile = await requireAuth();
  if (profile.role !== 'admin') {
    redirect('/dashboard');
  }
  return profile;
}
