import { useState } from 'react';
import { api } from '../api/client';
import { useToast } from '../hooks/useToast';
import Button from '../components/Button';
import Input from '../components/Input';

export default function Contacto() {
  const toast = useToast();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sending, setSending] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setSending(true);
    try {
      await api.intake({ ...form, source: 'contacto' });
      toast('Mensaje enviado ✓', 'success');
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      toast(err.message || 'Error al enviar', 'error');
    } finally { setSending(false); }
  };

  return (
    <main className="max-w-xl mx-auto px-4 py-16">
      <h1 className="font-display font-bold text-3xl uppercase tracking-tight mb-2">Contacto</h1>
      <p className="text-muted mb-8">¿Tienes una consulta o quieres publicar una oferta? Escríbenos.</p>
      <form onSubmit={handleSubmit} className="card flex flex-col gap-4">
        <Input label="Nombre" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
        <Input label="Correo electrónico" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold uppercase tracking-widest text-muted">Mensaje</label>
          <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
            className="bg-black/[0.04] border border-black/10 text-ink px-4 py-3 text-sm focus:outline-none focus:border-cyan h-32 resize-none"
            required />
        </div>
        <Button type="submit" disabled={sending}>
          {sending ? 'Enviando…' : 'Enviar mensaje →'}
        </Button>
      </form>
    </main>
  );
}
