'use client';

import { useActionState, useEffect, useRef } from 'react';
import { createUser } from './actions';

export default function NewUserForm() {
  const [state, formAction, pending] = useActionState(createUser, undefined);
  const formRef = useRef(null);

  useEffect(() => {
    if (state?.success) formRef.current?.reset();
  }, [state]);

  return (
    <form action={formAction} ref={formRef} className="dash-form" noValidate>
      <div className="f-row">
        <div className="f">
          <label htmlFor="fullName">Full Name</label>
          <input id="fullName" name="fullName" type="text" placeholder="Priya Sharma" required />
        </div>
        <div className="f">
          <label htmlFor="email">Email Address</label>
          <input id="email" name="email" type="email" placeholder="priya@wassimgul.co.in" required />
        </div>
      </div>

      <div className="f-row">
        <div className="f">
          <label htmlFor="role">Role</label>
          <select id="role" name="role" defaultValue="junior">
            <option value="junior">Junior</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div className="f">
          <label htmlFor="password">Temporary Password</label>
          <input id="password" name="password" type="text" placeholder="At least 6 characters" required minLength={6} />
        </div>
      </div>

      {state?.error && <p className="dash-field-error" role="alert">{state.error}</p>}
      {state?.success && <p className="dash-form-note" style={{ color: '#366145' }}>Account created — share the login details securely.</p>}

      <div className="dash-form-actions">
        <button type="submit" className="btn btn-solid" disabled={pending}>
          {pending ? 'Creating…' : 'Create Account'}
        </button>
      </div>
    </form>
  );
}
