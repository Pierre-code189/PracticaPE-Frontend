# Gap Figma vs Código — PracticaPE (Etapa 3, revisión)
Fuente Figma (API real, sin token en logs): nombre "Practicape", 1 página ("Page 1", id 0:1), 0 componentes, 0 estilos, children [] → lienzo vacío. Fondo #1e1e1e aprox. Última modificación 2026-11-06T06:33:15Z. Rol: owner, acceso plan_edit.

| Pantalla Figma | Estado en código | Prioridad |
|---|---|---|
| Page 1 (vacía) | Inicio con hero Field.io, buscador, filtros, stats, destacada | Alta — diseñar pantallas en Figma |
| — | Ofertas + detalle modal + Guardar/Postularme | Alta |
| — | Mapa Leaflet con pines + CTA empresa | Media |
| — | Perfil público LinkedIn + paneles (candidato/negocio/admin) | Media |
| — | Login/registro OTP, empresa pública, dashboard | Media |
| Estilos | CSS Field.io: base #0B0B0F, cyan #0CE0E5→violeta #5B2EFF, Space Grotesk, radio 0 | Alta — replicar tokens en Figma (paints, text styles) |
| Componentes | Botones, chips, tarjetas, badges, inputs (clases CSS, sin componentes Figma) | Alta — crear componentes publicados en Figma |

Conclusión: el diseño vive en código, no en Figma. Próximo paso propuesto: maquetar en Figma las pantallas prioritarias (Inicio, Oferta, Perfil) con los tokens Field.io y re-comparar.

## Actualización: spec creada (2026-11-06)
La REST API de Figma no puede crear/dibujar nodos (solo GET/duplicar Enterprise) — verificado con POST /v1/files → 404. Como spec construible sin esa limitación:
- docs/03-diseno/figma-screens/tokens.json (colores, tipografía, espaciado, radios, motion, componentes)
- docs/03-diseno/figma-screens/pantallas.html (Inicio + Perfil, pantallas prioritarias Field.io)
- docs/03-diseno/figma-screens/pantallas.png (captura)
Gap actualizado: Figma sigue vacío (0 frames); estas maquetas son la spec para construir los frames en la UI de Figma.
