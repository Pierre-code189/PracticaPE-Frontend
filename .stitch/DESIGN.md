# Design System: Practicape
**Project ID:** 17882534861998381791
**Producto:** Plataforma peruana de empleo y prácticas preprofesionales para Piura.
**Audiencia:** estudiantes y egresados universitarios (18-28) y empresas/empleadores de la región.

## 1. Visual Theme & Atmosphere

**Atmósfera:** *Costeña, luminosa y con impulso.* Una interfaz que se siente como Piura:
cálida en lo cromático, despejada en lo espacial y con la energía juvenil de quien busca
su primera oportunidad profesional. Nada de estética corporativa fría ni de app de
banco: es una plaza pública digital, cercana y confiable.

**Densidad:** media-alta enlistados (muchas ofertas en poco scroll), baja en ficha de
oferta y en el perfil del candidato. El aire manda en las zonas de lectura; la
información manda en los listados.

**Filosofía:** "La oportunidad se entiende de un vistazo." En menos de tres segundos un
candidato debe poder leer: puesto, distrito, modalidad y remuneración. El resto de la
página existe para apoyar esa decisión, no para competir con ella.

**Tono de voz:** directo y alentador en español ("Postula", "Tu práctica", "Publica tu
oferta"). Sin mayúsculas gritando, sin jerga técnica.

## 2. Color Palette & Roles

Paleta dual (claro y oscuro) con tokens semánticos. El verde es identidad (crecimiento,
mar de Piura, esperanza); el ámbar es acento (sol, arena, energía); el rojo solo
significa error.

**Modo claro**

| Token | Hex | Rol funcional |
|---|---|---|
| Fondo cálido | `#FAF9F4` | Fondo general de la app (blanco hueso, no puro) |
| Superficie | `#FFFFFF` | Tarjetas, inputs, barra superior |
| Superficie elevada | `#F1EFE6` | Hover de tarjeta, chips inactivos, zonas secundarias |
| Tinta principal | `#14201B` | Texto de mayor jerarquía (casi negro verdoso) |
| Tinta secundaria | `#5A6B63` | Texto de apoyo, metadatos, descripciones |
| Primario esmeralda | `#0E7C66` | Botones de acción, enlaces activos, foco |
| Primario profundo | `#0A5C4D` | Hover/pressed del primario, barras de progreso |
| Contenedor primario | `#D7F0E7` | Badges suaves, resaltados, fondo de chips activos |
| Acento ámbar | `#E8A13A` | Remuneración, datos destacados, insignias |
| Contenedor acento | `#FBEBCB` | Fondo de la insignia salarial |
| Borde suave | `#E3E0D5` | Filetes, separadores, bordes de input |
| Error | `#C0392B` | Errores de formulario, acciones destructivas |

**Modo oscuro** (el mismo lenguaje, invertido y con menos contraste especular)

| Token | Hex | Rol |
|---|---|---|
| Fondo | `#0B1512` | Fondo general |
| Superficie | `#12201B` | Tarjetas y barra |
| Superficie elevada | `#1A2E27` | Hover, chips |
| Tinta principal | `#EAF4EF` | Texto principal |
| Tinta secundaria | `#9DB3AA` | Texto de apoyo |
| Primario | `#4FC3A7` | Acciones (versión luminosa del esmeralda) |
| Primario profundo | `#2E9B85` | Hover/pressed |
| Contenedor primario | `#14382F` | Badges y chips |
| Acento | `#F2B85C` | Remuneración destacada |
| Borde | `#243833` | Filetes y bordes |

**Regla de contraste:** todo par texto/fondo cumple WCAG AA (4.5:1 para cuerpo,
3:1 para texto grande y elementos interactivos).

## 3. Typography Rules

**Familias:** `Plus Jakarta Sans` para titulares y botones (carácter geométrico y
amable), `Inter` para cuerpo y datos (legible en tablas y descripciones largas).

| Nivel | Familia | Tamaño escritorio | Peso | Interlineado | Tracking |
|---|---|---|---|---|---|
| Display | Plus Jakarta Sans | 40px | 800 | 1.05 | -0.03em |
| Titular L | Plus Jakarta Sans | 32px | 700 | 1.10 | -0.02em |
| Titular M | Plus Jakarta Sans | 24px | 700 | 1.15 | -0.015em |
| Titular S | Plus Jakarta Sans | 18px | 700 | 1.25 | 0 |
| Cuerpo L | Inter | 16px | 400 | 1.5 | 0 |
| Cuerpo M | Inter | 14px | 400 | 1.5 | 0 |
| Cuerpo S | Inter | 12px | 400 | 1.4 | 0.01em |
| Etiqueta | Inter | 11px | 700 | 1.2 | 0.06em (mayúsculas) |

**Reglas:** una sola familia protagonista por pantalla; nunca tres niveles de
titular juntos; las cifras (salario, contadores) usan `tabular-nums` para que no
bailen al cargar.

## 4. Component Stylings

**Botones:**
- Primario: pildora ligeramente redondeada (radio 12px), fondo esmeralda `#0E7C66`,
  texto blanco 15px/700, padding 12px 20px. Hover `#0A5C4D`; pressed con hundimiento
  de 1px y sombra interior.
- Secundario: borde 1.5px `#E3E0D5`, fondo transparente, texto tinta principal.
  Hover con fondo `#F1EFE6`.
- Terciario/enlace: sin caja, texto esmeralda, subrayado solo en hover.
- Peligro: texto y borde rojos, fondo transparente; el relleno rojo solo para
  "Eliminar cuenta".
- Estado deshabilitado: opacidad 0.45 y `cursor: not-allowed`, nunca gris
  indefinido. Todo botón muestra estado de carga ("Enviando…") para peticiones.

**Tarjetas y contenedores:**
- Radio 16px. Fondo `#FFFFFF` (modo claro) sobre fondo `#FAF9F4`.
- Sombra "susurro": `0 1px 2px rgba(20,32,27,.05), 0 8px 24px rgba(20,32,27,.06)`.
  Sin sombras duras ni biseles.
- Hover de tarjeta de oferta: eleva 2px y la sombra crece un 30%; el borde se
  tiñe de esmeralda al 40%.
- Tarjeta destacada (oferta con insignia de remuneración): borde izquierdo de
  3px ámbar, nunca un recuadro de color entero.

**Inputs y formularios:**
- Caja con borde 1.5px `#E3E0D5`, radio 12px, padding 12px 14px, fondo blanco.
- Foco: anillo de 3px `rgba(14,124,102,.18)` más borde esmeralda; el anillo nunca
  desplaza el layout.
- Label encima, 12px/600, tinta secundaria; error debajo en rojo con icono y
  texto accionable ("El correo no es válido").
- Inputs numéricos y de fecha con el mismo lenguaje visual.

**Chips y badges:**
- Distrito/modalidad: píldora de radio 999px, fondo `#D7F0E7`, texto `#0A5C4D`,
  12px/600. Modalidad "remoto" usa contenedor ámbar; "borrador" usa gris neutro.
- Insignia salarial: ámbar `#E8A13A` sobre `#FBEBCB`, tabular-nums, 13px/700.
- Insignia de estado de postulación: applied=azul grisáceo, reviewed=ámbar,
  accepted=esmeralda, rejected=rojo suave. Siempre con texto, nunca solo color.

**Navegación:**
- Barra superior fija, blanca con filete inferior, altura 64px, logotipo a la
  izquierda con marca de palabra "Practicape" (sin mayúscula estridente).
- Enlaces con estado activo subrayado 2px esmeralda.
- En móvil: barra con logo + botón hamburguesa; menú desplegable a pantalla
  completa con las secciones principales y el conmutador de modo.

**Modo claro/oscuro:**
- Conmutador siempre visible (icono sol/luna) en la barra superior y dentro del
  menú móvil. Persiste en `localStorage` y respeta `prefers-color-scheme` en la
  primera visita. El cambio es instantáneo (sin parpadeo) porque los tokens son
  custom properties en `:root` y `[data-theme="dark"]`.

**Mapa:** mapa claro y desaturado como telón; los marcadores son pines esmeralda
con centro blanco. En oscuro el mapa se invierte con un filtro `invert(0.92)
hue-rotate(180deg) saturate(0.4)`.

**Estados vacíos:** ilustración sobria + una frase + una acción. Nunca una pantalla
en blanco ni un "0 resultados" pelado.

## 5. Layout Principles

- **Rejilla:** contenedor máximo de 1200px con márgenes de 24px (16px en móvil).
  Retícula de 12 columnas en escritorio; en móvil todo apila a una columna.
- **Espaciado:** escala de 4px (4, 8, 12, 16, 24, 32, 48, 64). Secciones
  separadas por 64px en escritorio y 40px en móvil.
- **Listado de ofertas:** en escritorio, dos columnas de tarjetas (lista) o lista +
  mapa fijo de 420px. En móvil, una columna y el mapa se convierte en un panel
  deslizante accesible desde un botón flotante.
- **Zona de lectura:** la ficha de oferta limita el texto a 720px para no tener
  líneas interminables.
- **Sticky:** barra superior fija; en la ficha de oferta, el bloque de postulación
  queda fijo bajo la barra en móvil (acción siempre alcanzable).
- **Movimientos:** transiciones de 150-250ms con `ease-out`; nada de rebotes
  ni animaciones que retrasen una acción. Se respeta `prefers-reduced-motion`.

## 6. Design System Notes for Stitch Generation

> Bloque que se copia íntegro en el prompt de cada pantalla para mantener la
> coherencia visual.

**Identidad:** Practicape — plataforma de empleo y prácticas preprofesionales en
Piura, Perú. Estética *costeña luminosa*: cálida, despejada, juvenil y confiable.
Español en toda la interfaz. Nunca mostrar UUID, slugs ni identificadores internos
como texto visible.

**Cromatismo (dual):** modo claro sobre fondo `#FAF9F4`, superficies `#FFFFFF`,
tinta `#14201B`, primario esmeralda `#0E7C66` (hover `#0A5C4D`), acento ámbar
`#E8A13A`, bordes `#E3E0D5`, error `#C0392B`. Modo oscuro sobre `#0B1512`, superficie
`#12201B`, tinta `#EAF4EF`, primario `#4FC3A7`, acento `#F2B85C`, bordes `#243833`.
Contraste AA siempre.

**Tipografía:** `Plus Jakarta Sans` para titulares y botones; `Inter` para cuerpo,
datos y etiquetas. Display 40/800, Titular L 32/700, Titular M 24/700, Titular S
18/700, Cuerpo M 14/400, Cuerpo S 12/400, Etiqueta 11/700 con tracking 0.06em.
Cifras con `tabular-nums`.

**Forma y profundidad:** radios de 12px en botones e inputs, 16px en tarjetas,
999px en chips. Sombras suaves de dos capas, nunca duras. Hover de tarjeta: sube
2px y el borde se tiñe de esmeralda.

**Componentes:** botón primario pildora esmeralda; secundario con borde; inputs con
anillo de foco esmeralda y error en rojo con texto accionable; chips de distrito y
modalidad en contenedor esmeralda suave; insignia salarial ámbar con tabular-nums;
barra superior fija blanca con filete y conmutador sol/luna siempre visible.

**Layout:** contenedor 1200px, márgenes 24px (16px móvil), retícula de 12 columnas
que colapsa a una en móvil, secciones separadas 64px/40px. Zona de lectura limitada
a 720px. Móvil primero, sin scroll horizontal, con menú hamburguesa.

** interacción y movimiento:** transiciones de 150-250ms ease-out, estados de carga
en los botones, estados vacíos con ilustración y acción, y respeto por
`prefers-reduced-motion`.
