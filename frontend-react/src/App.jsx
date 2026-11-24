import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Home from './pages/Home';
import Ofertas from './pages/Ofertas';
import OfertaDetalle from './pages/OfertaDetalle';
import Auth from './pages/Auth';
import Mapa from './pages/Mapa';
import Empresas from './pages/Empresas';
import Contacto from './pages/Contacto';
import Legal from './pages/Legal';
import NotFound from './pages/NotFound';
import './index.css';

// Web pública: solo consulta y contacto. Los componentes de perfil, paneles,
// postulaciones y notificaciones siguen en src/pages/ (no se han borrado), pero
// ninguna ruta los monta; cualquier URL antigua cae en el 404.
const qc = new QueryClient({ defaultOptions: { queries: { retry: 1, staleTime: 30_000 } } });

export default function App() {
  return (
    <QueryClientProvider client={qc}>
      <AuthProvider>
        <BrowserRouter>
          <Header />
          <Routes>
            {/* Públicas */}
            <Route path="/"               element={<Home />} />
            <Route path="/ofertas"        element={<Ofertas />} />
            <Route path="/oferta/:id"     element={<OfertaDetalle />} />
            <Route path="/mapa"           element={<Mapa />} />
            <Route path="/empresas"       element={<Empresas />} />
            <Route path="/contacto"       element={<Contacto />} />
            <Route path="/terminos"       element={<Legal tipo="terminos" />} />
            <Route path="/privacidad"     element={<Legal tipo="privacidad" />} />
            <Route path="/guias"          element={<Legal tipo="guias" />} />
            <Route path="/legal/:tipo"    element={<Legal />} />
            {/* Auth */}
            <Route path="/auth"           element={<Auth />} />
            {/* 404 */}
            <Route path="*"              element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}
