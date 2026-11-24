import Badge from './Badge';
import Button from './Button';
import FuenteLink from './FuenteLink';
import { salario, fecha } from '../api/utils';

const modalidadVariant = { 'medio tiempo': 'cyan', 'tiempo completo': 'violet', cachuelo: 'default' };

export default function JobCard({ job, onApply, onSave, saved }) {
  if (!job) return null;
  // La API pública devuelve company_name; las ofertas scrapeadas pueden no tener
  // empresa asignada, así que se resuelve a una denominación honesta.
  const empresa = (job.company_name || '').trim() || 'Anuncio externo';
  const initials = empresa.split(/\s+/).slice(0, 2)
    .map(w => w[0] || '').join('').toUpperCase();

  return (
    <article className="card flex flex-col gap-3 min-w-0 overflow-hidden">
      <div className="flex gap-3 items-start">
        <div
          className="w-12 h-12 shrink-0 flex items-center justify-center font-extrabold text-sm"
          style={{ background: 'linear-gradient(90deg,#0E7C66,#4FC3A7)' }}
        >
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-bold text-base leading-tight truncate">{job.title}</h3>
          <p className="text-muted text-sm truncate">{empresa} · {job.district}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        {job.modality && (
          <Badge variant={modalidadVariant[job.modality?.toLowerCase()] || 'default'}>
            {job.modality}
          </Badge>
        )}
        {job.salary && (
          <span className="text-sm font-bold">{salario(job)}</span>
        )}
        {job.schedule && (
          <span className="text-muted text-xs">{job.schedule}</span>
        )}
      </div>

      {job.description && (
        <p className="text-muted text-sm line-clamp-2">{job.description}</p>
      )}

      <div className="flex gap-2 flex-wrap items-center mt-auto pt-3 border-t border-black/10">
        {onApply && (
          <Button size="sm" onClick={() => onApply(job)}>Postularme →</Button>
        )}
        {onSave && (
          <Button size="sm" variant="outline" onClick={() => onSave(job, !saved)}>
            {saved ? '✓ Guardada' : '+ Guardar'}
          </Button>
        )}
        <span className="ml-auto self-center"><FuenteLink url={job.source_url} compacto /></span>
        <span className="text-muted text-xs self-center">{fecha(job.created_at)}</span>
      </div>
    </article>
  );
}
