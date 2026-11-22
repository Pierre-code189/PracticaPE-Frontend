import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';
import { salario, fecha } from '../api/utils';

export default function Mapa() {
  const mapRef = useRef(null);
  const leafletRef = useRef(null);
  const [q, setQ] = useState('');
  const [selected, setSelected] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['jobMap'],
    queryFn: () => api.jobMap({ limit: 200 }),
    staleTime: 60_000,
  });
  const items = data?.items || (Array.isArray(data) ? data : []);

  useEffect(() => {
    if (!mapRef.current || !items.length) return;
    // Leaflet ya está disponible como CDN en index.html
    const L = window.L;
    if (!L) return;
    if (leafletRef.current) { leafletRef.current.remove(); }
    const map = L.map(mapRef.current, { scrollWheelZoom: false })
      .setView([-5.1945, -80.6336], 10);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19, attribution: '© OpenStreetMap',
    }).addTo(map);
    const icon = L.divIcon({
      className: '',
      html: '<div style="width:28px;height:28px;background:linear-gradient(90deg,#0CE0E5,#5B2EFF);display:flex;align-items:center;justify-content:center;font-size:14px;">📍</div>',
      iconSize: [28, 28], iconAnchor: [14, 28],
    });
    items.forEach(j => {
      if (typeof j.lat !== 'number' || typeof j.lng !== 'number') return;
      const m = L.marker([j.lat, j.lng], { icon, title: j.title }).addTo(map);
      m.on('click', () => setSelected(j));
    });
    leafletRef.current = map;
    return () => { if (leafletRef.current) { leafletRef.current.remove(); leafletRef.current = null; } };
  }, [items]);

  const filtered = q
    ? items.filter(j =>
        (j.title || '').toLowerCase().includes(q.toLowerCase()) ||
        (j.district || '').toLowerCase().includes(q.toLowerCase())
      )
    : items;

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row gap-2 items-start md:items-center justify-between mb-6">
        <h1 className="font-display font-bold text-3xl uppercase tracking-tight">
          Ofertas en el mapa
        </h1>
        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="Buscar puesto o distrito..."
          className="bg-white/5 border border-white/10 text-ink px-4 py-2 text-sm focus:outline-none focus:border-cyan w-full md:w-64"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Mapa */}
        <div className="lg:col-span-2">
          {isLoading ? (
            <div className="h-96 bg-surface border border-white/10 flex items-center justify-center text-muted">
              Cargando mapa…
            </div>
          ) : (
            <div ref={mapRef} className="w-full h-96 lg:h-[520px] border border-white/10" />
          )}
        </div>

        {/* Panel lateral */}
        <div className="flex flex-col gap-3 max-h-[520px] overflow-y-auto pr-1">
          {selected && (
            <article className="card border-cyan/50">
              <p className="text-xs text-cyan font-bold uppercase tracking-widest mb-1">Seleccionada</p>
              <h3 className="font-display font-bold text-base">{selected.title}</h3>
              <p className="text-muted text-sm mb-2">{selected.business_name} · {selected.district}</p>
              {salario(selected) && <p className="text-sm font-bold mb-3">{salario(selected)}</p>}
              <Link to={`/oferta/${selected.id}`}>
                <button className="btn-primary text-sm w-full">Ver oferta →</button>
              </Link>
            </article>
          )}
          {filtered.slice(0, 10).map(j => (
            <article key={j.id} className="card cursor-pointer hover:border-cyan/40 transition-colors"
              onClick={() => setSelected(j)}>
              <h3 className="font-bold text-sm truncate">{j.title}</h3>
              <p className="text-muted text-xs">{j.business_name} · {j.district}</p>
              {salario(j) && <p className="text-xs font-bold mt-1">{salario(j)}</p>}
            </article>
          ))}
          {filtered.length === 0 && (
            <p className="text-muted text-sm">Sin resultados para "{q}"</p>
          )}
        </div>
      </div>

      <p className="text-muted text-xs mt-4">{items.length} ofertas georreferenciadas en Región Piura · © OpenStreetMap</p>
    </main>
  );
}
