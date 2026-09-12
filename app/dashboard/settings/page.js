import dynamic from 'next/dynamic';
import { requireAdmin } from '@/lib/supabase/dal';
import { createClient } from '@/lib/supabase/server';

const FirmInfoForm = dynamic(() => import('./SettingsForms').then((mod) => mod.FirmInfoForm));
const ChangePasswordForm = dynamic(() => import('./SettingsForms').then((mod) => mod.ChangePasswordForm));

export const metadata = { title: 'Settings | WassimGul Portal' };


export default async function SettingsPage() {
  await requireAdmin();
  const supabase = await createClient();

  const { data: settings } = await supabase
    .from('site_settings')
    .select('phone, email, address, social_links')
    .eq('id', 1)
    .single();

  return (
    <>
      <div className="dash-header">
        <div>
          <h1>Settings</h1>
          <p>Firm contact information and your account.</p>
        </div>
      </div>

      <div className="dash-card">
        <h2>Firm Information</h2>
        <p style={{ color: 'var(--muted)', fontSize: '.85rem', marginBottom: 18 }}>Shown in the public site's footer and contact details.</p>
        <FirmInfoForm settings={settings} />
      </div>

      <div className="dash-card">
        <h2>Your Account</h2>
        <p style={{ color: 'var(--muted)', fontSize: '.85rem', marginBottom: 18 }}>Change the password for your own login.</p>
        <ChangePasswordForm />
      </div>
    </>
  );
}
