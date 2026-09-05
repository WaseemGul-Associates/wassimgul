'use client';

import { useRef } from 'react';
import { updateLeadStatus } from './actions';

export default function StatusSelect({ id, status }) {
  const formRef = useRef(null);

  return (
    <form action={updateLeadStatus} ref={formRef}>
      <input type="hidden" name="id" value={id} />
      <select
        name="status"
        defaultValue={status}
        className="dash-select"
        onChange={() => formRef.current?.requestSubmit()}
      >
        <option value="new">New</option>
        <option value="read">Read</option>
        <option value="resolved">Resolved</option>
      </select>
    </form>
  );
}
