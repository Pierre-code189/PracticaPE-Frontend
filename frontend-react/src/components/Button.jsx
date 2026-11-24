// Button — variantes: primary (gradiente) | outline | ghost | danger
export default function Button({
  children,
  variant = 'primary',
  size = '',
  disabled = false,
  onClick,
  type = 'button',
  className = '',
  ...rest
}) {
  const base = 'inline-flex items-center gap-2 font-bold transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan disabled:opacity-50 disabled:pointer-events-none';
  const sizes = { sm: 'px-4 py-2 text-sm', md: 'px-6 py-3 text-sm', lg: 'px-8 py-4 text-base' };
  const sz = sizes[size] || sizes.md;
  const variants = {
    primary:  'btn-primary',
    outline:  'btn-outline',
    ghost:    'bg-transparent text-muted hover:text-ink border-0',
    danger:   'bg-transparent text-error border border-red-400/50 hover:border-red-400 px-6 py-3',
    secondary:'bg-ink text-bg font-extrabold px-6 py-3',
  };
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${base} ${sz} ${variants[variant] || ''} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
