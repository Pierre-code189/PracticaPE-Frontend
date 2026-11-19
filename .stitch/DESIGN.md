# Design System: PrácticaPE
**Producto:** PrácticaPE — plataforma peruana de prácticas preprofesionales y primer empleo en Piura.
**Audiencia:** estudiantes y egresados (18-28) y empresas/empleadores de la región.

## 1. Tema visual
**Atmósfera:** *Costeña, luminosa, con impulso.* Cálida en lo cromático, despejada en lo
espacial, juvenil y confiable. No es estética corporativa fría ni de app de banco: es una
plaza pública digital.
**Filosofía:** "La oportunidad se entiende de un vistazo." En menos de tres segundos un
candidato debe leer: puesto, distrito, modalidad y remuneración.
**Densidad:** media-alta en listados; baja en ficha de oferta y perfil.
**Tono de voz:** directo y alentador en español ("Postula", "Tu práctica", "Publica tu oferta").

## 2. Color (dual)
**Claro:** fondo `#FAF9F4` (blanco hueso), superficie `#FFFFFF`, superficie elevada `#F1EFE6`,
tinta `#14201B`, tinta secundaria `#5A6B63`, primario esmeralda `#0E7C66` (hover `#0A5C4D`),
contenedor primario `#D7F0E7`, acento ámbar `#E8A13A`, contenedor acento `#FBEBCB`,
borde `#E3E0D5`, error `#C0392B`.
**Oscuro:** fondo `#0B1512`, superficie `#12201B`, superficie elevada `#1A2E27`, tinta `#EAF4EF`,
tinta secundaria `#9DB3AA`, primario `#4FC3A7`, primario profundo `#2E9B85`,
contenedor primario `#14382F`, acento `#F2B85C`, borde `#243833`.
**Regla:** contraste WCAG AA (4.5:1 cuerpo, 3:1 grande/elementos interactivos).

## 3. Tipografía
`Plus Jakarta Sans` para titulares y botones; `Inter` para cuerpo, datos y etiquetas.
Display 40/800/1.05 · Titular L 32/700 · Titular M 24/700 · Titular S 18/700 ·
Cuerpo L 16/400 · Cuerpo M 14/400 · Cuerpo S 12/400 · Etiqueta 11/700 mayúsculas con tracking 0.06em.
Cifras con `tabular-nums`. Nunca tres niveles de titular juntos.

## 4. Componentes
**Botones:** primario píldora esmeralda (radio 12px, texto 15/700, padding 12/20); secundario con
borde 1.5px; terciario/enlace sin caja; peligro con borde rojo; deshabilitado opacidad 0.45.
Todo botón de acción muestra estado de carga ("Enviando…").
**Tarjetas:** radio 16px, fondo `#FFFFFF` sobre `#FAF9F4`, sombra suave de dos capas
(`0 1px 2px rgba(20,32,27,.05), 0 8px 24px rgba(20,32,27,.06)`). Hover: sube 2px y el borde se
tiñe de esmeralda. Oferta con remuneración: borde izquierdo 3px ámbar.
**Inputs:** borde 1.5px `#E3E0D5`, radio 12px, padding 12/14, foco con anillo 3px
`rgba(14,124,102,.18)` + borde esmeralda, error debajo en rojo con texto accionable.
**Chips/badges:** píldora 999px, contenedor primario `#D7F0E7` y texto `#0A5C4D`; "remoto" usa
ámbar; estado de postulación con texto (applied, reviewed, accepted, rejected).
**Insignia salarial:** ámbar sobre `#FBEBCB`, tabular-nums, 13/700.
**Navegación:** barra superior fija blanca con filete, 64px, logotipo "PrácticaPE" a la izquierda,
conmutador sol/luna siempre visible. En móvil: hamburguesa y menú a pantalla completa.
**Modo claro/oscuro:** conmutador visible en la barra y en el menú móvil; persiste en
`localStorage` y respeta `prefers-color-scheme`; cambio instantáneo vía tokens CSS.
**Mapa:** mapa claro y desaturado; pines esmeralda con centro blanco; en oscuro se invierte con
`invert(0.92) hue-rotate(180deg) saturate(0.4)`.
**Estados vacíos:** ilustración sobria + una frase + una acción. Nunca "0 resultados" pelado.

## 5. Layout
Contenedor máximo 1200px, márgenes 24px (16px móvil). Retícula de 12 columnas que colapsa a una
en móvil. Secciones separadas 64px escritorio / 40px móvil. Zona de lectura limitada a 720px.
Barra superior fija. En la ficha de oferta el bloque de postulación queda fijo bajo la barra en
móvil. Transiciones 150-250ms ease-out; respeta `prefers-reduced-motion`. Sin scroll horizontal.

## 6. Design System Notes for Stitch Generation

> Bloque que se copia íntegro en el prompt de cada pantalla.

**Identidad:** PrácticaPE — plataforma de prácticas preprofesionales y primer empleo en Piura,
Perú. Estética *costeña luminosa*: cálida, despejada, juvenil y confiable. Español en toda la
interfaz. Nunca mostrar UUID, slugs ni identificadores internos como texto visible.

**Cromatismo (dual):** modo claro sobre fondo `#FAF9F4`, superficies `#FFFFFF`, tinta `#14201B`,
primario esmeralda `#0E7C66` (hover `#0A5C4D`), acento ámbar `#E8A13A`, bordes `#E3E0D5`,
error `#C0392B`. Modo oscuro sobre `#0B1512`, superficie `#12201B`, tinta `#EAF4EF`,
primario `#4FC3A7`, acento `#F2B85C`, bordes `#243833`. Contraste AA siempre.

**Tipografía:** `Plus Jakarta Sans` para titulares y botones; `Inter` para cuerpo, datos y
etiquetas. Display 40/800, Titular L 32/700, Titular M 24/700, Titular S 18/700, Cuerpo M 14/400,
Cuerpo S 12/400, Etiqueta 11/700 con tracking 0.06em. Cifras con `tabular-nums`.

**Forma y profundidad:** radios de 12px en botones e inputs, 16px en tarjetas, 999px en chips.
Sombras suaves de dos capas, nunca duras. Hover de tarjeta: sube 2px y el borde se tiñe de
esmeralda.

**Componentes:** botón primario píldora esmeralda; secundario con borde; inputs con anillo de foco
esmeralda y error en rojo con texto accionable; chips de distrito y modalidad en contenedor
esmeralda suave; insignia salarial ámbar con tabular-nums; barra superior fija blanca con filete
y conmutador sol/luna siempre visible.

**Layout:** contenedor 1200px, márgenes 24px (16px móvil), retícula de 12 columnas que colapsa a
una en móvil, secciones separadas 64px/40px. Zona de lectura limitada a 720px. Móvil primero, sin
scroll horizontal, con menú hamburguesa.

**Interacción y movimiento:** transiciones de 150-250ms ease-out, estados de carga en los botones,
estados vacíos con ilustración y acción, y respeto por `prefers-reduced-motion`.
