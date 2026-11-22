import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/useToast';
import { fecha } from '../api/utils';
import Button from '../components/Button';

export default function Notificaciones() {
  const { isAuth } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['myNotifications'],
    queryFn: api.myNotifications,
    enabled: isAuth,
  });
  const items = Array.isArray(data) ? data : (data?.items || []);

  const mark = useMutation({
    mutationFn: (id) => api.markNotification(id),
    onSuccess: () => { qc.invalidateQueries(['myNotifications']); toast('Marcada como leída'); },
  });

  if (!isAuth) return (
    <main className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <p className="text-muted mb-4">Inicia sesión para ver tus notificaciones.</p>
        <Button onClick={() => navigate('/auth')}>Ingresar →</Button>
      </div>
    </main>
  );

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="font-display font-bold text-3xl uppercase tracking-tight mb-6">Notificaciones</h1>
      {isLoading ? (
        <p className="text-muted">Cargando…</p>
      ) : items.length === 0 ? (
        <div className="card text-center py-10">
          <p className="text-muted">No tienes notificaciones.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map(n => (
            <div key={n.id} className={`card flex justify-between items-start gap-3 ${n.read ? 'opacity-60' : 'border-cyan/30'}`}>
              <div className="flex-1">
                <p className="text-sm">{n.message}</p>
                <p className="text-muted text-xs mt-1">{fecha(n.created_at)}</p>
              </div>
              {!n.read && (
                <button onClick={() => mark.mutate(n.id)} className="text-cyan text-xs font-bold shrink-0 hover:underline">
                  Marcar leída
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
