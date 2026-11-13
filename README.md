# Quad. — MVP (METACampus · Introducción a la Programación)

Encuentra un quad cerca de tu universidad, con personas verificadas.

Este repositorio contiene el MVP de **Quad**, programado en **React + JavaScript** con **Vite**, a partir del archivo de Figma *Quad App* (página **App**).

## Estado de los flujos

| Flujo | Pantallas de Figma | Estado |
| --- | --- | --- |
| Onboarding · Compartido | 01a–01i | ✅ Hecho |
| Estudiante · Onboarding y primeras pantallas | E01–E13 | ✅ Hecho |
| Onboarding · Anfitrión | A01–A22 | ✅ Hecho |

### Onboarding compartido

`Bienvenida 1 → 2 → 3` → `Inicio (splash)` → `Iniciar sesión` | `Crear cuenta` → `Verificar correo` → `¿Cómo usarás Quad?` → `Permisos`

### Estudiante · Onboarding

`¿Dónde estudias?` → `Verifica que eres estudiante` → `Código` → `Verificado` → `Foto de perfil` (hoja para cámara/galería) → `Tu foto` → `Datos académicos` → `Así aparecerás en una solicitud` → `Sobre ti` → `Presupuesto` → `Punto de referencia` → `Tipo de quad` → `Servicios` → `Convivencia` → `Mudanza` → `Así verán tu perfil` → `Todo listo`

La barra de progreso (n/14) vive fuera de las pantallas, así que avanza animada entre pasos.

### Onboarding · Anfitrión

**Parte 1 · Tu perfil (n/12):** `¿Cómo ofreces tu espacio?` → `Verifica tu identidad` → `Selfie` (hoja cámara/galería) → `Revisa tu selfie` → `Tu teléfono` → `Código SMS` → `Presenta tu casa` → `¿Quiénes viven en la casa?` (hojas para agregar persona y mascota) → `¿Cómo es vivir en tu casa?` → `Preséntate` → `Qué se muestra` → `Universidades cercanas` → `¡Tu perfil está listo!`

**Parte 2 · Publica tu quad (n/9):** `Fotos del cuarto` → `Tipo de cuarto` → `Qué incluye` → `Reglas de la casa` (hojas: agregar regla, hora de llegada, visitas, cocina, convivencia y reglas libres) → `Ubicación` → `Precio y depósito` → `Disponibilidad` → `Casi listo` → `Vista previa` → `Datos de cobro` → `En revisión`

Al empezar la parte 2 la barra se reinicia y vuelve a crecer hacia 1/9. Si en A12 eliges "Hacerlo después", el flujo termina en el panel.

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
├── components/       # Componentes reutilizables (Botón, Campo, Opción, Switch…)
├── data/             # Contenido de las pantallas de bienvenida
├── hooks/            # useHashRoute: navegación por #/ruta
├── screens/          # Una pantalla por archivo (+ su CSS)
│   ├── estudiante/   # Onboarding de estudiante (E01–E13)
│   └── anfitrion/    # Onboarding de anfitrión (A01–A22)
└── styles/           # tokens.css (variables de Figma), base.css, components.css
```

## Decisiones técnicas

- **Tokens de Figma → variables CSS** (`styles/tokens.css`): colores, tipografía, espaciados y radios con los mismos nombres del Design System.
- **Navegación por hash** (`#/crear-cuenta`): funciona en GitHub Pages sin configurar el servidor y respeta el botón "atrás".
- **Animaciones** con la librería `motion`: transiciones cortas (≤ 24px, ≤ 0.45s). Se desactivan si el sistema tiene activado "reducir movimiento".
- **Responsivo**: en celular la app ocupa toda la pantalla; en escritorio se muestra dentro de un marco de 390 × 844 (el tamaño del Figma).
- **Tipografía** Plus Jakarta Sans servida localmente con `@fontsource`.
