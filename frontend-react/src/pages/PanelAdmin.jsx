import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/useToast';
import { fecha } from '../api/utils';
import Button from '../components/Button';
import Badge from '../components/Badge';

export default function PanelAdmin() {
  const { user, isAuth } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const qc = useQueryClient();

  if (!isAuth || user?.role !== 'admin') return (
    <main className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <p className="text-muted mb-4">Acceso restringido a administradores.</p>
        <Button onClick={() => navigate('/auth')}>Ingresar →</Button>
      </div>
    </main>
  );

  const { data: dash } = useQuery({ queryKey: ['adminDash'], queryFn: api.adminDashboard });
  const { data: queueData, isLoading: qLoading } = useQuery({ queryKey: ['adminQueue'], queryFn: api.adminQueue });
  const queue = queueData?.items || (Array.isArray(queueData) ? queueData : []);

  const moderate = useMutation({
    mutationFn: ({ id, action }) => api.adminModerate(id, action),
    onSuccess: (_, { action }) => { qc.invalidateQueries(['adminQueue']); qc.invalidateQueries(['adminDash']); toast(action === 'approve' ? 'Aprobada ✓' : 'Rechazada', action === 'approve' ? 'success' : ''); },
    onError: e => toast(e.message, 'error'),
  });

  const kpis = [
    { label: 'Usuarios', value: dash?.users },
    { label: 'Candidatos', value: dash?.candidates },
    { label: 'Empresas', value: dash?.companies },
    { label: 'Ofertas', value: dash?.jobs_published },
    { label: 'En cola', value: dash?.queue },
    { label: 'Postulaciones', value: dash?.applications },
  ];

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="font-display font-bold text-3xl uppercase tracking-tight mb-8">
        Panel de administración
      </h1>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
        {kpis.map(k => (
          <div key={k.label} className="card text-center">
            <p className="font-display font-bold text-4xl grad">{k.value ?? '—'}</p>
            <p className="text-muted text-xs mt-1 uppercase tracking-widest">{k.label}</p>
          </div>
        ))}
      </div>

      {/* Cola de moderación */}
      <h2 className="font-display font-bold text-xl uppercase tracking-tight mb-4">Cola de moderación</h2>
      {qLoading ? (
        <p className="text-muted">Cargando cola…</p>
      ) : queue.length === 0 ? (
        <div className="card text-center py-8">
          <p className="text-muted">Cola vacía — no hay ofertas esperando revisión.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {queue.map(j => (
            <div key={j.id} className="card">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <h3 className="font-bold">{j.title}</h3>
                  <p className="text-muted text-xs">{j.company_name || 'Sin empresa'} · {fecha(j.created_at)}</p>
                  {j.description && <p className="text-sm text-muted mt-1 line-clamp-2">{j.description}</p>}
                </div>
                <Badge>{j.status}</Badge>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => moderate.mutate({ id: j.id, action: 'approve' })} disabled={moderate.isPending}>
                  ✓ Aprobar
                </Button>
                <Button size="sm" variant="danger" onClick={() => moderate.mutate({ id: j.id, action: 'reject' })} disabled={moderate.isPending}>
                  ✕ Rechazar
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
