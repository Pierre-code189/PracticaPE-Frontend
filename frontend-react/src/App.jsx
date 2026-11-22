import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Home from './pages/Home';
import Ofertas from './pages/Ofertas';
import OfertaDetalle from './pages/OfertaDetalle';
import Auth from './pages/Auth';
import Perfil from './pages/Perfil';
import Postulaciones from './pages/Postulaciones';
import Notificaciones from './pages/Notificaciones';
import Mapa from './pages/Mapa';
import Empresas from './pages/Empresas';
import PanelEmpresa from './pages/PanelEmpresa';
import PanelAdmin from './pages/PanelAdmin';
import Contacto from './pages/Contacto';
import Legal from './pages/Legal';
import NotFound from './pages/NotFound';
import './index.css';

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
            {/* Candidato */}
            <Route path="/perfil"         element={<Perfil />} />
            <Route path="/panel"          element={<Perfil />} />
            <Route path="/postulaciones"  element={<Postulaciones />} />
            <Route path="/notificaciones" element={<Notificaciones />} />
            {/* Empresa */}
            <Route path="/panel-empresa"  element={<PanelEmpresa />} />
            {/* Admin */}
            <Route path="/admin"          element={<PanelAdmin />} />
            {/* 404 */}
            <Route path="*"              element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}
