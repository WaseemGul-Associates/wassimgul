'use client';

import { useState, useEffect, useActionState } from 'react';
import { updateCaseUpdate, deleteCaseUpdate } from '@/app/dashboard/cases/actions';
import ConfirmButton from './ConfirmButton';

export default function UpdateItem({ item, caseId, caseNumber, canManage, authorName, caseLabel }) {
  const [editing, setEditing] = useState(false);
  const [state, formAction, pending] = useActionState(updateCaseUpdate, undefined);

  useEffect(() => {
    if (state?.success) setEditing(false);
  }, [state]);

  const dateLabel = new Date(item.entry_date).toLocaleDateString('en-GB', {
    year: 'numeric', month: 'short', day: 'numeric',
  });

  if (editing) {
    return (
      <div className="timeline-item">
        <form action={formAction} className="dash-form">
          <input type="hidden" name="id" value={item.id} />
          <input type="hidden" name="caseId" value={caseId} />
          <input type="hidden" name="caseNumber" value={caseNumber || ''} />
          <div className="f-row">
            <div className="f">
              <label htmlFor={`type-${item.id}`}>Type</label>
              <select id={`type-${item.id}`} name="type" defaultValue={item.type}>
                <option value="order">Daily Order</option>
                <option value="note">Note</option>
              </select>
            </div>
            <div className="f">
              <label htmlFor={`date-${item.id}`}>Date</label>
              <input id={`date-${item.id}`} name="entryDate" type="date" defaultValue={item.entry_date} />
            </div>
          </div>
          <div className="f">
            <label htmlFor={`content-${item.id}`}>Entry</label>
            <textarea id={`content-${item.id}`} name="content" rows="3" defaultValue={item.content} required></textarea>
          </div>
          {state?.error && <p className="dash-field-error" role="alert">{state.error}</p>}
          <div className="dash-form-actions">
            <button type="submit" className="btn btn-solid btn-sm" disabled={pending}>
              {pending ? 'Saving…' : 'Save'}
            </button>
            <button type="button" className="btn btn-outline btn-sm" onClick={() => setEditing(false)}>Cancel</button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="timeline-item">
      <div className="timeline-item-head">
        <span className={`badge badge-${item.type}`}>{item.type === 'order' ? 'Daily Order' : 'Note'}</span>
        <span className="timeline-meta">
          {dateLabel}
          {caseLabel ? ` · ${caseLabel}` : ''}
          {authorName ? ` · ${authorName}` : ''}
        </span>
      </div>
      <p className="timeline-content">{item.content}</p>
      {canManage && (
        <div className="timeline-actions" style={{ marginTop: 10 }}>
          <button type="button" onClick={() => setEditing(true)}>Edit</button>
          <form action={deleteCaseUpdate} style={{ display: 'inline' }}>
            <input type="hidden" name="id" value={item.id} />
            <input type="hidden" name="caseId" value={caseId} />
            <input type="hidden" name="caseNumber" value={caseNumber || ''} />
            <input type="hidden" name="type" value={item.type} />
            <ConfirmButton confirmText="This entry will be permanently removed.">Delete</ConfirmButton>
          </form>
        </div>
      )}
    </div>
  );
}
