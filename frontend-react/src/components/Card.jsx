export function Card({ children, className = '' }) {
  return <div className={`card ${className}`}>{children}</div>;
}
export function CardHeader({ children, className = '' }) {
  return <div className={`mb-3 ${className}`}>{children}</div>;
}
export function CardTitle({ children, className = '' }) {
  return <h3 className={`font-display font-bold text-lg tracking-tight ${className}`}>{children}</h3>;
}
export function CardDescription({ children, className = '' }) {
  return <p className={`text-muted text-sm mt-1 ${className}`}>{children}</p>;
}
export function CardContent({ children, className = '' }) {
  return <div className={className}>{children}</div>;
}
export function CardFooter({ children, className = '' }) {
  return (
    <div className={`flex flex-wrap gap-2 mt-4 pt-4 border-t border-black/10 ${className}`}>
      {children}
    </div>
  );
}
