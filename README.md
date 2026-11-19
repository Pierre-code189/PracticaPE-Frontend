# PracticaPE

Bolsa de prácticas y empleos para Piura. Backend FastAPI + SQLite, frontend vanilla JS + Leaflet + canvas Field.io.

## Arranque rápido con Docker (recomendado)

Requisitos: Docker Engine 24+ y Docker Compose v2 (`docker compose version`).

```bash
cd /root/Practicape
docker compose up --build
```

Abre **http://localhost:8000** — login con OTP (en local `OTP_DEV_CODE=1`, el código se muestra en pantalla).

- La BD SQLite, el `.secret` y las subidas viven en el volumen `practicape_data` (`/app/data` dentro del contenedor).
- Parar: `docker compose down` (añade `-v` para borrar también los datos).
- Otro puerto host: `HOST_PORT=8002 docker compose up --build`.
- Reconstruir tras cambios: `docker compose up --build`.

### Verificación

```bash
curl -s http://localhost:8000/health     # {"ok":true,"service":"PracticaPE"}
curl -sI http://localhost:8000/          # HTTP/1.1 200 OK (index.html)
docker compose ps                        # STATUS: Up (healthy)
docker compose logs -f web
```

## Arranque sin Docker

```bash
cd /root/Practicape
python3 -m venv .venv && . .venv/bin/activate
pip install -r backend/requirements.txt
python scripts/seed.py           # admin + demo
python scripts/create_admin.py   # asegura admin@practicape.pe
uvicorn --app-dir backend app.main:app --reload --port 8000
```

## Despliegue en un clic

El repositorio es autocontenido: Dockerfile multistage + `docker-compose.yml` + entrypoint con healthcheck.
Importa el repo en **Render**, **Railway** o **Fly.io** y arranca en ~2–5 min. Guía paso a paso,
variables de entorno, volumen para SQLite y costes estimados en **[docs/DESPLIEGUE.md](docs/DESPLIEGUE.md)**.

| Plataforma | Plan mínimo para datos persistentes | Tiempo estimado |
|---|---|---|
| Render | Starter $7/mes (Free se duerme y no admite disco) | ~3–5 min |
| Railway | Free $0/mes ($1 de crédito) o Hobby $5/mes | ~3–5 min |
| Fly.io | shared-cpu-1x 256 MB ~$2.19/mes (facturas < $5 se perdonan) | ~3–5 min |

## Variables de entorno

| Variable | Default | Uso |
|---|---|---|
| `PORT` | `8000` | Puerto en el que uvicorn escucha en `0.0.0.0` (las plataformas lo inyectan) |
| `PRACTICAPE_DATA_DIR` | `/app/data` | Carpeta de la BD y del `.secret` |
| `PRACTICAPE_UPLOAD_DIR` | `/app/data/uploads` | Carpeta de fotos/subidas |
| `SECRET_KEY` | *(se genera en `data/.secret`, 600)* | Firma JWT. Pon una propia en producción |
| `OTP_DEV_CODE` | `0` (`1` en compose local) | `1` devuelve el código OTP en la respuesta para desarrollo |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASSWORD` / `SMTP_FROM` / `SMTP_TLS` | vacío / `587` / vacío / vacío / `no-reply@practicape.pe` / `1` | Correo OTP. Sin SMTP el login solo funciona con `OTP_DEV_CODE=1` |
| `CORS_ORIGINS` | `http://localhost:8000,...` | Lista separada por comas |
| `PUBLIC_BASE_URL` | `http://localhost:8000` | Base pública para enlaces |
| `SEED_ON_START` | `0` | `1` ejecuta `scripts/seed.py` en el primer arranque |

> En el contenedor las variables se pasan por el platform/compose, no por `.env` (el `env_file` de
> pydantic-settings es relativo al *cwd* `/app/backend`). `docker compose` sí lee `.env` del repo para
> la sustitución de `${...}`.

## Tests

```bash
. .venv/bin/activate
python -m pytest tests/ -q
for f in frontend/static/js/*.js; do node --check "$f"; done
```

## Estructura

- `backend/app/` core (config/database/security), models, routers (auth/jobs/social/collect/admin/profiles), services (social_importer, web_collector, mailer)
- `frontend/` index.html + static/{css/app.css, js/*, components/*}
- `scripts/` seed.py, create_admin.py, entrypoint.sh
- `tests/test_api.py` (TestClient, DB temporal)
- `docs/DESPLIEGUE.md`, `docs/API.md`, `docs/ARQUITECTURA.md`
