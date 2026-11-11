# Gap shadcn/ui vs PracticaPE (Etapa 3, auditoría 2026-11-06)
Fuente shadcn: /root/.hermes/tools/repos/shadcn-ui/apps/v4/registry/bases/base/ui/ (React+BaseUI+CVA — se adaptan patrones a vanilla, no se copia código TSX).

| Componente shadcn | Estado en PracticaPE | Prioridad |
|---|---|---|
| Button (default/outline/secondary/ghost/destructive, sizes) | Existe parcial: .btn/.btn.ghost/.btn.danger en app.css, sin variants/sizes sistemáticos, sin focus-visible | Alta |
| Card (header/title/description/content/footer) | Existe parcial: .card genérica sin estructura header/content | Alta |
| Dialog (modal con overlay, foco, ESC) | Existe parcial: modales en views.js sin componente, sin trampa de foco | Alta |
| Badge (variants) | Existe parcial: .tag/.badge sueltos | Media |
| Input/Label/Field (formularios) | Existe parcial: inputs sueltos en views.js | Media |
| Table (postulantes, admin) | Existe parcial: tablas en paneles sin componente | Media |
| Dropdown-menu (menú usuario) | Existe: #user-dropdown en index.html | Baja (ya cableado) |
| Avatar | Existe: iniciales/foto en perfil | Baja |
| Alert/Toast | Existe: toast() con timeout | Baja |
| Tabs (login/registro) | Existe: chip tabs en auth | Baja |

Conclusión: los patrones shadcn (variantes CVA, slots data-slot, estados) no están como componentes; el CSS está en un solo app.css. Se adaptan 3 prioritarios (Button, Card, Dialog) como archivos únicos en frontend/components/ con tokens PracticaPE.

## Componentes adaptados (verificado en navegador)
- frontend/static/components/button.js — variantes default/outline/secondary/ghost/danger + sizes (patrón CVA shadcn), tokens Field.io
- frontend/static/components/card.js — slots Card/Header/Title/Description/Content/Footer
- frontend/static/components/dialog.js — overlay, foco inicial, ESC, aria-modal
- Verificación: los 3 cargan por import dinámico (button outline, card, dialog ok), captura docs/03-diseno/capturas/comp-desktop.png; radio 0 global (*{border-radius:0!important}) verificado en CSS.
- Nota honesta: shadcn v4 es React+BaseUI+Tailwind; se adaptó el patrón a vanilla (no se ejecuta TSX ni se copia marca/Tailwind).
