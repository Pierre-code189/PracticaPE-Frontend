import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Home from './pages/Home';
import Ofertas from './pages/Ofertas';
import Auth from './pages/Auth';
import NotFound from './pages/NotFound';
import './index.css';

const qc = new QueryClient({ defaultOptions: { queries: { retry: 1 } } });

export default function App() {
  return (
    <QueryClientProvider client={qc}>
      <AuthProvider>
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/"           element={<Home />} />
            <Route path="/ofertas"    element={<Ofertas />} />
            <Route path="/auth"       element={<Auth />} />
            <Route path="*"           element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}
