# Quad. — MVP (METACampus · Introducción a la Programación)

Encuentra un quad cerca de tu universidad, con personas verificadas.

Este repositorio contiene el MVP de **Quad**, programado en **React + JavaScript** con **Vite**, a partir del archivo de Figma *Quad App* (página **App**).

> **Nota:** esta app es solo la parte del **estudiante**. El flujo del anfitrión (onboarding A01–A22 y panel) vive en su propio repositorio: <https://github.com/valssse/Quad-Host> (página: <https://valssse.github.io/Quad-Host/>). Al elegir *Ofrezco un Quad* en *¿Cómo usarás Quad?* se abre esa página.

## Estado de los flujos

| Flujo | Pantallas de Figma | Estado |
| --- | --- | --- |
| Onboarding · Compartido | 01a–01i | ✅ Hecho |
| Estudiante · Onboarding y primeras pantallas | E01–E13 | ✅ Hecho |
| Onboarding · Anfitrión | A01–A22 | ✅ Hecho |
| Home (estudiante) | 02, 07–11 | ✅ Hecho |
| Detalle del Quad | 03–06 | ✅ Hecho (los 9 quads) |
| Filtros | — (no está en Figma) | ✅ Hecho |

### Onboarding compartido

`Bienvenida 1 → 2 → 3` → `Inicio (splash)` → `Iniciar sesión` | `Crear cuenta` → `Verificar correo` → `¿Cómo usarás Quad?` → `Permisos`

### Estudiante · Onboarding

`¿Dónde estudias?` → `Verifica que eres estudiante` → `Código` → `Verificado` → `Foto de perfil` (hoja para cámara/galería) → `Tu foto` → `Datos académicos` → `Así aparecerás en una solicitud` → `Sobre ti` → `Presupuesto` → `Punto de referencia` → `Tipo de quad` → `Servicios` → `Convivencia` → `Mudanza` → `Así verán tu perfil` → `Todo listo`

La barra de progreso (n/14) vive fuera de las pantallas, así que avanza animada entre pasos.

### Onboarding · Anfitrión

**Parte 1 · Tu perfil (n/12):** `¿Cómo ofreces tu espacio?` → `Verifica tu identidad` → `Selfie` (hoja cámara/galería) → `Revisa tu selfie` → `Tu teléfono` → `Código SMS` → `Presenta tu casa` → `¿Quiénes viven en la casa?` (hojas para agregar persona y mascota) → `¿Cómo es vivir en tu casa?` → `Preséntate` → `Qué se muestra` → `Universidades cercanas` → `¡Tu perfil está listo!`

**Parte 2 · Publica tu quad (n/9):** `Fotos del cuarto` → `Tipo de cuarto` → `Qué incluye` → `Reglas de la casa` (hojas: agregar regla, hora de llegada, visitas, cocina, convivencia y reglas libres) → `Ubicación` → `Precio y depósito` → `Disponibilidad` → `Casi listo` → `Vista previa` → `Datos de cobro` → `En revisión`

Al empezar la parte 2 la barra se reinicia y vuelve a crecer hacia 1/9. Si en A12 eliges "Hacerlo después", el flujo termina en el panel.

### Home (estudiante)

Al terminar el onboarding de estudiante (o al iniciar sesión con cualquier usuario y contraseña) se entra a `#/app/explorar`. La barra de navegación tiene el efecto Liquid Glass del Figma (refracción con un filtro SVG en Chrome/Edge; vidrio esmerilado en Safari) y la pastilla azul se desliza al tab activo.

- **Inicio (02):** saludo según la hora, buscador, filtros rápidos (filtran los carruseles) y tres carruseles de cards.
- **Guardados (07):** el corazón guarda o quita en toda la app; el contador se actualiza.
- **Mensajes (08):** búsqueda por nombre o quad y filtros; al abrir una conversación se marca como leída.
- **Perfil (09):** usa el nombre, la foto y la carrera del onboarding; "¿Tienes un cuarto libre?" abre el onboarding de anfitrión.
- **Búsqueda (10):** sugerencias de zonas con la parte escrita en azul → resultados de la zona.
- **Mapa (11):** mapa real de OpenStreetMap (Leaflet): se arrastra con el dedo y se acerca o aleja pellizcando. Cada quad está en su colonia real y la UCA aparece marcada. Al tocar un pin sale la vista previa y el carrusel salta a ese quad. Si buscas una zona o aplicas filtros desde el mapa, los resultados se quedan en el mapa (hasta que tocas "Ver lista").
- **Filtros:** el botón junto al buscador abre la pantalla de filtros (precio, cómo llegas, servicios, reglas, calificación y zonas). El botón muestra cuántos filtros hay activos.

### Detalle del Quad

Cada uno de los 9 quads tiene su propia casa, anfitrión, familia, reglas, reseñas y chat (`src/data/detalle.js`). El quad "Cuarto en casa de familia" usa los textos y fotos del Figma; las fotos de las demás personas, mascotas y espacios son de Unsplash.

- **Detalle (03):** galería deslizable con contador (al tocar una foto se abre en pantalla completa), qué incluye, reglas, mapa real (iframe de OpenStreetMap con el quad y la UCA), reseña y barra fija (Preguntar / Solicitar).
- **Perfil de la casa (04):** quiénes viven aquí, convivencia, presentación del anfitrión y desglose de reseñas.
- **Conversación (05):** preguntas sugeridas con respuesta automática, tarjeta de visita (Aceptar / Otra fecha).
- **Proponer otra fecha (06):** hoja con días y horas; la propuesta aparece en el chat.

Las coordenadas salen de OpenStreetMap/Nominatim (`src/data/geo.js`). Mapas © colaboradores de OpenStreetMap.

## Cómo correrlo

```bash
npm install
npm run dev      # servidor local
npm run build    # genera /dist para GitHub Pages
```

## Estructura

```
src/
├── assets/icons/     # SVG de Figma + icons.js (Iconoir, Heroicons e íconos propios)
├── assets/universidades/ # Logos de universidades
├── assets/quads/     # Fotos de los quads (exportadas de Figma)
├── assets/mapa/      # Mapa de la zona de la UCA
├── components/       # Componentes reutilizables (Botón, Campo, Opción, Switch…)
├── data/             # Contenido de las pantallas de bienvenida
├── hooks/            # useHashRoute: navegación por #/ruta
├── screens/          # Una pantalla por archivo (+ su CSS)
│   ├── estudiante/   # Onboarding de estudiante (E01–E13)
│   ├── anfitrion/    # Onboarding de anfitrión (A01–A22)
│   └── home/         # Home del estudiante (Explorar, Guardados, Mensajes, Perfil, Búsqueda, Mapa, Filtros, Detalle, Chat)
└── styles/           # tokens.css (variables de Figma), base.css, components.css
```

## Decisiones técnicas

- **Tokens de Figma → variables CSS** (`styles/tokens.css`): colores, tipografía, espaciados y radios con los mismos nombres del Design System.
- **Navegación por hash** (`#/crear-cuenta`): funciona en GitHub Pages sin configurar el servidor y respeta el botón "atrás".
- **Animaciones** con la librería `motion`: transiciones cortas (≤ 24px, ≤ 0.45s). Se desactivan si el sistema tiene activado "reducir movimiento".
- **Responsivo**: en celular la app ocupa toda la pantalla; en escritorio se muestra dentro de un marco de 390 × 844 (el tamaño del Figma).
- **Tipografía** Plus Jakarta Sans servida localmente con `@fontsource`.
