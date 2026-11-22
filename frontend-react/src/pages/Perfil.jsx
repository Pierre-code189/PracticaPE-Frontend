import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/useToast';
import { fecha, initials } from '../api/utils';
import Button from '../components/Button';
import Input from '../components/Input';
import Dialog from '../components/Dialog';

const TIPOS = ['experiencia', 'educacion', 'habilidad', 'idioma', 'certificado'];
const TIPO_LABEL = { experiencia: 'Experiencia', educacion: 'Educación',
  habilidad: 'Habilidades', idioma: 'Idiomas', certificado: 'Certificados' };

export default function Perfil() {
  const { isAuth, user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const qc = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [newItem, setNewItem] = useState({ tipo: 'experiencia', titulo: '', subtitulo: '', fecha_inicio: '', descripcion: '' });
  const [form, setForm] = useState(null);

  const { data: profile, isLoading } = useQuery({
    queryKey: ['myProfile'],
    queryFn: () => api.myProfile(),
    enabled: isAuth,
    onSuccess: d => { if (!form) setForm({ headline: d.headline || '', bio: d.bio || '', city: d.city || '' }); },
  });

  const saveProfile = useMutation({
    mutationFn: (payload) => api.saveMyProfile(payload),
    onSuccess: () => { qc.invalidateQueries(['myProfile']); setEditing(false); toast('Perfil guardado ✓', 'success'); },
    onError: e => toast(e.message, 'error'),
  });

  const addItem = useMutation({
    mutationFn: (payload) => api.addItem(payload),
    onSuccess: () => { qc.invalidateQueries(['myProfile']); setAddOpen(false); toast('Ítem añadido ✓', 'success'); },
    onError: e => toast(e.message, 'error'),
  });

  const deleteItem = useMutation({
    mutationFn: (id) => api.deleteItem(id),
    onSuccess: () => { qc.invalidateQueries(['myProfile']); toast('Eliminado'); },
    onError: e => toast(e.message, 'error'),
  });

  if (!isAuth) return (
    <main className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <p className="text-muted mb-4">Debes iniciar sesión para ver tu perfil.</p>
        <Button onClick={() => navigate('/auth')}>Ingresar →</Button>
      </div>
    </main>
  );

  if (isLoading) return <main className="max-w-3xl mx-auto px-4 py-16 text-muted">Cargando perfil…</main>;

  const p = profile || {};
  const items = p.items || [];

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      {/* Portada + Avatar */}
      <div className="mb-6">
        <div className="h-32" style={{ background: 'linear-gradient(90deg,#0CE0E5,#5B2EFF)' }} />
        <div className="flex items-end gap-4 px-4 -mt-10">
          <div className="w-20 h-20 rounded-full flex items-center justify-center font-extrabold text-2xl border-4 border-bg"
            style={{ background: 'linear-gradient(90deg,#0CE0E5,#5B2EFF)' }}>
            {initials(user?.name || user?.email)}
          </div>
          <div className="flex-1 pb-2">
            <h1 className="font-display font-bold text-xl">{user?.name || user?.email}</h1>
            {p.headline && <p className="text-muted text-sm">{p.headline}</p>}
          </div>
          <Button size="sm" variant="outline" onClick={() => { setForm({ headline: p.headline||'', bio: p.bio||'', city: p.city||'' }); setEditing(true); }}>
            Editar perfil
          </Button>
        </div>
      </div>

      {/* Bio */}
      {p.bio && (
        <div className="card mb-4">
          <h2 className="font-display font-bold text-sm uppercase tracking-widest text-muted mb-2">Acerca de</h2>
          <p className="text-sm leading-relaxed">{p.bio}</p>
        </div>
      )}

      {/* Secciones de ítems */}
      {TIPOS.map(tipo => {
        const list = items.filter(i => i.tipo === tipo);
        return (
          <div key={tipo} className="card mb-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-display font-bold text-sm uppercase tracking-widest text-muted">{TIPO_LABEL[tipo]}</h2>
              <button onClick={() => { setNewItem({ tipo, titulo: '', subtitulo: '', fecha_inicio: '', descripcion: '' }); setAddOpen(true); }}
                className="text-cyan text-xs font-bold hover:underline">+ Añadir</button>
            </div>
            {list.length === 0 ? (
              <p className="text-muted text-xs">Sin {TIPO_LABEL[tipo].toLowerCase()} registrada{tipo === 'habilidad' ? 's' : ''}.</p>
            ) : (
              <ul className="flex flex-col gap-3">
                {list.map(item => (
                  <li key={item.id} className="flex justify-between gap-2 border-t border-white/10 pt-3 first:border-0 first:pt-0">
                    <div>
                      <p className="font-semibold text-sm">{item.titulo}</p>
                      {item.subtitulo && <p className="text-muted text-xs">{item.subtitulo}</p>}
                      {item.fecha_inicio && <p className="text-muted text-xs">{fecha(item.fecha_inicio)}{item.fecha_fin ? ` → ${fecha(item.fecha_fin)}` : ' · Actual'}</p>}
                      {item.descripcion && <p className="text-xs mt-1 leading-relaxed">{item.descripcion}</p>}
                    </div>
                    <button onClick={() => deleteItem.mutate(item.id)} className="text-red-400 text-xs shrink-0 hover:underline">✕</button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}

      {/* Dialog editar perfil */}
      <Dialog open={editing} onClose={() => setEditing(false)} title="Editar perfil">
        <div className="flex flex-col gap-4">
          <Input label="Titular profesional" value={form?.headline || ''} onChange={e => setForm(f => ({ ...f, headline: e.target.value }))} placeholder="Ej: Practicante de Administración" />
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold uppercase tracking-widest text-muted">Acerca de</label>
            <textarea value={form?.bio || ''} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
              className="bg-white/5 border border-white/10 text-ink px-4 py-3 text-sm focus:outline-none focus:border-cyan h-24 resize-none" />
          </div>
          <Input label="Ciudad" value={form?.city || ''} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} placeholder="Piura" />
          <div className="flex gap-2">
            <Button onClick={() => saveProfile.mutate(form)} disabled={saveProfile.isPending}>
              {saveProfile.isPending ? 'Guardando…' : 'Guardar'}
            </Button>
            <Button variant="outline" onClick={() => setEditing(false)}>Cancelar</Button>
          </div>
        </div>
      </Dialog>

      {/* Dialog añadir ítem */}
      <Dialog open={addOpen} onClose={() => setAddOpen(false)} title={`Añadir ${TIPO_LABEL[newItem.tipo]}`}>
        <div className="flex flex-col gap-3">
          <Input label="Título" value={newItem.titulo} onChange={e => setNewItem(i => ({ ...i, titulo: e.target.value }))} />
          <Input label="Subtítulo / empresa" value={newItem.subtitulo} onChange={e => setNewItem(i => ({ ...i, subtitulo: e.target.value }))} />
          <Input label="Fecha inicio" type="date" value={newItem.fecha_inicio} onChange={e => setNewItem(i => ({ ...i, fecha_inicio: e.target.value }))} />
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold uppercase tracking-widest text-muted">Descripción</label>
            <textarea value={newItem.descripcion} onChange={e => setNewItem(i => ({ ...i, descripcion: e.target.value }))}
              className="bg-white/5 border border-white/10 text-ink px-4 py-3 text-sm focus:outline-none focus:border-cyan h-20 resize-none" />
          </div>
          <div className="flex gap-2">
            <Button onClick={() => addItem.mutate(newItem)} disabled={!newItem.titulo || addItem.isPending}>
              {addItem.isPending ? 'Guardando…' : 'Añadir'}
            </Button>
            <Button variant="outline" onClick={() => setAddOpen(false)}>Cancelar</Button>
          </div>
        </div>
      </Dialog>
    </main>
  );
}
