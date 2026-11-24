import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';
import { initials } from '../api/utils';

export default function Empresas() {
  const [q, setQ] = useState('');
  const { data, isLoading } = useQuery({
    queryKey: ['companies', q],
    queryFn: () => api.companies({ q }),
    staleTime: 60_000,
  });
  const companies = data?.items || (Array.isArray(data) ? data : []);

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="font-display font-bold text-3xl uppercase tracking-tight mb-6">Directorio de empresas</h1>
      <input
        value={q}
        onChange={e => setQ(e.target.value)}
        placeholder="Buscar empresa..."
        className="bg-black/[0.04] border border-black/10 text-ink px-4 py-3 text-sm focus:outline-none focus:border-cyan w-full mb-6"
      />
      {isLoading ? (
        <p className="text-muted">Cargando…</p>
      ) : companies.length === 0 ? (
        <p className="text-muted">No se encontraron empresas.</p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {companies.map(c => (
            <Link key={c.id} to={`/empresa/${c.id}`}>
              <article className="card hover:border-cyan/40 transition-colors h-full">
                <div className="flex gap-3 items-center mb-3">
                  <div className="w-12 h-12 shrink-0 flex items-center justify-center font-extrabold text-sm"
                    style={{ background: 'linear-gradient(90deg,#0E7C66,#4FC3A7)' }}>
                    {initials(c.name)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-sm truncate">{c.name}</h3>
                    <p className="text-muted text-xs">{c.sector || 'Empresa'} · {c.district || 'Piura'}</p>
                  </div>
                </div>
                {c.description && <p className="text-muted text-xs line-clamp-2">{c.description}</p>}
                {c.jobs_count > 0 && (
                  <p className="text-xs font-bold text-cyan mt-2">{c.jobs_count} oferta{c.jobs_count !== 1 ? 's' : ''}</p>
                )}
              </article>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
