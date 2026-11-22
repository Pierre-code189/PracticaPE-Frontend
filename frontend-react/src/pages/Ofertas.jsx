import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useJobs, useDistricts } from '../hooks/useJobs';
import JobCard from '../components/JobCard';
import Button from '../components/Button';
import Dialog from '../components/Dialog';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/useToast';

export default function Ofertas() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuth } = useAuth();
  const toast = useToast();
  const [q, setQ] = useState(searchParams.get('q') || '');
  const [modalidad, setModalidad] = useState(searchParams.get('modalidad') || '');
  const [applyJob, setApplyJob] = useState(null);

  const { data, isLoading } = useJobs({ q, modality: modalidad, status: 'published', limit: 30 });
  const { data: districts } = useDistricts();

  const jobs = data?.items || [];

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

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="font-display font-bold text-3xl uppercase tracking-tight mb-6">Ofertas</h1>

      {/* Filtros */}
      <div className="flex flex-wrap gap-2 mb-6">
        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="Buscar..."
          className="bg-white/5 border border-white/10 text-ink px-4 py-2 text-sm focus:outline-none focus:border-cyan flex-1 min-w-48"
        />
        <select
          value={modalidad}
          onChange={e => setModalidad(e.target.value)}
          className="bg-surface border border-white/10 text-ink px-4 py-2 text-sm focus:outline-none focus:border-cyan"
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
          <p className="text-muted text-sm mb-4">{jobs.length} oferta{jobs.length !== 1 ? 's' : ''} encontrada{jobs.length !== 1 ? 's' : ''}</p>
          <div className="grid md:grid-cols-2 gap-4">
            {jobs.map(j => (
              <JobCard key={j.id} job={j} onApply={handleApply} />
            ))}
          </div>
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
