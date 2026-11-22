import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useJob } from '../hooks/useJobs';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/useToast';
import { api } from '../api/client';
import { salario, fecha } from '../api/utils';
import Badge from '../components/Badge';
import Button from '../components/Button';
import Dialog from '../components/Dialog';

const modalidadVariant = { 'medio tiempo': 'cyan', 'tiempo completo': 'violet', cachuelo: 'default' };

export default function OfertaDetalle() {
  const { id } = useParams();
  const { data: job, isLoading, error } = useJob(id);
  const { isAuth, user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [applyOpen, setApplyOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  if (isLoading) return <main className="max-w-3xl mx-auto px-4 py-16 text-muted">Cargando…</main>;
  if (error || !job) return (
    <main className="max-w-3xl mx-auto px-4 py-16">
      <p className="text-muted mb-4">No se encontró la oferta.</p>
      <Link to="/ofertas"><Button variant="outline">← Volver</Button></Link>
    </main>
  );

  const initials = (job.business_name || '?').trim().split(/\s+/).slice(0, 2)
    .map(w => w[0] || '').join('').toUpperCase();

  const handleApply = () => {
    if (!isAuth) { navigate('/auth'); return; }
    setApplyOpen(true);
  };

  const confirmApply = async () => {
    setSaving(true);
    try {
      await api.apply(job.id);
      toast('Postulación enviada ✓', 'success');
      setApplyOpen(false);
    } catch (e) {
      toast(e.message || 'Error al postular', 'error');
    } finally { setSaving(false); }
  };

  const handleSave = async () => {
    if (!isAuth) { navigate('/auth'); return; }
    try {
      await api.saveJob(job.id, true);
      toast('Oferta guardada ✓', 'success');
    } catch (e) { toast(e.message, 'error'); }
  };

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <Link to="/ofertas" className="text-muted text-sm hover:text-ink mb-6 inline-block">← Volver a ofertas</Link>

      <div className="card mb-6">
        <div className="flex gap-4 items-start mb-4">
          <div className="w-16 h-16 shrink-0 flex items-center justify-center font-extrabold text-lg"
            style={{ background: 'linear-gradient(90deg,#0CE0E5,#5B2EFF)' }}>
            {initials}
          </div>
          <div className="flex-1">
            <h1 className="font-display font-bold text-2xl tracking-tight mb-1">{job.title}</h1>
            <p className="text-muted">{job.business_name} · {job.district}, Piura</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {job.modality && <Badge variant={modalidadVariant[job.modality?.toLowerCase()] || 'default'}>{job.modality}</Badge>}
          {job.salary && <span className="font-bold text-sm">{salario(job)}</span>}
          {job.schedule && <span className="text-muted text-sm">{job.schedule}</span>}
          <span className="text-muted text-xs ml-auto self-center">Publicado {fecha(job.created_at)}</span>
        </div>

        {job.description && (
          <div className="border-t border-white/10 pt-4 mb-6">
            <h2 className="font-display font-bold text-sm uppercase tracking-widest text-muted mb-2">Descripción</h2>
            <p className="text-sm leading-relaxed whitespace-pre-line">{job.description}</p>
          </div>
        )}

        {job.requirements && (
          <div className="border-t border-white/10 pt-4 mb-6">
            <h2 className="font-display font-bold text-sm uppercase tracking-widest text-muted mb-2">Requisitos</h2>
            <p className="text-sm leading-relaxed whitespace-pre-line">{job.requirements}</p>
          </div>
        )}

        {/* Contacto solo si ya postulé o soy empresa/admin */}
        {(isAuth && (user?.role === 'business' || user?.role === 'admin')) && job.contact && (
          <div className="border-t border-white/10 pt-4 mb-6">
            <h2 className="font-display font-bold text-sm uppercase tracking-widest text-muted mb-2">Contacto</h2>
            <p className="text-sm">{job.contact}</p>
          </div>
        )}

        <div className="flex gap-3 flex-wrap">
          <Button onClick={handleApply}>Postularme →</Button>
          <Button variant="outline" onClick={handleSave}>+ Guardar</Button>
        </div>
      </div>

      <Dialog open={applyOpen} onClose={() => setApplyOpen(false)} title="Confirmar postulación">
        <p className="text-muted mb-6">
          ¿Confirmas tu postulación a <strong className="text-ink">{job.title}</strong> en {job.business_name}?
        </p>
        <div className="flex gap-2">
          <Button onClick={confirmApply} disabled={saving}>
            {saving ? 'Enviando…' : 'Confirmar'}
          </Button>
          <Button variant="outline" onClick={() => setApplyOpen(false)}>Cancelar</Button>
        </div>
      </Dialog>
    </main>
  );
}
