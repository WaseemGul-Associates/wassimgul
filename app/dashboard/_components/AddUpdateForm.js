'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { addCaseUpdate } from '@/app/dashboard/cases/actions';

const today = () => new Date().toISOString().slice(0, 10);

// caseId + caseNumber: fixed case (per-case detail page) -> hidden inputs.
// cases: list of {id, case_number, title} -> renders a "Select Case" dropdown instead
//   (dashboard-level quick-add / Orders & Notes pages) — the case number for the
//   activity log is resolved client-side from this already-loaded list, no extra query.
// fixedType: 'order' | 'note' -> locks the type, hides the type selector.
export default function AddUpdateForm({ caseId, caseNumber, cases, fixedType, submitLabel = 'Add Entry' }) {
  const [state, formAction, pending] = useActionState(addCaseUpdate, undefined);
  const formRef = useRef(null);
  const [selectedCaseNumber, setSelectedCaseNumber] = useState('');

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
      setSelectedCaseNumber('');
    }
  }, [state]);

  return (
    <form action={formAction} ref={formRef} className="dash-form">
      {caseId && <input type="hidden" name="caseId" value={caseId} />}
      {caseNumber && <input type="hidden" name="caseNumber" value={caseNumber} />}
      {cases && <input type="hidden" name="caseNumber" value={selectedCaseNumber} />}
      {fixedType && <input type="hidden" name="type" value={fixedType} />}

      {cases && (
        <div className="f">
          <label htmlFor="caseId">Case</label>
          <select
            id="caseId"
            name="caseId"
            defaultValue=""
            required
            onChange={(e) => {
              const selected = cases.find((c) => c.id === e.target.value);
              setSelectedCaseNumber(selected?.case_number || '');
            }}
          >
            <option value="" disabled>Select Case</option>
            {cases.map((c) => (
              <option key={c.id} value={c.id}>
                {c.case_number}{c.title ? ` - ${c.title}` : ''}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="f-row">
        {!fixedType && (
          <div className="f">
            <label htmlFor="type">Type</label>
            <select id="type" name="type" defaultValue="note">
              <option value="order">Daily Order</option>
              <option value="note">Note</option>
            </select>
          </div>
        )}
        <div className="f">
          <label htmlFor="entryDate">Date</label>
          <input id="entryDate" name="entryDate" type="date" defaultValue={today()} />
        </div>
      </div>
      <div className="f">
        <label htmlFor="content">Entry</label>
        <textarea id="content" name="content" rows="3" placeholder="What happened today…" required></textarea>
      </div>
      {state?.error && <p className="dash-field-error" role="alert">{state.error}</p>}
      <div className="dash-form-actions">
        <button type="submit" className="btn btn-solid btn-sm" disabled={pending}>
          {pending ? 'Adding…' : submitLabel}
        </button>
      </div>
    </form>
  );
}
