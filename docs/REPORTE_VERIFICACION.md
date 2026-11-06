# Reporte de verificación — rebuild desde 0 (sdlc-master, 2026-11-05)
## Contrato de finalización
- [x] URL pública: https://practicape.apioai.online → 200 (web y /health), TLS vigente
- [x] Suite en verde: pytest tests/ → 7 passed
- [x] Seguridad sin críticos: grep secretos limpio; JWT anti-suplantación 401; roles 403; contacto oculto; uploads validados
- [x] Casos borde con códigos reales: 400 validación, 401 sin/falsa sesión, 403 rol cruzado, 404 inexistente/cerrada, 429 intake duplicado, OTP bloqueado, duplicados postulación/guardar
- [x] Capturas desktop + móvil revisadas (docs/capturas/rebuild-*.png); nota honesta: emulación móvil del harness intermitente esta corrida, CSS responsive verificado a 390px en rondas previas
- [x] requirements.txt completo con pytest (fastapi, uvicorn, sqlalchemy, pydantic, python-jose, bcrypt, python-multipart, httpx, beautifulsoup4, pytest)
- [x] docs/ con este reporte + ARQUITECTURA.md + archify/ (workflow, sequence, dataflow HTML validados showcase)
## Defectos hallados y corregidos en QA
1. Detalle de oferta exigía login → público 200 (borrador 404)
2. Intake vacío aceptado → 400 + anti-duplicado 429
3. Item de perfil sin título aceptado → 400
4. Sin endpoint retirar postulación → DELETE /applications/{id} agregado
## Etapas
1 Requisitos aprobada · 2 Archify (CLI+Chrome, 3 diagramas showcase validados y copiados) · 3 Estructura aprobada + Field.io v0 · 4 TDD rebuild desde 0 · 5 Seguridad · 6 QA 8 capas · 7 Deploy systemd+Nginx+TLS · 8 Logs/monitoreo (journalctl -u practicape, dashboard, recolector diario)
## Fallas de la skill registradas
- Archify exigía git+Chrome: disponibles tras snapshot limpio en /tmp (sin .env) + ARCHIFY_CHROME fijado; dataflow requirió iterar rutas/etiquetas (3 ajustes) hasta validar.
- Primera subida de este rebuild usó API distinta a la aprobada (rutas sin /api, auth OTP-only) → se adaptó frontend a su API y se corrigieron 4 defectos reales en QA.
