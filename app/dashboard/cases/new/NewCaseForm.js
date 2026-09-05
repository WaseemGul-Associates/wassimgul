'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { createCase } from '../actions';

export default function NewCaseForm() {
  const [state, formAction, pending] = useActionState(createCase, undefined);

  return (
    <form action={formAction} className="dash-form" noValidate>
      <div className="f-row">
        <div className="f">
          <label htmlFor="caseNumber">Case Number</label>
          <input id="caseNumber" name="caseNumber" type="text" placeholder="CR-2026-0142" required />
        </div>
        <div className="f">
          <label htmlFor="clientName">Client Name</label>
          <input id="clientName" name="clientName" type="text" placeholder="Jane Doe" required />
        </div>
      </div>

      <div className="f-row">
        <div className="f">
          <label htmlFor="title">Case Title</label>
          <input id="title" name="title" type="text" placeholder="Property Dispute" />
        </div>
        <div className="f">
          <label htmlFor="court">Court</label>
          <input id="court" name="court" type="text" placeholder="District Court" />
        </div>
      </div>

      <div className="f-row">
        <div className="f">
          <label htmlFor="status">Status</label>
          <select id="status" name="status" defaultValue="active">
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="closed">Closed</option>
          </select>
        </div>
        <div />
      </div>

      <div className="f">
        <label htmlFor="description">Description (optional)</label>
        <textarea id="description" name="description" rows="4" placeholder="Brief matter summary…"></textarea>
      </div>

      {state?.error && <p className="dash-field-error" role="alert">{state.error}</p>}

      <div className="dash-form-actions">
        <button type="submit" className="btn btn-solid" disabled={pending}>
          {pending ? 'Creating…' : 'Create Case'}
        </button>
        <Link href="/dashboard/cases" className="btn btn-outline">Cancel</Link>
      </div>
    </form>
  );
}
