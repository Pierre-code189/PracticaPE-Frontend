import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/useToast';
import { fecha, salario } from '../api/utils';
import Button from '../components/Button';
import Badge from '../components/Badge';
import Dialog from '../components/Dialog';
import Input from '../components/Input';

export default function PanelEmpresa() {
  const { user, isAuth } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const qc = useQueryClient();
  const [pubOpen, setPubOpen] = useState(false);
  const [job, setJob] = useState({ title: '', description: '', modality: 'medio tiempo', salary: '', district: 'Piura', schedule: '' });

  if (!isAuth || user?.role !== 'business') return (
    <main className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <p className="text-muted mb-4">Esta área es para empresas.</p>
        <Button onClick={() => navigate('/auth')}>Ingresar →</Button>
      </div>
    </main>
  );

  const { data: dash } = useQuery({ queryKey: ['businessDash'], queryFn: api.businessDashboard });
  const { data: jobsData } = useQuery({ queryKey: ['businessJobs'], queryFn: api.businessJobs });
  const jobs = jobsData?.items || (Array.isArray(jobsData) ? jobsData : []);

  const createJob = useMutation({
    mutationFn: (payload) => api.createJob(payload),
    onSuccess: () => { qc.invalidateQueries(['businessJobs']); setPubOpen(false); toast('Oferta publicada ✓', 'success'); setJob({ title: '', description: '', modality: 'medio tiempo', salary: '', district: 'Piura', schedule: '' }); },
    onError: e => toast(e.message, 'error'),
  });

  const closeJob = useMutation({
    mutationFn: (id) => api.closeJob(id),
    onSuccess: () => { qc.invalidateQueries(['businessJobs']); toast('Oferta cerrada'); },
    onError: e => toast(e.message, 'error'),
  });

  const kpis = [
    { label: 'Ofertas publicadas', value: dash?.published ?? '—' },
    { label: 'Postulantes totales', value: dash?.candidates ?? '—' },
    { label: 'Vistas este mes', value: dash?.views ?? '—' },
  ];

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
        <h1 className="font-display font-bold text-3xl uppercase tracking-tight">Panel de empresa</h1>
        <Button onClick={() => setPubOpen(true)}>+ Publicar oferta</Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {kpis.map(k => (
          <div key={k.label} className="card text-center">
            <p className="font-display font-bold text-4xl grad">{k.value}</p>
            <p className="text-muted text-xs mt-1 uppercase tracking-widest">{k.label}</p>
          </div>
        ))}
      </div>

      {/* Lista de ofertas */}
      <h2 className="font-display font-bold text-xl uppercase tracking-tight mb-4">Mis ofertas</h2>
      {jobs.length === 0 ? (
        <div className="card text-center py-10">
          <p className="text-muted mb-4">Aún no tienes ofertas publicadas.</p>
          <Button onClick={() => setPubOpen(true)}>Publicar primera oferta →</Button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {jobs.map(j => (
            <div key={j.id} className="card flex items-center gap-4 flex-wrap">
              <div className="flex-1 min-w-0">
                <h3 className="font-bold truncate">{j.title}</h3>
                <p className="text-muted text-xs">{fecha(j.created_at)} · {salario(j) || 'Sin salario'}</p>
              </div>
              <Badge variant={j.status === 'published' ? 'cyan' : j.status === 'draft' ? 'default' : 'danger'}>
                {j.status === 'published' ? 'Publicada' : j.status === 'draft' ? 'Borrador' : 'Cerrada'}
              </Badge>
              {j.status === 'published' && (
                <Button size="sm" variant="danger" onClick={() => closeJob.mutate(j.id)}>Cerrar</Button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Dialog publicar */}
      <Dialog open={pubOpen} onClose={() => setPubOpen(false)} title="Publicar oferta">
        <div className="flex flex-col gap-3 max-h-[60vh] overflow-y-auto pr-1">
          <Input label="Título del puesto *" value={job.title} onChange={e => setJob(j => ({ ...j, title: e.target.value }))} />
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold uppercase tracking-widest text-muted">Descripción</label>
            <textarea value={job.description} onChange={e => setJob(j => ({ ...j, description: e.target.value }))}
              className="bg-black/[0.04] border border-black/10 text-ink px-4 py-3 text-sm focus:outline-none focus:border-cyan h-24 resize-none" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold uppercase tracking-widest text-muted">Modalidad</label>
            <select value={job.modality} onChange={e => setJob(j => ({ ...j, modality: e.target.value }))}
              className="bg-surface border border-black/10 text-ink px-4 py-3 text-sm focus:outline-none focus:border-cyan">
              <option value="medio tiempo">Medio tiempo</option>
              <option value="tiempo completo">Tiempo completo</option>
              <option value="cachuelo">Cachuelo</option>
            </select>
          </div>
          <Input label="Salario" value={job.salary} onChange={e => setJob(j => ({ ...j, salary: e.target.value }))} placeholder="Ej: S/ 500 al mes" />
          <Input label="Horario" value={job.schedule} onChange={e => setJob(j => ({ ...j, schedule: e.target.value }))} placeholder="Ej: Lun-Vie 8am-1pm" />
          <div className="flex gap-2 mt-2">
            <Button onClick={() => createJob.mutate(job)} disabled={!job.title || createJob.isPending}>
              {createJob.isPending ? 'Publicando…' : 'Publicar'}
            </Button>
            <Button variant="outline" onClick={() => setPubOpen(false)}>Cancelar</Button>
          </div>
        </div>
      </Dialog>
    </main>
  );
}
