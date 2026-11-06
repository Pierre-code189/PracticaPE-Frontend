# PracticaPE

Bolsa de prácticas y empleos para Piura. Backend FastAPI + SQLite, frontend vanilla JS + Leaflet + canvas Field.io.

## Arranque
```bash
cd /root/Practicape
python3 -m venv .venv && . .venv/bin/activate
pip install -r backend/requirements.txt
python scripts/seed.py           # admin + demo
python scripts/create_admin.py   # asegura admin@practicape.pe
uvicorn --app-dir backend app.main:app --reload --port 8000
```
Abrir http://localhost:8000 — login con OTP (en dev el código se muestra en pantalla).

## Features
- Ofertas con buscador (modalidad, negocio, distrito), mapa Leaflet, detalle público, contacto oculto hasta postular.
- Postulación única con notificación al negocio; guardar ofertas; CV descargable (texto).
- Panel negocio: ficha + mapa + ofertas + postulantes (cambiar estado → notifica).
- Panel candidato: perfil estilo LinkedIn, CRUD de experiencia/educación/etc., fotos, notificaciones, guardadas.
- Panel admin: KPIs + gráficas, cola de borradores (aprobar/rechazar), recolector Bing→borrador (filtro Piura), OTPs, leads.
- Importación social (URL/texto) → borrador; intake de leads; eventos registrados.
- Auth OTP (6 dígitos, expira 10 min) + JWT.

## Tests
```bash
. .venv/bin/activate
python -m pytest tests/ -q
for f in frontend/static/js/*.js; do node --check $f; done
```

## Estructura
- `backend/app/` core (config/database/security), models, routers (auth/jobs/social/collect/admin/profiles), services (social_importer, web_collector)
- `frontend/` index.html + static/{css/app.css, js/{api,field,map,views,main}.js}
- `scripts/` seed.py, create_admin.py, run_collector.py
- `tests/test_api.py` (TestClient, DB temporal)
- `docs/ARQUITECTURA.md`, `docs/API.md`
