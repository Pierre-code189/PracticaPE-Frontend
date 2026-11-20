# PrácticaPE v2 — Informe de verificación

Fecha: 2026-11-19 (hora de Perú)
Rama: `v2-desde-cero` · Repositorio: `github.com/Pierre-code189/PracticaPE`
Producción: https://practicape.apioai.online

## 1. Contrato de pantallas → API

18 pantallas generadas con Stitch (proyecto `16989794354844657044`, design system
`assets/145e3a73db4a45a1906045fca09873b9`) y montadas como SPA por hash.

| Pantalla | Ruta | Endpoint propio |
|---|---|---|
| Inicio | `#/` | `GET /jobs`, `GET /companies` |
| Ofertas | `#/ofertas` | `GET /jobs`, `GET /jobs/districts` |
| Detalle de oferta | `#/oferta/{id}` | `GET /jobs/{id}`, `POST /jobs/{id}/apply`, `GET /me/applications` |
| Acceso OTP | `#/auth` | `POST /auth/request-otp`, `POST /auth/verify-otp` |
| Perfil de candidata | `#/perfil` | `GET/PUT /me/profile` |
| Mis postulaciones | `#/postulaciones` | `GET /me/applications` |
| Directorio de empresas | `#/empresas` | `GET /companies` |
| Mapa de ofertas | `#/mapa` | `GET /jobs/map` |
| Panel de empresa | `#/panel-empresa` | `GET /business/dashboard`, `GET /business/jobs`, `GET /business/profile` |
| Panel de administración | `#/panel-admin` | `GET /admin/dashboard`, `/admin/users`, `/admin/queue`, `/admin/leads` |
| Notificaciones | `#/notificaciones` | `GET /me/notifications`, `PATCH /me/notifications/{id}/read` |
| Perfil público | `#/perfil-publico/{id}` | `GET /profiles/{user_id}` |
| Publicar oferta | `#/publicar-oferta` | `POST /jobs` |
| Contacto | `#/contacto` | `POST /intake` |
| Privacidad / Términos / Libro de reclamaciones | `#/privacidad`, `#/terminos`, `#/libro-de-reclamaciones` | contenido institucional |
| Guía de prácticas | `#/guias` | contenido institucional |

Regla aplicada: todo número y tarjeta visible sale de un endpoint. Lo que Stitch traía de
muestra (nombres, teléfonos, contadores, "¡Enhorabuena!", popovers) se sustituye por el dato
real o por un estado vacío explícito.

## 2. Verificación por capas

**Capa API** — `scripts/e2e_api.py` contra la instancia real: **55/55 PASS**.
Cubre acceso OTP, visibilidad por rol, postulación (y duplicado), empresa, administración,
contacto y límites.

**Capa navegador (local)** — 18 pantallas × 3 viewports (360/780/1024 px): **54/54** sin scroll
horizontal y sin errores JS (`window.__errs` vacío).

**Capa navegador (producción)** — 18 pantallas a 360 px: **18/18** sin scroll horizontal ni
errores. Login OTP completo con código real de Gmail (candidato y empresa), postulación real
(y detección de duplicado), panel de empresa con KPIs reales, mapa con 4 ofertas geolocalizadas.

**Capa de despliegue** — `docker compose up -d` → contenedor `healthy`, `GET /` 200,
`GET /health` ok y 10 ofertas del seed. CI de GitHub (`docker`): E2E de API + build de imagen,
**success** (1m46s).

## 3. Decisiones y correcciones

- **API sin prefijo**: el frontend llama a `/jobs`, no a `/api/jobs`, para que Nginx pueda
  proxyar todo a uvicorn sin reglas extra.
- **OTP por API de Gmail**: el MIME lleva `To`/`From`/`Subject`; sin `To` Gmail responde
  `400 Recipient address required` y el backend lo reportaba como `channel: none`.
- **`SECRET_KEY` compartida**: `email_hash` es HMAC con esa clave; si un script auxiliar usa una
  distinta, el login crea un usuario nuevo en lugar de reconocer al existente.
- **Nodos de Stitch**: no se eliminan elementos que los prototipos referencian (usan
  `display:none`), para no romper sus listeners.
- **Modo oscuro**: capa CSS que re-mapea las variantes `-light` de Stitch a los tokens oscuros
  del propio design system.
- **Datos reales conservados**: la BD de producción se migró a la v2
  (`ALTER TABLE jobs ADD COLUMN category TEXT`) y se conserva `data/.secret`.

## 4. Pendiente / deuda conocida

- El perfil de empresa se crea con el nombre derivado del correo; no hay formulario público de
  edición en esta versión.
- "Descargar reporte" y "Configurar alertas" quedan como avisos (no tienen endpoint).
- Las pantallas legales y la guía traen el texto institucional de Stitch, con correos y
  teléfonos neutralizados.
