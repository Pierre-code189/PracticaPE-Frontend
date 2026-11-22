import { useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { fecha } from '../api/utils';
import Badge from '../components/Badge';
import Button from '../components/Button';

const STATUS_LABEL = { applied: 'Enviada', seen: 'Vista', interview: 'Entrevista', rejected: 'Rechazada', accepted: 'Aceptada' };
const STATUS_VARIANT = { applied: 'default', seen: 'cyan', interview: 'violet', rejected: 'danger', accepted: 'success' };

export default function Postulaciones() {
  const { isAuth } = useAuth();
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ['myApplications'],
    queryFn: api.myApplications,
    enabled: isAuth,
  });
  const items = Array.isArray(data) ? data : (data?.items || []);

  if (!isAuth) return (
    <main className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <p className="text-muted mb-4">Inicia sesión para ver tus postulaciones.</p>
        <Button onClick={() => navigate('/auth')}>Ingresar →</Button>
      </div>
    </main>
  );

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="font-display font-bold text-3xl uppercase tracking-tight mb-6">Mis postulaciones</h1>
      {isLoading ? (
        <p className="text-muted">Cargando…</p>
      ) : items.length === 0 ? (
        <div className="card text-center py-10">
          <p className="text-muted mb-4">Aún no te has postulado a ninguna oferta.</p>
          <Link to="/ofertas"><Button variant="outline">Ver ofertas →</Button></Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map(a => (
            <Link key={a.id} to={`/oferta/${a.job_id}`}>
              <article className="card hover:border-cyan/40 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-bold truncate">{a.title || 'Oferta'}</h3>
                    <p className="text-muted text-xs">{a.company_name || ''}</p>
                  </div>
                  <Badge variant={STATUS_VARIANT[a.status] || 'default'}>
                    {STATUS_LABEL[a.status] || a.status}
                  </Badge>
                </div>
                <p className="text-muted text-xs mt-2">Enviada el {fecha(a.created_at)}</p>
              </article>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
