# PrácticaPE v2

Plataforma peruana de prácticas preprofesionales y primer empleo en Piura.

- **v2** (esta rama): reconstrucción desde cero. Diseño 100% Stitch, backend por capas.
- **PruebaPE**: copia del intento anterior (`/root/PruebaPE`), conservada solo como referencia.

## Estado
- Proyecto Stitch `16989794354844657044`, design system `assets/145e3a73db4a45a1906045fca09873b9`.
- Diseño: `.stitch/DESIGN.md` (la sección 6 es el bloque que va en cada prompt de Stitch).
- Pantallas: `.stitch/designs/*.html` (fuente de verdad) → `frontend/static/pages/` (lo que se sirve).

## Verificación por capas
1. **Contrato** de pantallas (RF/RNF) contra los endpoints — `docs/CONTRATO.md`.
2. **API**: pytest + suite de seguridad + E2E de requisitos.
3. **Navegador**: clics reales por página, 0 errores de consola, responsive 360/780/1024.
4. **Consistencia**: todo dato visible sale de la API; nada de contadores ni tarjetas inventadas.
