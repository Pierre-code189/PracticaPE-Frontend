// Enlace al anuncio original: la procedencia de cada oferta scrapeada.
// Sin url (ofertas manuales) no renderiza nada, para no dejar un enlace roto.

function IconOpen({ className = 'w-3.5 h-3.5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M14 4h6v6" />
      <path d="M20 4 9 15" />
      <path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
    </svg>
  );
}

export default function FuenteLink({ url, compacto = false, label }) {
  if (!url) return null;
  let host = '';
  try { host = new URL(url).hostname.replace(/^www\./, ''); } catch { return null; }
  if (!host) return null;

  const texto = label || host;
  const title = `Ver el anuncio original en ${host}`;

  if (compacto) {
    // Pie de tarjeta: dominio con ícono, sin fondo.
    return (
      <a href={url} target="_blank" rel="noopener noreferrer nofollow" title={title}
        className="inline-flex items-center gap-1 text-xs text-muted hover:text-primary transition-colors max-w-[10rem]">
        <IconOpen className="w-3 h-3 shrink-0" />
        <span className="truncate">{texto}</span>
      </a>
    );
  }

  // Pastilla destacada para el detalle.
  return (
    <a href={url} target="_blank" rel="noopener noreferrer nofollow" title={title}
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-low text-ink hover:bg-primary-container hover:text-primary-deep transition-colors w-fit max-w-full">
      <IconOpen className="w-4 h-4 shrink-0" />
      <span className="text-sm font-semibold truncate">Anuncio original: {host}</span>
    </a>
  );
}
