import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import JobCard from '../components/JobCard';
import Button from '../components/Button';

export default function Home() {
  const [q, setQ] = useState('');
  const [submitted, setSubmitted] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['jobs-home'],
    queryFn: () => api.jobs({ status: 'published', limit: 6 }),
  });

  const jobs = data?.items || [];

  return (
    <main className="max-w-5xl mx-auto px-4 py-16">
      {/* Hero */}
      <section className="mb-16">
        <h1 className="font-display font-bold uppercase tracking-tight text-5xl md:text-7xl mb-6 leading-none">
          Encuentra tu<br /><span className="grad">próximo empleo</span><br />en Piura
        </h1>
        <p className="text-muted text-lg mb-8 max-w-xl">
          Prácticas, medios tiempos y cachuelos verificados en tu ciudad.
        </p>
        <form
          className="flex gap-2 flex-wrap"
          onSubmit={e => { e.preventDefault(); setSubmitted(q); }}
        >
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Buscar puesto, empresa..."
            className="flex-1 min-w-0 bg-white/5 border border-white/10 text-ink px-4 py-3
                       focus:outline-none focus:border-cyan placeholder-muted"
          />
          <Button type="submit">Buscar</Button>
        </form>
        <div className="flex gap-2 flex-wrap mt-4">
          {['Medio tiempo','Cachuelos','Tiempo completo'].map(m => (
            <Link key={m} to={`/ofertas?modalidad=${encodeURIComponent(m)}`}>
              <span className="border border-white/20 px-4 py-2 text-sm font-semibold hover:border-cyan hover:text-cyan transition-colors cursor-pointer">
                {m}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Ofertas destacadas */}
      <section>
        <h2 className="font-display font-bold text-2xl uppercase tracking-tight mb-6">
          Ofertas destacadas
        </h2>
        {isLoading ? (
          <p className="text-muted">Cargando...</p>
        ) : jobs.length === 0 ? (
          <p className="text-muted">No hay ofertas disponibles aún.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {jobs.map(j => <JobCard key={j.id} job={j} />)}
          </div>
        )}
        <div className="mt-8 text-center">
          <Link to="/ofertas"><Button variant="outline">Ver todas las ofertas →</Button></Link>
        </div>
      </section>
    </main>
  );
}
