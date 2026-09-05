'use client';

import { useActionState, useEffect, useRef } from 'react';
import { submitContactForm } from '@/app/contact/actions';

export default function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContactForm, undefined);
  const formRef = useRef(null);

  useEffect(() => {
    if (state?.success) formRef.current?.reset();
  }, [state]);

  return (
    <form className="form" ref={formRef} action={formAction} noValidate>
      <div className="f-row">
        <div className="f"><label htmlFor="fn">First Name</label><input id="fn" name="firstName" type="text" placeholder="John" required /></div>
        <div className="f"><label htmlFor="ln">Last Name</label><input id="ln" name="lastName" type="text" placeholder="Doe" required /></div>
      </div>
      <div className="f-row">
        <div className="f"><label htmlFor="em">Email Address</label><input id="em" name="email" type="email" placeholder="john@example.com" required /></div>
        <div className="f"><label htmlFor="ph">Phone Number</label><input id="ph" name="phone" type="tel" placeholder="+91 00000 00000" /></div>
      </div>
      <div className="f-row">
        <div className="f">
          <label htmlFor="sv">Select Service</label>
          <select id="sv" name="service" required>
            <option value="">Choose a service</option>
            <option>Criminal Defense</option>
            <option>Corporate Law</option>
            <option>Family Law</option>
            <option>Legal Consultation</option>
          </select>
        </div>
        <div className="f"><label htmlFor="dt">Preferred Date</label><input id="dt" name="date" type="date" /></div>
      </div>
      <div className="f" style={{ marginBottom: '22px' }}>
        <label htmlFor="ms">Message</label>
        <textarea id="ms" name="message" rows="3" placeholder="Briefly describe your legal matter"></textarea>
      </div>
      <button type="submit" className="btn btn-solid" disabled={pending}>
        {pending ? 'Sending…' : 'Confirm your appointment'}
      </button>
      <p className="form-note" role="status">
        {state?.error && <span style={{ color: '#8a2e1f' }}>{state.error}</span>}
        {state?.success && <span style={{ color: '#366145' }}>Thank you — your request has been received. We'll be in touch shortly.</span>}
      </p>
    </form>
  );
}
