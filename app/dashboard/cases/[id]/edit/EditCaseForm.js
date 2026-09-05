'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { updateCase } from '../../actions';

export default function EditCaseForm({ caseRow }) {
  const [state, formAction, pending] = useActionState(updateCase, undefined);

  return (
    <form action={formAction} className="dash-form" noValidate>
      <input type="hidden" name="id" value={caseRow.id} />
      <div className="f-row">
        <div className="f">
          <label htmlFor="caseNumber">Case Number</label>
          <input id="caseNumber" name="caseNumber" type="text" defaultValue={caseRow.case_number} required />
        </div>
        <div className="f">
          <label htmlFor="clientName">Client Name</label>
          <input id="clientName" name="clientName" type="text" defaultValue={caseRow.client_name} required />
        </div>
      </div>

      <div className="f-row">
        <div className="f">
          <label htmlFor="title">Case Title</label>
          <input id="title" name="title" type="text" defaultValue={caseRow.title || ''} placeholder="Property Dispute" />
        </div>
        <div className="f">
          <label htmlFor="court">Court</label>
          <input id="court" name="court" type="text" defaultValue={caseRow.court || ''} placeholder="District Court" />
        </div>
      </div>

      <div className="f-row">
        <div className="f">
          <label htmlFor="status">Status</label>
          <select id="status" name="status" defaultValue={caseRow.status}>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="closed">Closed</option>
          </select>
        </div>
        <div />
      </div>

      <div className="f">
        <label htmlFor="description">Description (optional)</label>
        <textarea id="description" name="description" rows="4" defaultValue={caseRow.description || ''}></textarea>
      </div>

      {state?.error && <p className="dash-field-error" role="alert">{state.error}</p>}

      <div className="dash-form-actions">
        <button type="submit" className="btn btn-solid" disabled={pending}>
          {pending ? 'Saving…' : 'Save Changes'}
        </button>
        <Link href={`/dashboard/cases/${caseRow.id}`} className="btn btn-outline">Cancel</Link>
      </div>
    </form>
  );
}
