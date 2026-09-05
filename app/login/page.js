'use client';

import { useActionState, useState } from 'react';
import { login } from './actions';
import './login.css';

// --- Icons ---
const ShieldCheckIcon = () => <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 12 11 14 15 10"></polyline></svg>;
const UsersIcon = () => <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>;
const DocIcon = () => <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>;
const MailIcon = () => <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>;
const LockIcon = () => <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>;
const EyeIcon = ({ visible }) => visible 
  ? <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
  : <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>;
const ShieldSmallIcon = () => <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 12 11 14 15 10"></polyline></svg>;

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, undefined);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="login-screen">
      <main className="login-layout">
        {/* LEFT PANE - Branding */}
        <div className="login-left">
          <div className="login-left-overlay"></div>
        <div className="login-left-content">
          <div className="login-left-logo">
            <img src="/wassim-gul-logo.png" alt="WassimGul Logo" />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span>WassimGul<span style={{ color: 'var(--gold-soft)' }}>.</span></span>
              <span className="login-left-tag">LAW FIRM</span>
            </div>
          </div>

          <div className="login-left-text">
            <h1>Justice<br/>Through<br/>Dedication</h1>
            <p>Trusted legal support for a fairer tomorrow.</p>
          </div>

        </div>
      </div>

      {/* RIGHT PANE - Form */}
      <div className="login-right">
        <div className="login-card">
          <div className="login-card-logo">
            <img src="/wassim-gul-logo.png" alt="WassimGul Logo" />
            <span className="login-card-brand">WassimGul</span>
            <span className="login-card-tag">LAW FIRM</span>
          </div>
          
          <h2>Welcome Back</h2>
          <p className="login-sub">Sign in to access your cases, files, orders and notes.</p>

          <form action={formAction} className="login-form" noValidate>
            <div className="f">
              <label htmlFor="email">Email Address</label>
              <div className="input-wrap">
                <span className="input-ico-left"><MailIcon /></span>
                <input id="email" name="email" type="email" placeholder="Enter your email address" required autoComplete="email" />
              </div>
            </div>
            
            <div className="f">
              <label htmlFor="password">Password</label>
              <div className="input-wrap">
                <span className="input-ico-left"><LockIcon /></span>
                <input 
                  id="password" 
                  name="password" 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Enter your password" 
                  required 
                  autoComplete="current-password" 
                />
                <button type="button" className="input-ico-right" onClick={() => setShowPassword(!showPassword)} title="Toggle password visibility">
                  <EyeIcon visible={showPassword} />
                </button>
              </div>
            </div>

            <div className="login-options">
              <label className="checkbox-wrap">
                <input type="checkbox" name="remember" />
                <span className="checkmark"></span>
                Remember me
              </label>
            </div>

            {state?.error && <p className="login-error" role="alert">{state.error}</p>}

            <button type="submit" className="btn login-submit" disabled={pending}>
              {pending ? 'Signing in…' : 'Sign In'}
            </button>

            <div className="login-divider">
              <span>or</span>
            </div>

            <a href="/" className="login-back-btn">Back to website</a>
          </form>
        </div>
      </div>
    </main>
  </div>
);
}
