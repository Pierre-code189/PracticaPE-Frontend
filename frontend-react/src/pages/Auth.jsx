import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/useToast';
import Button from '../components/Button';
import Input from '../components/Input';

export default function Auth() {
  const [tab, setTab] = useState('login'); // 'login' | 'register'
  const [step, setStep] = useState('email'); // 'email' | 'otp'
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('candidato');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const sendOtp = async () => {
    if (!email) return;
    setLoading(true);
    try {
      await api.requestOtp(email, tab === 'register' ? role : undefined);
      setStep('otp');
      toast('Código OTP enviado a ' + email);
    } catch (e) {
      toast(e.message || 'Error', 'error');
    } finally { setLoading(false); }
  };

  const verifyOtp = async () => {
    if (!otp) return;
    setLoading(true);
    try {
      const user = await login(email, otp);
      toast('¡Bienvenido, ' + (user?.name || user?.email) + '!', 'success');
      navigate(user?.role === 'admin' ? '/admin' : user?.role === 'negocio' ? '/panel-empresa' : '/panel');
    } catch (e) {
      toast(e.message || 'Código incorrecto', 'error');
    } finally { setLoading(false); }
  };

  return (
    <main className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <h1 className="font-display font-bold text-3xl uppercase tracking-tight mb-8">
          {tab === 'login' ? 'Ingresar' : 'Crear cuenta'}
        </h1>

        {/* Tabs */}
        <div className="flex border-b border-white/10 mb-8">
          {[['login','Ya tengo cuenta'],['register','Crear cuenta']].map(([t, label]) => (
            <button
              key={t}
              onClick={() => { setTab(t); setStep('email'); setOtp(''); }}
              className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors ${
                tab === t
                  ? 'border-cyan text-ink'
                  : 'border-transparent text-muted hover:text-ink'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {step === 'email' ? (
          <div className="flex flex-col gap-4">
            <Input
              label="Correo electrónico"
              type="email"
              name="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="tucorreo@gmail.com"
            />
            {tab === 'register' && (
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold uppercase tracking-widest text-muted">Rol</label>
                <select
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  className="bg-white/5 border border-white/10 text-ink px-4 py-3 text-sm focus:outline-none focus:border-cyan"
                >
                  <option value="candidato">Candidato / Practicante</option>
                  <option value="negocio">Negocio / Empresa</option>
                </select>
              </div>
            )}
            <Button onClick={sendOtp} disabled={loading || !email}>
              {loading ? 'Enviando...' : 'Recibir código OTP →'}
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <p className="text-muted text-sm">Ingresa el código de 6 dígitos enviado a <strong className="text-ink">{email}</strong></p>
            <Input
              label="Código OTP"
              type="text"
              name="otp"
              value={otp}
              onChange={e => setOtp(e.target.value)}
              placeholder="123456"
              maxLength={6}
            />
            <Button onClick={verifyOtp} disabled={loading || otp.length < 6}>
              {loading ? 'Verificando...' : 'Ingresar →'}
            </Button>
            <button onClick={() => setStep('email')} className="text-muted text-sm hover:text-ink">
              ← Cambiar correo
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
