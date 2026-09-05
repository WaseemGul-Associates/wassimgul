'use client';

import { useActionState, useEffect, useRef } from 'react';
import { uploadCaseFile } from '../actions';

export default function UploadFileForm({ caseId, caseNumber }) {
  const [state, formAction, pending] = useActionState(uploadCaseFile, undefined);
  const formRef = useRef(null);

  useEffect(() => {
    if (state?.success) formRef.current?.reset();
  }, [state]);

  return (
    <form action={formAction} ref={formRef} className="dash-form">
      <input type="hidden" name="caseId" value={caseId} />
      <input type="hidden" name="caseNumber" value={caseNumber || ''} />
      <div className="upload-row">
        <div className="f">
          <label htmlFor="file">Upload Case File (PDF)</label>
          <input id="file" name="file" type="file" accept="application/pdf" required />
        </div>
        <button type="submit" className="btn btn-outline" disabled={pending}>
          {pending ? 'Uploading…' : 'Upload'}
        </button>
      </div>
      {state?.error && <p className="dash-field-error" role="alert">{state.error}</p>}
    </form>
  );
}
