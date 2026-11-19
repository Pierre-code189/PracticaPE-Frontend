# Despliegue de PracticaPE

Guía para dejar la app corriendo en internet en **menos de 5 minutos**, con SQLite persistente
y todas las dependencias dentro del contenedor.

La app es un único contenedor: FastAPI sirve API + frontend estático, uvicorn escucha en
`0.0.0.0:$PORT`, y `scripts/entrypoint.sh` ejecuta `init_db()` (crea tablas y migra emails)
antes de arrancar. Un `HEALTHCHECK` consulta `/health`.

---

## 1. Qué hay en el repo

| Fichero | Papel |
|---|---|
| `Dockerfile` | Build multistage: `builder` crea un venv con `backend/requirements.txt`; `runner` es `python:3.12-slim` sin root (`USER app`), copia el venv, `backend/`, `frontend/`, `scripts/` y expone `8000` |
| `docker-compose.yml` | Un servicio `web` con volumen nombrado `practicape_data` → `/app/data` |
| `.dockerignore` | Excluye `.git`, `.venv`, `node_modules`, `data/`, `backend/data`, `__pycache__`, `tests` |
| `scripts/entrypoint.sh` | `init_db()` + arranque de uvicorn (`exec`, para que sea PID 1) |
| `.github/workflows/docker.yml` | CI: valida compose, construye la imagen y hace smoke test de `/health` |

Layout dentro del contenedor:

```
/app
├── backend/     # app FastAPI (package `app`)
├── frontend/    # index.html + static
├── scripts/     # entrypoint.sh, seed.py, ...
└── data/        # VOLUMEN: practicape.db, .secret, uploads/
```

Variables que afectan a las rutas: `PRACTICAPE_DATA_DIR=/app/data` y
`PRACTICAPE_UPLOAD_DIR=/app/data/uploads`. El montaje `/uploads` de `main.py` usa `../data`
relativo al paquete, de modo que ambas rutas coinciden con el volumen.

---

## 2. Arranque local (verificación del artefacto)

```bash
cd /root/Practicape
docker compose up --build          # primera vez ~1–3 min (descarga + pip)
curl -s http://localhost:8000/health
docker compose ps                  # Up (healthy)
docker compose down -v             # parar y borrar el volumen de prueba
```

`OTP_DEV_CODE=1` (default del compose) muestra el código OTP en pantalla: no necesita SMTP.

---

## 3. Despliegue en un clic

### 3.1 Render

1. Entra en <https://render.com> → **New +** → **Web Service** → **Build and deploy from a Git repository**.
2. Conecta GitHub y elige `Pierre-code189/PracticaPE`. Si el repo no aparece, pulsa *Configure account* / sincroniza.
3. Render detecta el `Dockerfile` (Runtime: **Docker**). Deja el branch `etapa-4-rediseno` (o `main`).
4. **Build command**: *(vacío, Render usa el Dockerfile)* — o `docker build -t web .`
   **Start command**: `bash scripts/entrypoint.sh`
5. Plan: **Free** para probar (se duerme a los 15 min y **no admite disco persistente** → SQLite se pierde).
   Para datos que sobrevivan: **Starter $7/mes** (0.5 CPU / 512 MB).
6. **Persistent Disk** (solo planes de pago): añade disco, monta en `/app/data`, tamaño 1 GB.
7. Environment (pestaña *Environment*):

   | Clave | Valor |
   |---|---|
   | `PORT` | `10000` (Render lo inyecta; no hace falta) |
   | `SECRET_KEY` | `openssl rand -hex 48` |
   | `OTP_DEV_CODE` | `0` |
   | `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASSWORD` / `SMTP_FROM` | credenciales SMTP reales |
   | `CORS_ORIGINS` | `https://<tu-dominio>.onrender.com` |
   | `PUBLIC_BASE_URL` | `https://<tu-dominio>.onrender.com` |

8. Pulsa **Create Web Service**. Build ~2–3 min + arranque ~30 s → URL pública con TLS.

### 3.2 Railway

1. <https://railway.com> → **New Project** → **Deploy from GitHub repo** → elige el repo (autoriza la app de Railway).
2. Railway detecta el Dockerfile automáticamente. En **Settings → Deployment**:
   - **Start command**: `bash scripts/entrypoint.sh`
   - `PORT` lo inyecta Railway (no lo fijes).
3. **Volume**: pestaña del servicio → **Volume** → **Add Volume**, monta en `/app/data` (0.5 GB incluido en Free).
4. **Variables** (pestaña *Variables*): mismas que Render (`SECRET_KEY`, `OTP_DEV_CODE=0`, SMTP, `CORS_ORIGINS`, `PUBLIC_BASE_URL`).
5. Deploy: ~2–4 min. Railway da URL `*.up.railway.app` con TLS. En el plan **Free** el volumen es de 0.5 GB y el servicio puede dormir; para uso serio, **Hobby $5/mes**.

### 3.3 Fly.io

1. Instala el CLI (`curl -L https://fly.io/install.sh | sh`) y autentica (`fly auth signup`/`fly auth login`).
2. En el repo: `fly launch --no-deploy --name practicape --region iad --org personal`
   (genera `fly.toml` sin subir nada todavía).
3. Crea el volumen para SQLite y monta en `/app/data`:
   ```bash
   fly volumes create practicape_data --region iad --size 1
   ```
   Añade al `fly.toml` (sección `[mounts]`):
   ```toml
   [mounts]
     source = "practicape_data"
     destination = "/app/data"
   ```
4. `fly secrets set SECRET_KEY=$(openssl rand -hex 48) OTP_DEV_CODE=0 SMTP_HOST=... SMTP_USER=... SMTP_PASSWORD=... SMTP_FROM=... CORS_ORIGINS=https://practicape.fly.dev PUBLIC_BASE_URL=https://practicape.fly.dev`
5. `fly deploy` (~2–4 min). Fly expone HTTPS automáticamente en `https://practicape.fly.dev`.
   Máquina mínima: `shared-cpu-1x` 256 MB (~$2.19/mes). Las facturas de organización personal **por debajo de $5/mes se perdonan**.

> Si no quieres crear `fly.toml` a mano, `fly launch` lo genera solo; solo añade el `[mounts]`.

---

## 4. Variables de entorno (resumen)

Ver la tabla del `README.md`. Las imprescindibles en producción:

- `SECRET_KEY` — si no se define, se genera una en `data/.secret` (600). En un volumen persistente
  sobrevive reinicios; en ephemeral cambia en cada redespliegue y **cierra la sesión a todos**.
- `OTP_DEV_CODE=0` — sin SMTP no hay forma de recibir el código de acceso.
- `SMTP_*` — imprescindibles para el login real (cualquier SMTP con STARTTLS en el 587 vale).
- `CORS_ORIGINS` y `PUBLIC_BASE_URL` — dominio público real, si no la app rechazará llamadas del frontend.

## 5. Coste y tiempo estimados (noviembre 2026)

Tiempos medidos para este repo (pip install + arranque + health):

| Concepto | Tiempo |
|---|---|
| `docker build` (con caché de capas) | 1–3 min |
| Primer `docker compose up` (sin caché) | 2–4 min |
| Deploy en Render/Railway/Fly desde GitHub | 2–5 min en total |
| Healthcheck `/health` responde | < 5 s tras el arranque |

Coste mensual orientativo:

| Plataforma | Opción | Coste | Disco SQLite |
|---|---|---|---|
| Render | Free | $0 | **no** (se pierde al redeployar/dormir) |
| Render | Starter 0.5 CPU / 512 MB | $7/mes | disco 1 GB ~$0.25/mes |
| Railway | Free | $0 ($1 de uso incluido) | 0.5 GB incluido |
| Railway | Hobby | $5/mes (crédito) | hasta 5 GB |
| Fly.io | shared-cpu-1x 256 MB + 1 GB vol. | ~$2.34/mes | 1 GB ~$0.15/mes (factura < $5 perdonada) |

> Precios sujetos a cambios; confirma en la web de cada proveedor antes de usarlo en producción.
> Para una demo o un proyecto pequeño, Render Starter o Fly.io son las opciones más directas.

## 6. Operación y copias de seguridad

- **Backup de SQLite**: `docker compose exec web python -c "import sqlite3;sqlite3.connect('/app/data/practicape.db').backup(sqlite3.connect('/tmp/bak.db'))"`
  (o `docker run --rm -v practicape_data:/data -v $PWD:/backup alpine cp /data/practicape.db /backup/`).
  Restaura parando el contenedor y copiando el fichero de vuelta.
- **Reconstruir tras cambios**: `docker compose up --build` (o redeploy en la plataforma).
- **Logs**: `docker compose logs -f web`.
- **Entrar al contenedor**: `docker compose exec web bash`.

## 7. Resolución de problemas

| Síntoma | Causa | Solución |
|---|---|---|
| `/health` no responde | uvicorn aún arrancando | Espera 20–30 s (start_period del healthcheck) |
| `Address already in use` | puerto ocupado en el host | `HOST_PORT=8002 docker compose up --build` |
| Login no llega el código | `OTP_DEV_CODE=0` sin SMTP | Configura `SMTP_*` o usa `OTP_DEV_CODE=1` solo en local |
| Los datos desaparecen al redeployar | plan sin disco persistente | Monta volumen en `/app/data` (Render Starter, Railway Volume, Fly Volume) |
| `init_db` falla por permisos | volumen propiedad de root | El volumen se crea desde la imagen (`chown app:app`); no lo montes sobre una carpeta con otro owner |
| Frontend da 404 en `/static/...` | imagen construida sin `frontend/` | No uses `.dockerignore` que excluya `frontend` |
