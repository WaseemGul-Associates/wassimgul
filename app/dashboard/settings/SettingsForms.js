'use client';

import { useActionState } from 'react';
import { updateSiteSettings, changePassword } from './actions';

export function FirmInfoForm({ settings }) {
  const [state, formAction, pending] = useActionState(updateSiteSettings, undefined);
  const social = settings?.social_links || {};

  return (
    <form action={formAction} className="dash-form" noValidate>
      <div className="f-row">
        <div className="f">
          <label htmlFor="phone">Phone</label>
          <input id="phone" name="phone" type="text" defaultValue={settings?.phone || ''} />
        </div>
        <div className="f">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" defaultValue={settings?.email || ''} />
        </div>
      </div>
      <div className="f">
        <label htmlFor="address">Address</label>
        <input id="address" name="address" type="text" defaultValue={settings?.address || ''} />
      </div>
      <div className="f-row">
        <div className="f">
          <label htmlFor="facebook">Facebook URL</label>
          <input id="facebook" name="facebook" type="text" defaultValue={social.facebook || ''} />
        </div>
        <div className="f">
          <label htmlFor="twitter">Twitter / X URL</label>
          <input id="twitter" name="twitter" type="text" defaultValue={social.twitter || ''} />
        </div>
      </div>
      <div className="f-row">
        <div className="f">
          <label htmlFor="instagram">Instagram URL</label>
          <input id="instagram" name="instagram" type="text" defaultValue={social.instagram || ''} />
        </div>
        <div className="f">
          <label htmlFor="linkedin">LinkedIn URL</label>
          <input id="linkedin" name="linkedin" type="text" defaultValue={social.linkedin || ''} />
        </div>
      </div>

      {state?.error && <p className="dash-field-error" role="alert">{state.error}</p>}
      {state?.success && <p className="dash-form-note" style={{ color: '#366145' }}>Saved.</p>}

      <div className="dash-form-actions">
        <button type="submit" className="btn btn-solid" disabled={pending}>
          {pending ? 'Saving…' : 'Save Firm Information'}
        </button>
      </div>
    </form>
  );
}

export function ChangePasswordForm() {
  const [state, formAction, pending] = useActionState(changePassword, undefined);

  return (
    <form action={formAction} className="dash-form" noValidate>
      <div className="f-row">
        <div className="f">
          <label htmlFor="password">New Password</label>
          <input id="password" name="password" type="password" required minLength={6} />
        </div>
        <div className="f">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input id="confirmPassword" name="confirmPassword" type="password" required minLength={6} />
        </div>
      </div>

      {state?.error && <p className="dash-field-error" role="alert">{state.error}</p>}
      {state?.success && <p className="dash-form-note" style={{ color: '#366145' }}>Password updated.</p>}

      <div className="dash-form-actions">
        <button type="submit" className="btn btn-solid" disabled={pending}>
          {pending ? 'Updating…' : 'Update Password'}
        </button>
      </div>
    </form>
  );
}
