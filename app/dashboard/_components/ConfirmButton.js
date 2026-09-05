'use client';

import { useState, useRef, useEffect } from 'react';
import { useFormStatus } from 'react-dom';

// Renders a normal trigger button; clicking it opens a styled confirmation
// modal instead of the native browser confirm(). Confirming submits the
// enclosing <form> (via the native `button.form` reference) so it still works
// as a drop-in inside any `<form action={serverAction}>`.
export default function ConfirmButton({
  children,
  confirmText = 'Are you sure? This cannot be undone.',
  title = 'Confirm Deletion',
  confirmLabel = 'Delete',
  className,
  ...props
}) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);
  const confirmRef = useRef(null);
  const { pending } = useFormStatus();

  useEffect(() => {
    if (!open) return;
    confirmRef.current?.focus();
    function onKey(e) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        ref={triggerRef}
        className={className}
        disabled={pending}
        onClick={() => setOpen(true)}
        {...props}
      >
        {pending ? 'Working…' : children}
      </button>

      {open && (
        <div className="confirm-overlay" onClick={() => setOpen(false)}>
          <div
            className="confirm-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 id="confirm-modal-title">{title}</h3>
            <p>{confirmText}</p>
            <div className="confirm-modal-actions">
              <button type="button" className="btn btn-outline btn-sm" onClick={() => setOpen(false)}>
                Cancel
              </button>
              <button
                type="button"
                ref={confirmRef}
                className="btn btn-danger btn-sm"
                onClick={() => {
                  setOpen(false);
                  triggerRef.current?.form?.requestSubmit();
                }}
              >
                {confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
