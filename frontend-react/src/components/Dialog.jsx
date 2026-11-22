import { useEffect, useRef } from 'react';

export default function Dialog({ open, onClose, title, children }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const esc = (e) => { if (e.key === 'Escape') onClose?.(); };
    document.addEventListener('keydown', esc);
    ref.current?.focus();
    return () => document.removeEventListener('keydown', esc);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(11,11,15,0.75)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose?.(); }}
    >
      <div
        ref={ref}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="bg-surface border border-white/10 w-full max-w-md p-6 shadow-2xl outline-none"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-display font-bold text-xl tracking-tight">{title}</h2>
          <button
            onClick={onClose}
            className="text-muted hover:text-ink border border-white/20 px-3 py-1 text-sm"
            aria-label="Cerrar"
          >✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}
