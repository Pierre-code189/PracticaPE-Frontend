import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useJobs, useDistricts } from '../hooks/useJobs';
import JobCard from '../components/JobCard';
import Button from '../components/Button';
import Dialog from '../components/Dialog';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/useToast';

const PAGE = 12;

export default function Ofertas() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuth } = useAuth();
  const toast = useToast();
  const [q, setQ] = useState(searchParams.get('q') || '');
  const [modalidad, setModalidad] = useState(searchParams.get('modalidad') || '');
  const [page, setPage] = useState(1);
  const [applyJob, setApplyJob] = useState(null);

  // Al cambiar la búsqueda o el filtro se vuelve a la primera página.
  useEffect(() => { setPage(1); }, [q, modalidad]);

  const { data, isLoading } = useJobs({
    q, modality: modalidad, status: 'published', limit: PAGE, offset: (page - 1) * PAGE,
  });
  const { data: districts } = useDistricts();

  const jobs = data?.items || [];
  const total = Number(data?.total ?? 0);
  const nPag = Math.max(1, Math.ceil(total / PAGE));
  const desde = total === 0 ? 0 : (page - 1) * PAGE + 1;
  const hasta = (page - 1) * PAGE + jobs.length;

  const handleApply = async (job) => {
    if (!isAuth) { navigate('/auth'); return; }
    setApplyJob(job);
  };

  const confirmApply = async () => {
    try {
      await api.apply(applyJob.id);
      toast('Postulación enviada ✓', 'success');
      setApplyJob(null);
    } catch (e) {
      toast(e.message || 'Error al postular', 'error');
    }
  };

  const pgBtn = (label, destino, activa = false, disabled = false) => (
    <button
      key={label}
      type="button"
      disabled={disabled}
      onClick={() => setPage(destino)}
      aria-current={activa ? 'page' : undefined}
      className={
        'min-w-9 h-9 px-2 text-sm font-semibold rounded-lg border transition-colors ' +
        (activa
          ? 'bg-primary text-white border-primary'
          : 'bg-surface text-ink border-black/10 hover:border-primary hover:text-primary') +
        (disabled ? ' opacity-40 cursor-not-allowed hover:border-black/10 hover:text-ink' : '')
      }
    >
      {label}
    </button>
  );

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="font-display font-bold text-3xl uppercase tracking-tight mb-6">Ofertas</h1>

      {/* Filtros */}
      <div className="flex flex-wrap gap-2 mb-6">
        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="Buscar..."
          className="bg-surface border border-black/10 text-ink px-4 py-2 text-sm focus:outline-none focus:border-primary flex-1 min-w-48"
        />
        <select
          value={modalidad}
          onChange={e => setModalidad(e.target.value)}
          className="bg-surface border border-black/10 text-ink px-4 py-2 text-sm focus:outline-none focus:border-primary"
        >
          <option value="">Todas las modalidades</option>
          <option value="medio tiempo">Medio tiempo</option>
          <option value="tiempo completo">Tiempo completo</option>
          <option value="cachuelo">Cachuelo</option>
        </select>
      </div>

      {/* Resultados */}
      {isLoading ? (
        <p className="text-muted">Cargando ofertas...</p>
      ) : jobs.length === 0 ? (
        <p className="text-muted">No se encontraron ofertas.</p>
      ) : (
        <>
          <p className="text-muted text-sm mb-4">
            Mostrando {desde} - {hasta} de {total}
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {jobs.map(j => (
              <JobCard key={j.id} job={j} onApply={handleApply} />
            ))}
          </div>

          {nPag > 1 && (
            <nav className="flex flex-wrap items-center justify-center gap-1.5 mt-8" aria-label="Paginación">
              {pgBtn('Anterior', page - 1, false, page <= 1)}
              {Array.from({ length: nPag }, (_, i) => i + 1).map(n => pgBtn(String(n), n, n === page))}
              {pgBtn('Siguiente', page + 1, false, page >= nPag)}
            </nav>
          )}
        </>
      )}

      {/* Dialog postulación */}
      <Dialog open={!!applyJob} onClose={() => setApplyJob(null)} title="Postularme a esta oferta">
        {applyJob && (
          <>
            <p className="text-muted mb-4">¿Confirmas tu postulación a <strong className="text-ink">{applyJob.title}</strong>?</p>
            <div className="flex gap-2">
              <Button onClick={confirmApply}>Confirmar</Button>
              <Button variant="outline" onClick={() => setApplyJob(null)}>Cancelar</Button>
            </div>
          </>
        )}
      </Dialog>
    </main>
  );
}
