const variants = {
  default:  'border-white/20 text-muted',
  cyan:     'border-cyan text-cyan',
  violet:   'border-violet text-violet',
  success:  'border-green-400 text-green-400',
  danger:   'border-red-400 text-red-400',
};
export default function Badge({ children, variant = 'default', className = '' }) {
  return (
    <span className={`text-xs font-bold uppercase tracking-widest border px-2 py-1 ${variants[variant] || variants.default} ${className}`}>
      {children}
    </span>
  );
}
