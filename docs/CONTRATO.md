# Contrato de pantallas — PrácticaPE v2

Cada pantalla debe poder responder con datos reales de la API. Si un dato no tiene
endpoint, no se muestra (regla de oro: nada de contadores ni tarjetas inventadas).

## Mapa de áreas y pantallas

| Área | Pantalla | Ruta | Endpoint principal |
|---|---|---|---|
| Descubrimiento | Home | `#/` | `GET /jobs?status=published` |
| Descubrimiento | Listado de ofertas | `#/ofertas` | `GET /jobs` + `GET /jobs/districts` |
| Descubrimiento | Detalle de oferta | `#/oferta/{id}` | `GET /jobs/{id}`, `POST /jobs/{id}/apply` |
| Descubrimiento | Mapa de ofertas | `#/mapa` | `GET /jobs/map` |
| Acceso | Código de acceso (OTP) | `#/auth` | `POST /auth/request-otp`, `/auth/verify-otp` |
| Candidato | Perfil de candidato | `#/perfil` | `GET/PUT /me/profile`, `/me/profile/items`, `/me/cv` |
| Candidato | Mis postulaciones | `#/postulaciones` | `GET /me/applications` |
| Candidato | Notificaciones | `#/notificaciones` | `GET/PATCH /me/notifications` |
| Candidato | Perfil público | `#/perfil/{id}` | `GET /profiles/{id}` |
| Empresa | Panel de empresa | `#/panel-empresa` | `GET /business/dashboard`, `GET /business/jobs` |
| Empresa | Publicar/editar oferta | `#/panel-empresa/oferta/{id}` | `POST /jobs`, `PUT /jobs/{id}` |
| Empresa | Directorio de empresas | `#/empresas` | `GET /companies` |
| Administración | Panel admin | `#/panel-admin` | `GET /admin/dashboard` |
| Administración | Cola de moderación | `#/panel-admin/cola` | `GET /admin/queue`, `PATCH /admin/queue/{id}` |
| Administración | Leads | `#/panel-admin/leads` | `GET /admin/leads` |
| Contacto | Contacto / intake | `#/contacto` | `POST /intake` |

## RF/RNF que el diseño debe cubrir
- RF01 registro e inicio (OTP) · RF02 perfiles · RF03 gestión de ofertas · RF04 consulta ·
  RF05 búsqueda y filtros · RF06 geolocalización · RF07 mapa con distancia · RF08 postulación ·
  RF09 seguimiento de postulaciones · RF10 comunicación · RF11 administración.
- RNF01 usabilidad · RNF02 responsive · RNF03 rendimiento · RNF04 seguridad · RNF05 disponibilidad ·
  RNF06 compatibilidad · RNF07 mantenibilidad · RNF08 escalabilidad · RNF09 integridad ·
  RNF10 privacidad · RNF11 precisión geográfica.

## Capas de verificación
1. **Contrato**: cada control de la pantalla tiene su endpoint y su estado de error/vacío.
2. **API**: pytest + suite de seguridad (auth, roles, visibilidad, datos) + E2E de RF.
3. **Navegador**: clics reales por pantalla, 0 errores de consola, responsive 360/780/1024.
4. **Consistencia**: contadores, tarjetas y estados salen de la API; borradores no se filtran.
