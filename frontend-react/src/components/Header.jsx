import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { initials } from '../api/utils';

export default function Header() {
  const { user, logout, isAuth } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => { logout(); setOpen(false); navigate('/'); };

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between px-6 py-4 border-b border-black/10 bg-bg/90 backdrop-blur-sm">
      <Link to="/" className="font-display font-bold text-xl tracking-tight">
        Practica<span className="grad">PE</span>
      </Link>

      <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-muted">
        <Link to="/ofertas" className="hover:text-ink transition-colors">Ofertas</Link>
        <Link to="/mapa" className="hover:text-ink transition-colors">Mapa</Link>
        <Link to="/empresas" className="hover:text-ink transition-colors">Empresas</Link>
        <Link to="/guias" className="hover:text-ink transition-colors">Guía</Link>
        <Link to="/contacto" className="hover:text-ink transition-colors">Contacto</Link>
      </nav>

      <div className="relative">
        {isAuth ? (
          <>
            <button
              onClick={() => setOpen(o => !o)}
              className="w-9 h-9 rounded-full flex items-center justify-center font-extrabold text-sm text-white"
              style={{ background: 'linear-gradient(90deg,#0E7C66,#4FC3A7)' }}
              aria-expanded={open}
              aria-label="Menú de usuario"
            >
              {initials(user?.name || user?.email)}
            </button>
            {open && (
              <div className="absolute right-0 mt-2 w-48 bg-surface border border-black/10 shadow-2xl z-50">
                <div className="px-4 py-3 border-b border-black/10 text-sm font-semibold truncate">
                  {user?.name || user?.email}
                </div>
                <button onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-error hover:bg-black/[0.04]">
                  Cerrar sesión
                </button>
              </div>
            )}
          </>
        ) : (
          <Link to="/auth">
            <button className="btn-outline text-sm px-4 py-2">Ingresar</button>
          </Link>
        )}
      </div>
    </header>
  );
}
