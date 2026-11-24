# PrácticaPE — Frontend

Interfaz web de **PrácticaPE**: React 19 + JSX + Tailwind CSS, con Vite.
Plataforma peruana de prácticas preprofesionales y primer empleo en Piura.

> La API vive en el repo aparte **[PracticaPE-Backend](https://github.com/Pierre-code189/PracticaPE-Backend)**.
> Este repo es solo el código de la interfaz y su design system.

## Stack

- **React 19** con `react-router-dom` (`BrowserRouter`, rutas sin `#`).
- **Tailwind CSS 3** con la paleta clara del design system Stitch.
- **TanStack Query** para el estado del servidor (`useJobs`, distritos).
- **Vitest + Testing Library** para los tests.
- **Vite 8** como bundler y servidor de desarrollo.

## Puesta en marcha

```bash
cd frontend-react
npm ci
npm run dev          # http://localhost:5173, con proxy de /jobs, /companies… al :8000
```

Levanta antes el backend (repo aparte) si quieres datos reales; sin él la app muestra estados
vacíos y no rompe.

## Build y tests

```bash
npm run build        # salida en frontend-react/dist/
npm run preview      # sirve el build localmente
npm test -- --run    # 101 tests
npm run lint         # oxlint
```

## Rutas públicas

| Ruta | Pantalla |
|---|---|
| `/` | Home con buscador y distritos |
| `/ofertas` | Listado con búsqueda, modalidad y paginación (12/página) |
| `/oferta/:id` | Detalle con enlace al anuncio original |
| `/mapa` | Mapa Leaflet por distrito |
| `/empresas` | Directorio de empresas |
| `/guias` | Guías y ayuda |
| `/contacto` | Contacto |
| `/privacidad`, `/terminos` | Avisos legales |
| `/auth` | Registro/login por OTP |

Los componentes de perfil, paneles, postulaciones y notificaciones siguen en `src/pages/` pero
**ninguna ruta los monta**: el alcance público es consulta y contacto.

## Despliegue

El backend puede servir este build directamente:

```bash
PRACTICAPE_FRONTEND_DIR=/ruta/a/frontend-react/dist uvicorn app.main:app
```

Para servirlo con Nginx de forma independiente:

```bash
docker build -f deploy/frontend.Dockerfile -t practicape-frontend .
docker run -p 8080:80 practicape-frontend
```

`deploy/nginx.conf` ya trae el *fallback* de SPA (`try_files … /index.html`).

## Estructura

```
frontend-react/
├── src/
│   ├── api/client.js        # fetch contra la API + formateo de fecha/salario
│   ├── components/          # un componente por archivo (Header, JobCard, FuenteLink…)
│   ├── context/AuthContext  # sesión y JWT
│   ├── hooks/               # useJobs, useToast
│   └── pages/               # una pantalla por archivo
├── tailwind.config.js       # tokens de marca (paleta clara)
└── vite.config.js           # proxy a la API en desarrollo
.stitch/                     # design system Stitch (DESIGN.md + designs/*.html)
docs/CONTRATO.md             # contrato pantalla ↔ endpoint
```
