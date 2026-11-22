import { Link } from 'react-router-dom';
import Button from '../components/Button';

export default function NotFound() {
  return (
    <main className="min-h-[60vh] flex flex-col items-center justify-center gap-6 text-center px-4">
      <h1 className="font-display font-bold text-6xl uppercase tracking-tight grad">404</h1>
      <p className="text-muted text-lg">Esta página no existe.</p>
      <Link to="/"><Button variant="outline">← Volver al inicio</Button></Link>
    </main>
  );
}
