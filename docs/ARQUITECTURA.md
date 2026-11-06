# Arquitectura PracticaPE

- **Backend**: FastAPI + SQLAlchemy + SQLite (`backend/app/`). JWT (python-jose) + OTP con hash (passlib/bcrypt).
- **Modelos**: User, Otp, Company, CandidateProfile, ProfileItem, Photo, Job, Application (unique job+candidate), SavedJob, Notification, Lead, Event.
- **Routers**: `auth` (OTP request/verify), `jobs` (CRUD, search, map, apply única, save, applicants), `social` (preview/import → borrador), `collect` (Bing → borrador, solo admin), `admin` (dashboard KPIs/gráficas, cola, OTPs, leads), `profiles` (/me perfil/items/fotos/CV/notificaciones, /business, /companies pública, /intake).
- **Servicios**: `social_importer` (parse texto/URL: distrito Piura, modalidad, sueldo), `web_collector` (scraping Bing, filtro keywords Piura, dedup por URL; sin red → [] sin inventar).
- **Frontend**: SPA vanilla en `frontend/`; `index.html` (canvas#field-bg + header menú usuario), `css/app.css` (Field.io: #0B0B0F, cyan #0CE0E5 → violeta #5B2EFF, radio 0), `js/api.js` (fetch+token), `field.js` (canvas animado), `map.js` (Leaflet), `views.js` (home/detalle/auth/paneles), `main.js` (router hash).
- **Reglas de negocio**: contacto de la empresa oculto hasta postular; postulación única; importaciones y recolector crean borradores que admin aprueba.
