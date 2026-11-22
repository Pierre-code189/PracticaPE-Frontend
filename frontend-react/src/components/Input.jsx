export default function Input({ label, error, className = '', ...props }) {
  const id = props.id || props.name;
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-xs font-bold uppercase tracking-widest text-muted">
          {label}
        </label>
      )}
      <input
        id={id}
        className="bg-white/5 border border-white/10 text-ink px-4 py-3 text-sm
                   focus:outline-none focus:border-cyan placeholder-muted w-full"
        {...props}
      />
      {error && <span className="text-red-400 text-xs">{error}</span>}
    </div>
  );
}
