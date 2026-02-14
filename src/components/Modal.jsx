import { useEffect, useRef } from 'react';

export default function Modal({ isOpen, title, onClose, children }) {
  const dialogRef = useRef(null);
  const lastActiveRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    lastActiveRef.current = document.activeElement;

    const dialog = dialogRef.current;
    if (dialog) {
      // focus first focusable element inside
      const focusable = dialog.querySelectorAll(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length) focusable[0].focus();
      else dialog.focus();
    }

    function onKeyDown(e) {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }

      // Focus trap (Tab)
      if (e.key === 'Tab') {
        const focusable = dialog.querySelectorAll(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable.length) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      // restore focus
      lastActiveRef.current?.focus?.();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="presentation"
      onMouseDown={(e) => {
        // click outside closes
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="absolute inset-0 bg-black/40" />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className="relative z-10 w-full max-w-lg rounded-2xl bg-white p-5 shadow-lg border"
      >
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="px-3 py-2 rounded-md border hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
          >
            Close
          </button>
        </div>

        <div className="mt-4 text-sm text-gray-800">{children}</div>
      </div>
    </div>
  );
}
