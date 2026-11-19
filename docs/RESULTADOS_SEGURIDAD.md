# Resultados — Pruebas de seguridad de PracticaPE

Fecha: 2026-11-19 17:33

51 de 51 casos cumplen el criterio esperado.

| Caso | Sección | Prueba | Esperado | Observado | Resultado |
|---|---|---|---|---|---|
| AU01 | Autenticación | Solicitar OTP con configuración predeterminada | OTP oculto | sin dev_code | Cumple |
| AU02 | Autenticación | Verificar OTP incorrecto | HTTP 400 | HTTP 400 | Cumple |
| AU03 | Autenticación | Verificar OTP correcto | HTTP 200 y JWT | HTTP 200 con token | Cumple |
| AU04 | Autenticación | Reutilizar OTP consumido | HTTP 400 | HTTP 400 | Cumple |
| AU05 | Autenticación | Verificar OTP vencido | HTTP 400 | HTTP 400 | Cumple |
| AU06 | Autenticación | Superar cinco intentos incorrectos | Bloqueo en el 6.º intento | 6.º intento → HTTP 400 (Demasiados intentos) | Cumple |
| AU07 | Autenticación | Pedir otro OTP tras el bloqueo | HTTP 400/429 (no reemitir) | HTTP 429 | Cumple |
| AU07b | Autenticación | Superar la cuota por IP | HTTP 429 tras 12 solicitudes | HTTP 429 | Cumple |
| AU08 | Autenticación | GET /me sin JWT | HTTP 401 | HTTP 401 | Cumple |
| AU09 | Autenticación | GET /me con JWT válido | HTTP 200 | HTTP 200 | Cumple |
| AU10 | Autenticación | GET /me con firma alterada | HTTP 401 | HTTP 401 | Cumple |
| AU11 | Autenticación | GET /me con JWT vencido | HTTP 401 | HTTP 401 | Cumple |
| RO-visitante-listar | Roles | GET /jobs | HTTP 200 | HTTP 200 | Cumple |
| RO-visitante-panel | Roles | GET /admin/dashboard | HTTP 401 | HTTP 401 | Cumple |
| RO-candidato-panel | Roles | GET /admin/dashboard | HTTP 403 | HTTP 403 | Cumple |
| RO-empresa-panel | Roles | GET /admin/dashboard | HTTP 403 | HTTP 403 | Cumple |
| RO-admin-panel | Roles | GET /admin/dashboard | HTTP 200 | HTTP 200 | Cumple |
| RO-visitante-crear | Roles | POST /jobs | HTTP 401 | HTTP 401 | Cumple |
| RO-candidato-crear | Roles | POST /jobs | HTTP 403 | HTTP 403 | Cumple |
| RO-empresa-crear | Roles | POST /jobs | HTTP 200 | HTTP 200 | Cumple |
| RO-admin-sin-empresa | Roles | POST /jobs sin empresa (admin) | HTTP 400 explícito (no 500) | HTTP 400 (El administrador debe tener una empresa para publicar) | Cumple |
| RO-candidato-postular | Roles | POST /jobs/1/apply | HTTP 200 | HTTP 200 | Cumple |
| RO-empresa-postular | Roles | POST /jobs/1/apply | HTTP 403 | HTTP 403 | Cumple |
| RO-visitante-postular | Roles | POST /jobs/1/apply | HTTP 401 | HTTP 401 | Cumple |
| RO-empresa-ajena-postulantes | Roles | GET /jobs/1/applicants | HTTP 403 | HTTP 403 | Cumple |
| RO-admin-postulantes | Roles | GET /jobs/1/applicants | HTTP 200 | HTTP 200 | Cumple |
| RO-empresa-duena-postulantes | Roles | GET /jobs/1/applicants | HTTP 200 | HTTP 200 | Cumple |
| RO-candidato-ajena-postulantes | Roles | GET /jobs/1/applicants | HTTP 403 | HTTP 403 | Cumple |
| MO1 | Matriz ortogonal | GET /admin/dashboard | HTTP 403 | HTTP 403 | Cumple |
| MO2 | Matriz ortogonal | PUT /business/profile (candidato) | HTTP 403 | HTTP 403 | Cumple |
| MO3 | Matriz ortogonal | GET /admin/dashboard | HTTP 401 | HTTP 401 | Cumple |
| MO4 | Matriz ortogonal | PUT /business/profile (JWT alterado) | HTTP 401 | HTTP 401 | Cumple |
| MO5 | Matriz ortogonal | GET /admin/dashboard | HTTP 200 | HTTP 200 | Cumple |
| MO6 | Matriz ortogonal | PUT /business/profile (admin) | HTTP 200 | HTTP 200 | Cumple |
| MO7 | Matriz ortogonal | GET /admin/dashboard | HTTP 401 | HTTP 401 | Cumple |
| MO8 | Matriz ortogonal | PUT /business/profile (JWT alterado) | HTTP 401 | HTTP 401 | Cumple |
| PE01 | Penetración | Solicitar OTP con rol admin y abrir el panel | Acceso denegado (rol no admin) | rol=candidate, panel HTTP 403 | Cumple |
| PE02 | Penetración | Firmar JWT con la clave incluida y abrir el panel | HTTP 401 | HTTP 401 | Cumple |
| PE03 | Penetración | Ver postulantes con otra empresa | HTTP 403 | HTTP 403 | Cumple |
| PE04 | Penetración | Modificar oferta ajena con otra empresa | HTTP 403 | HTTP 403 | Cumple |
| PE05 | Penetración | Enviar ' OR 1=1 -- en GET /jobs?q= | HTTP 200 y 0 filas | HTTP 200 con 0 filas | Cumple |
| PE06 | Penetración | Enviar URL file:// / interna a POST /social/preview | Sin marcador y rechazo | file:///root/.hermes/cache/scratch/canario_practicape.txt→400; http://127.0.0.1/→400; http://169.254.169.254/latest/meta-data/→400; http://localhost/→400; ftp://example.com/x→400 | Cumple |
| VU01 | Visibilidad | GET /jobs/{id} de un borrador sin sesión | HTTP 404 | HTTP 404 | Cumple |
| VU02 | Visibilidad | GET /jobs?status=draft sin sesión | HTTP 200 y 0 filas | HTTP 200 con 0 filas | Cumple |
| VU02b | Visibilidad | GET /jobs?status=draft como candidato | HTTP 403 | HTTP 403 | Cumple |
| VU02c | Visibilidad | GET /jobs/{id} de un borrador como su dueño | HTTP 200 | HTTP 200 | Cumple |
| CI01 | Cifrado | OTP almacenado en SQLite | Hash bcrypt | bcrypt | Cumple |
| CI02 | Cifrado | Solicitar OTP con modo desarrollo apagado | Sin dev_code | sin dev_code | Cumple |
| CI03 | Cifrado | Email guardado en SQLite | No legible | email='u29@oculto.local' cifrado=sí | Cumple |
| CI04 | Cifrado | JSON del inicio de sesión | Sin code_hash | sin code_hash | Cumple |
| CI05 | Cifrado | GET /health por HTTPS en el despliegue | 200 sin redirección insegura | HTTP 200 {"ok":true,"service":"PracticaPE"} | Cumple |

## Notas

- AU01/CI02: el OTP solo se devuelve con `OTP_DEV_CODE=1`; en despliegue se envía por SMTP.
- RO-admin-sin-empresa: el rol admin está autorizado, pero publicar a nombre de una empresa inexistente devuelve 400 explícito (antes 500).
- PE01: el alta pública ya no acepta el rol `admin`; solo lo crea `scripts/create_admin.py`.
- PE02: sin clave predeterminada; `SECRET_KEY` se genera en `data/.secret` (600).
- PE06: `file://`, loopback, link-local e `localhost` quedan rechazados en la importación por URL.
- CI03: el correo se guarda cifrado (Fernet) con un alias no identificable.
